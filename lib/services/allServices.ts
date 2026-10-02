import { updateTag } from "next/cache";
import { auth } from "@/auth";
import { v2 as cloudinary } from "cloudinary";
import blockeds from "@/lib/blocked";
import { filterFileSizeAndType, getVideoId } from "@/lib/helpers/allHelpers";
import { webPushNotif } from './webPushService';
//DB AND MODELS
import { Types } from "mongoose";
import { db } from "@/lib/db";
import Pubs from "@/lib/models/pubs";
import Users from "@/lib/models/users";
//TYPES
import {
  ResponseComment,
  ResponseDelete,
  ResponsePub,
} from "@/lib/types/response";
//********************** I N I T ****************************
const PubModel = Pubs as any;
const UserModel = Users as any;
//CLOUDYNARI CREDENTIALS
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
//SERVICES
export default {
  async like(id: string) {
    // 1. Verificar autenticación directamente en el servidor por seguridad
    const session = await auth();
    if (!session || !session.user) {
      return { status: "UNAUTHORIZED" };
    }

    const userId = session.user.id; // O el identificador único del usuario

    await db();

    // 2. Operación atómica con $addToSet (agrega solo si no existe en el array)
    const updatedPub = await PubModel.findOneAndUpdate(
      { _id: id, "likes.author": { $ne: userId } }, // Condición: que el id coincida Y el usuario NO esté en la lista
      { $push: { likes: { author: userId } } },
      { new: true },
    );

    // Si no actualizó nada, significa que el usuario ya había dado like
    if (!updatedPub) {
      return { status: "EXISTS" };
    }

    //revaldiate cache
    updateTag("pubsPage-1");

    return { status: "OK" };
  },
  async upComment(
    prevState: ResponseComment,
    form: FormData,
  ): Promise<ResponseComment> {
    //@ts-ignore
    const { user } = await auth();
    if (!user) return { errors: "UNAUTHORIZED" };
    if (blockeds.includes(user.email)) return { errors: "UNAUTHORIZED" };
    //VERIFY CLOUDFLARE TOKEN
    const token = form.get("token");
    if (!token || typeof token !== "string") return { errors: "UNAUTHORIZED" };
    const result = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`,
      },
    );
    const data = await result.json();
    if (!data.success) return { errors: "UNAUTHORIZED" };
    //EXTRACT DATA FROM FORMDATA
    const image = form.get("image") as File;
    const rawComment = form.get("comment");
    const rawId = form.get("id");
    const comment = typeof rawComment === "string" ? rawComment.trim() : "";
    const id = typeof rawId === "string" ? rawId : null;
    //VERIFY DATA INTEGRITY
    if (!id) return { errors: "BADID" };
    if (!image && !comment) return { errors: "EMPTY" };
    if (comment && comment.length > 500) return { errors: "LARGECOMMENT" };
    //FOR TEXT COMMENTS
    if (comment) {
      await db();
      const userProfile = (await UserModel.findOne(
        { email: user.email },
        { image: 1, _id: 0 },
      ).lean()) as { image?: string | null } | null;

      const imgDB = userProfile?.image ?? null;

      await PubModel.updateOne(
        { _id: id },
        {
          $push: {
            comments: {
              author: user.name,
              avatar: imgDB,
              msg: comment,
            },
          },
        },
      );

      //REVALIDATE CACHE
      updateTag("pubsPage-1");
      updateTag("pubsPage-2");

      return { message: comment };
    }
    //FOR FILES
    if (image) {
      if (!filterFileSizeAndType(image, "image")) return;
      const binary = await image.arrayBuffer();
      const buffer = Buffer.from(binary);

      const url: string = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({}, (err, res) => {
            if (err) return reject(err);
            if (res) return resolve(res.secure_url);
          })
          .end(buffer);
      });

      await db();
      const userProfile = (await UserModel.findOne(
        { email: user.email },
        { image: 1, _id: 0 },
      ).lean()) as { image?: string | null } | null;

      const imgDB = userProfile?.image ?? null;

      await PubModel.updateOne(
        { _id: id },
        {
          $push: {
            comments: {
              author: user.name,
              avatar: imgDB,
              msg: url,
            },
          },
        },
      );

      //REVALIDATE CACHE
      updateTag("pubsPage-1");

      return { message: url };
    }
  },
  async publicate(
    prevState: ResponsePub,
    form: FormData,
  ): Promise<ResponsePub> {
    //GET SESSION
    const { user } = await auth();
    if (!user) return { errors: { server: "UNAUTHORIZED" } };
    if (blockeds.includes(user.email))
      return { errors: { server: "UNAUTHORIZED" } };
    //GET USER DATA FROM DB
    await db();
    const { image: imgDB, pubcountperday } = await UserModel.findOne(
      { email: user.email },
      { image: 1, _id: 0, pubcountperday: 1 },
    ).lean();
    //CHECK PUBS PER DAY LIMIT
    if (pubcountperday <= 0) return { errors: { server: "MAXLIMITPERDAY" } };
    //SUBSTRACT ONE PUBCOUNTPERDAY
    await UserModel.findOneAndUpdate(
      { email: user.email },
      { $inc: { pubcountperday: -1 } },
    );
    //INIT
    const type = form.get("type") as string;
    const title = (form.get("title") as string) || "";
    const description = (form.get("description") as string) || "";
    const image = (form.get("image") as File) || null;
    const audio = (form.get("audio") as File) || null;
    const yt = (form.get("yt") as string) || null;
    //TITLE MANDATORY
    if (!title || title.length > 50) return { errors: { server: "NOTITLE" } };
    //SWITCH TYPE
    switch (type) {
      //TEXT
      case "text": {
        if (!description || description.length > 500)
          return { errors: { server: "BADDESCRIPTION" } };
        await PubModel.create({
          author: user.name,
          avatar: imgDB,
          title: title.trim(),
          description: description.trim(),
        });
        //REVALIDATE CACHE
        updateTag("pubsPage-1");
        updateTag("pubsPage-2");

        return { message: "OK" };
      }
      //IMAGE
      case "image": {
        //IMG FILTER
        if (description && description.length > 500)
          return { errors: { server: "LARGEDESCRIPTION" } };
        if (!filterFileSizeAndType(image, "image"))
          return { errors: { server: "BADFILE" } };
        //START PROCESS
        const binary = await image.arrayBuffer();
        const buffer = Buffer.from(binary);

        const url: string = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({}, (err, res) => {
              if (err) return reject(err);
              if (res) return resolve(res.secure_url);
            })
            .end(buffer);
        });

        //SAVE PUB TO DB
        await PubModel.create({
          author: user.name,
          avatar: imgDB,
          title: title.trim(),
          description: description.trim(),
          image: url,
        });
        //SEND WEB PUSH NOTIFICATION
        await webPushNotif(title.trim(), url, description.trim());

        //REVALIDATE CACHE
        updateTag("pubsPage-1");
        updateTag("pubsPage-2");

        return { message: "OK" };
      }
      //VIDEO
      case "video": {
        if (!yt) return { errors: { yt: ["No hay link de yt"] } };
        const yt_id = getVideoId(yt.trim());
        if (!yt_id) return { errors: { yt: ["Link de yt erróneo"] } };
        //SAVE TO DB
        await PubModel.create({
          author: user.name,
          avatar: imgDB,
          title: title.trim(),
          yt: yt_id,
        });
        //REVALIDATE CACHE
        updateTag("pubsPage-1");
        updateTag("pubsPage-2");

        return { message: "OK" };
      }
      //AUDIO
      case "audio": {
        if (description && description.length > 500)
          return { errors: { server: "LARGEDESCRIPTION" } };
        //FILTER AUDIO FILE
        if (!filterFileSizeAndType(audio, "audio"))
          return { errors: { server: "BADFILE" } };
        //START PROCESS
        const binary = await audio.arrayBuffer();
        const buffer = Buffer.from(binary);

        const url: string = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, (err, res) => {
              if (err) return reject(err);
              if (res) return resolve(res.secure_url);
            })
            .end(buffer);
        });

        //SAVE PUB TO DB
        await PubModel.create({
          author: user.name,
          avatar: imgDB,
          title: title.trim(),
          description: description.trim(),
          audio: url,
        });
        //WEBPUSH NOTIFICATION
        await webPushNotif(title.trim(), "", description.trim());

        //REVALIDATE CACHE
        updateTag("pubsPage-1");
        updateTag("pubsPage-2");

        return { message: "OK" };
      }
    }

    return { errors: { server: "PROBLEM" } };
  },
  async Delete(form: FormData): Promise<ResponseDelete> {
    //GET SESSION
    const { user } = await auth();
    if (!user) return { errors: "UNAUTHORIZED" };
    if (blockeds.includes(user.email)) return { errors: "UNAUTHORIZED" };
    //EXTRACT VARS
    const type = form.get("type") as string;
    const id = form.get("id") as string;
    const src = (form.get("src") as string) || null;
    if (!Types.ObjectId.isValid(id)) return { errors: "BADID" };
    await db();
    const stat = await PubModel.find({
      _id: new Types.ObjectId(id),
      author: user.name,
    }).lean();
    if (stat.length == 0) return { errors: "UNAUTHORIZED" };
    await PubModel.findByIdAndDelete(id);
    //DELETE SRC FROM CLOUDYNARI
    if (type == "image" || type == "audio") {
      if (!src) return { errors: "NOSOURCE" };
      const srcCode = src.replace(/.{4}$/, "");
      cloudinary.uploader.destroy(srcCode, (err, res) => {
        if (err) return { errors: "CLOUDINARYPROBLEM" };
      });
    }
    //revaldiate cache
    updateTag("pubsPage-1");
    updateTag("pubsPage-2");

    return { message: "OK" };
  },
};
