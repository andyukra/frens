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
import { Avatar } from '@/lib/types/avatar';
import { Publication } from '@/lib/types/publication';

const PubModel = Pubs as any;
const UserModel = Users as any;
//ADAPTER
export default function (): DbAdapter {
  return {
    //************* P O S T S  ***************/
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
      await db();
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
    deletePub: async (pubId, author): Promise<void> => {
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
    //************* G E T S  ****************/
    getAvatars: async (limit: number): Promise<Avatar[]> => {
      await db();
      return await UserModel.find({}, { image: 1, _id: 0 }).limit(limit).lean();
    },
    getPubs: async ({
      search,
      skip,
      docsPerPage,
      author,
    }: GetPubs): Promise<string> => {
      await db();
      const opts = 
        search ? { title: { $regex: search, $options: "i" } } :
        author ? { author: author } :
        {};
      const pubs = await PubModel.find(opts)
        .sort({ date: -1 })
        .skip(skip)
        .limit(docsPerPage)
        .lean();
      const count = await PubModel.find(opts)
        .countDocuments()
        .lean();
      return JSON.stringify({ pubs, count });
    },
    getPub: async(id: string): Promise<Publication> => {
      await db();
      const pub = await PubModel.findById(id).lean();
      return pub;
    },
    getExtras: async(amount: number): Promise<any> => {
      await db();
      const extras = await PubModel.aggregate([{ $sample: { size: amount } }]);
      return extras;
    }
  };
}
