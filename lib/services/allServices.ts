import { updateTag } from "next/cache";
import { auth } from "@/auth";
import { v2 as cloudinary } from "cloudinary";
import blockeds from "@/lib/blocked";
import { getVideoId, verifyToken } from "@/lib/helpers/allHelpers";
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
  ResponseSignature
} from "@/lib/types/response";
//********************** I N I T ****************************
const PubModel = Pubs as any;
const UserModel = Users as any;
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
    if (!user) return { errors: "Sin autorización" };
    if (blockeds.includes(user.email)) return { errors: "Sin autorización" };
    //VERIFY CLOUDFLARE TOKEN
    const token = form.get("token") as string ?? "";
    const turnstileStatus = await verifyToken(token);
    if(!turnstileStatus) return { errors: "Sin autorización" };
    //EXTRACT DATA FROM FORMDATA
    const image = form.get("image") as string ?? "";
    const comment = form.get("comment") as string ?? "";
    const id = form.get("id") as string ?? "";
    //VERIFY DATA INTEGRITY
    if (!id) return { errors: "El id esta mal" };
    if (!image && !comment) return { errors: "Debes enviar al menos un texto o una imagen" };
    if (comment && comment.length > 500) return { errors: "El comentario no puede tener mas de 500 caractéres." };
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
      await db();
      //GET AUTHOR'S AVATAR
      const userProfile = (await UserModel.findOne(
        { email: user.email },
        { image: 1, _id: 0 },
      ).lean()) as { image?: string | null } | null;

      const imgDB: string = userProfile?.image ?? "";

      await PubModel.updateOne(
        { _id: id },
        {
          $push: {
            comments: {
              author: user.name,
              avatar: imgDB,
              msg: image,
            },
          },
        },
      );

      //REVALIDATE CACHE
      updateTag("pubsPage-1");

      return { message: image };
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
    const title = form.get("title") as string;
    const description = (form.get("description") as string) ?? "";
    const image = (form.get("image") as string) ?? "";
    const audio = (form.get("audio") as string) ?? "";
    const yt = (form.get("yt") as string) ?? "";
    //TITLE MANDATORY
    if(!type) return { errors: { server: "NOTYPE" } };
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
        //SAVE PUB TO DB
        await PubModel.create({
          author: user.name,
          avatar: imgDB,
          title: title.trim(),
          description: description.trim(),
          image: image,
        });
        //SEND WEB PUSH NOTIFICATION
        await webPushNotif(title.trim(), image, description.trim());

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
        //SAVE PUB TO DB
        await PubModel.create({
          author: user.name,
          avatar: imgDB,
          title: title.trim(),
          description: description.trim(),
          audio: audio,
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
  async getSignature(timestamp: number): Promise<ResponseSignature> {
    //GET SESSION
    const { user } = await auth();
    if (!user) return { errors: "UNAUTHORIZED" };
    if (blockeds.includes(user.email))
      return { errors: "UNAUTHORIZED" };
    //CHECK PUBCOUNTPERDAY
    await db();
    const { pubcountperday } = await UserModel.findOne(
      { email: user.email },
      { _id: 0, pubcountperday: 1 },
    ).lean();
    //CHECK PUBS PER DAY LIMIT
    if (pubcountperday <= 0) return { errors: "MAXLIMITPERDAY" };
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_SECRET
    );
    return { signature };
  }
};
