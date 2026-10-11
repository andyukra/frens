import { DbAdapter, AvatarAndPubsPerDay, Comment, Pub } from "./dbAdapter";
//MONGO DEPENDENCIES
import { db } from "@/lib/db";
import Pubs from "@/lib/models/pubs";
import Users from "@/lib/models/users";

const PubModel = Pubs as any;
const UserModel = Users as any;
//ADAPTER
export default function (): DbAdapter {
  return {
    like: async (pubId: string, userId: string): Promise<void> => {
      await db();
      // 2. Operación atómica con $addToSet (agrega solo si no existe en el array)
      const updatedPub = await PubModel.findOneAndUpdate(
        { _id: pubId, "likes.author": { $ne: userId } }, // Condición: que el id coincida Y el usuario NO esté en la lista
        { $push: { likes: { author: userId } } },
        { new: true },
      );
      // Si no actualizó nada, significa que el usuario ya había dado like
      if (!updatedPub) throw new Error("Ya le has dado like a este post");
    },
    getUserAvatarAndPubsPerDay: async (
      email: string,
    ): Promise<AvatarAndPubsPerDay> => {
      const { image, pubcountperday } = await UserModel.findOne(
        { email: email },
        { image: 1, _id: 0, pubcountperday: 1 },
      ).lean();
      return { image, pubcountperday };
    },
    pushComment: async ({
      pubId,
      author,
      avatar,
      content,
    }: Comment): Promise<void> => {
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
      await UserModel.findOneAndUpdate(
        { email: email },
        { $inc: { pubcountperday: -1 } },
      );
    },
    deletePub: async (pubId, author): Promise<void> => {
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
		await PubModel.create({
          author: author.trim(),
          avatar: avatar.trim(),
          title: title.trim(),
          description: description.trim(),
		  image: image.trim(),
		  audio: audio.trim(),
		  yt: yt.trim()
        });
	},
  };
}
