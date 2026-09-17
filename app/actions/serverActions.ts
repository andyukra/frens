"use server";

import { revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { v2 as cloudinary } from "cloudinary";
//DB AND MODELS
import { db } from "@/lib/db";
import Pubs from "@/lib/models/pubs";
import Users from "@/lib/models/users";
import blockeds from "@/lib/blocked";
const PubModel = Pubs as any;
const UserModel = Users as any;

//CLOUDYNARI CREDENTIALS
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
//HELPERS
function filterImg(x: File) {
  if (x.size > 4000000 || !/^image/.test(x.type)) return { err: "BAD FILE" };
}
//ACTIONS
export async function like(id: string) {
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

  return { status: "OK" };
}

export async function UpComment(form: FormData) {
  //@ts-ignore
  const { user } = await auth();
  if (!user) return { err: "NO AUTH" };
  if (blockeds.includes(user.email)) return { err: "BLOCKED USER" };
  //VERIFY CLOUDFLARE TOKEN
  const token = form.get("token");
  if(!token || typeof token !== 'string') return { err: "BAD OR EMPTY TOKEN" }
  const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`,
  });
  const data = await result.json();
  if(!data.success) return { err: "BAD TOKEN" }
  //EXTRACT DATA FROM FORMDATA
  const file = form.get("file") as File;
  const rawComment = form.get("comment");
  const rawId = form.get("id");
  const comment = typeof rawComment === "string" ? rawComment.trim() : "";
  const id = typeof rawId === "string" ? rawId : null;

  //VERIFY DATA INTEGRITY
  if (!id) return { err: "BAD ID" };
  if (!file && !comment) return { err: "BAD EMPTY COMMENT" };
  if (comment && comment.length > 500) return { err: "BAD LARGE COMMENT" };
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
    //@ts-ignore
    revalidateTag("pubsPage-1");

    return { msg: "OK", comment };
  }
  //FOR FILES
  if (file) {
    filterImg(file);
    const binary = await file.arrayBuffer();
    const buffer = Buffer.from(binary);

    const url = await new Promise((resolve, reject) => {
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
    //@ts-ignore
    revalidateTag("pubsPage-1");

    return { msg: "OK", comment: url };
  }
}
