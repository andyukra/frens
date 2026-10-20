import {
  DbAdapter,
  AvatarAndPubsPerDay,
  Comment,
  Pub,
  GetPubs,
} from "./dbAdapter";
//MONGO DEPENDENCIES
import { db } from "@/lib/db";
import Pubs from "@/lib/models/pubs";
import Users from "@/lib/models/users";
import { Avatar } from "@/lib/types/avatar";
import { Publication } from "@/lib/types/publication";
import mongoose, { startSession } from "mongoose";

const PubModel = Pubs as any;
const UserModel = Users as any;
//ADAPTER
export default function (): DbAdapter {
  return {
    //************* P O S T S  ***************/
    like: async (pubId: string, email: string): Promise<void> => {
      if (!email || !pubId)
        throw new Error("El email o id del post es requerido");
      await db();
      // Convierte los strings a ObjectId
      const pubObjectId = new mongoose.Types.ObjectId(pubId);
      // 2. Operación atómica con $addToSet (agrega solo si no existe en el array)
      const result = await PubModel.updateOne(
        { _id: pubObjectId }, // Condición más simple
        { $addToSet: { likes: email } }, // Solo lo agrega si no existe
        { new: true },
      );
      if (result.matchedCount === 0) throw new Error("El post no existe");
      if (result.modifiedCount === 0) throw new Error("Ya le diste like a este post");
    },
    pushComment: async ({
      pubId,
      author,
      avatar,
      content,
    }: Comment): Promise<void> => {
      await db();
      await PubModel.updateOne(
        { _id: pubId },
        {
          $push: {
            comments: {
              author: author,
              avatar: avatar,
              msg: content,
            },
          },
        },
      );
    },
    substractOnePubsPerDay: async (email: string): Promise<void> => {
      await db();
      await UserModel.findOneAndUpdate(
        { email: email },
        { $inc: { pubcountperday: -1 } },
      );
    },
    deletePub: async (pubId: string, author: string): Promise<void> => {
      await db();
      await PubModel.findOneAndDelete({
        _id: pubId,
        author: author,
      });
    },
    postPub: async ({
      author,
      avatar,
      title,
      description = "",
      image = "",
      audio = "",
      yt = "",
    }: Pub): Promise<void> => {
      await db();
      await PubModel.create({
        author: author.trim(),
        avatar: avatar.trim(),
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        audio: audio.trim(),
        yt: yt.trim(),
      });
    },
    addFavourite: async (pubId: string, username: string): Promise<void> => {
      await db();
      const session = await startSession();
      try {
        await session.withTransaction(async () => {
          const pubResult = await PubModel.updateOne(
            { _id: pubId },
            { $inc: { favourite: 1 } },
            { session },
          );

          if (pubResult.matchedCount === 0)
            throw new Error("La publicación no existe");

          const userResult = await UserModel.updateOne(
            { name: username },
            {
              $push: {
                favourites: pubId,
              },
            },
            { session },
          );

          if (userResult.matchedCount === 0) {
            throw new Error("El usuario no existe");
          }
        });
      } finally {
        session.endSession();
      }
    },
    delFavourite: async (pubId: string, username: string): Promise<void> => {
      await db();
      const session = await startSession();
      try {
        await session.withTransaction(async () => {
          const pubResult = await PubModel.updateOne(
            { _id: pubId },
            { $inc: { favourite: -1 } },
            { session },
          );

          if (pubResult.matchedCount === 0)
            throw new Error("La publicación no existe");

          const userResult = await UserModel.updateOne(
            { name: username },
            {
              $pull: {
                favourites: pubId,
              },
            },
            { session },
          );

          if (userResult.matchedCount === 0) {
            throw new Error("El usuario no existe");
          }
        });
      } finally {
        session.endSession();
      }
    },
    createUser: async (
      name: string,
      image: string,
      email: string,
    ): Promise<void> => {
      await db();
      await UserModel.create({ name, image, email });
    },
    //************* G E T S  ****************/
    getAvatars: async (limit: number): Promise<Avatar[]> => {
      await db();
      return await UserModel.find({}, { image: 1, _id: 0 }).limit(limit).lean();
    },
    getUserAvatarAndPubsPerDay: async (
      email: string,
    ): Promise<AvatarAndPubsPerDay> => {
      await db();
      const { image, pubcountperday } = await UserModel.findOne(
        { email: email },
        { image: 1, _id: 0, pubcountperday: 1 },
      ).lean();
      return { image, pubcountperday };
    },
    getPubs: async ({
      search,
      skip,
      docsPerPage,
      author,
    }: GetPubs): Promise<string> => {
      await db();
      const opts = search
        ? { title: { $regex: search, $options: "i" } }
        : author
          ? { author: author }
          : {};
      const pubs = await PubModel.find(opts)
        .sort({ date: -1 })
        .skip(skip)
        .limit(docsPerPage)
        .lean();
      const count = await PubModel.find(opts).countDocuments().lean();
      return JSON.stringify({ pubs, count });
    },
    getPub: async (id: string): Promise<Publication> => {
      await db();
      const pub = await PubModel.findById(id).lean();
      return pub;
    },
    getExtras: async (amount: number): Promise<any> => {
      await db();
      const extras = await PubModel.aggregate([{ $sample: { size: amount } }]);
      return extras;
    },
    getFavourites: async (username: string): Promise<Publication[]> => {
      await db();
      // 1. Buscamos el usuario para obtener su array de favoritos
      const user = await UserModel.findById(username).select("favourites");

      if (!user || !user.favourites || user.favourites.length === 0) {
        return []; // Si no tiene favoritos, devolvemos un array vacío
      }

      // 2. Traemos todas las publicaciones cuyos IDs estén dentro del array
      const pubs = await PubModel.find({
        _id: { $in: user.favourites },
      });

      return pubs;
    },
  };
}
