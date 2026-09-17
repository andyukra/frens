import { db } from "@/lib/db";
import { cacheLife, cacheTag, unstable_cache } from 'next/cache';
import Pubs from "@/lib/models/pubs";
import Users from "@/lib/models/users";
const PubsModel = Pubs as any;
const UsersModel = Users as any;

export async function getAvatars(limit:number = 30) {
  'use cache: remote';

  cacheLife("days");
  cacheTag("avatarsCarrousel");

  await db();
  return await UsersModel.find({}, { image: 1, _id: 0 }).limit(limit).lean();
}

export async function getUncacheableData(page:number, search:string, author:string, docsPerPage:number) {
  await db();
  const skip = (page - 1) * docsPerPage;
  if (search) {
    const pubs = await PubsModel.find({ title: { $regex: search, $options: "i" } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(docsPerPage).lean();
    const count = await PubsModel.find({
      title: { $regex: search, $options: "i" },
    }).countDocuments().lean();
    return JSON.stringify({ pubs, count });
  }
  if (author !== "all" && !search) {
    const pubs = await PubsModel.find({ author: author })
      .sort({ date: -1 })
      .skip(skip)
      .limit(docsPerPage).lean();
    const count = await PubsModel.find({ author: author }).countDocuments().lean();
    return JSON.stringify({ pubs, count });
  }
  const pubs = await PubsModel.find({})
    .sort({ date: -1 })
    .skip(skip)
    .limit(docsPerPage).lean();
  const count = await PubsModel.find({}).countDocuments().lean();
  return JSON.stringify({ pubs, count });
}

export async function getCacheableData(page:number, docsPerPage:number) {
  'use cache: remote';

  console.log("🔥 MONGODB CACHEABLE QUERY:", page);

  //CACHE CONFIG
  cacheLife("days");
  cacheTag(`pubsPage-${page}`);

  await db();
  const skip = (page - 1) * docsPerPage;
  const pubs = await PubsModel.find({})
    .sort({ date: -1 })
    .skip(skip)
    .limit(docsPerPage).lean();
  const count = await PubsModel.find({}).countDocuments().lean();
  return JSON.stringify({ pubs, count });
}

export async function getPub(id:string) {
  await db();
  try {
    const pub = await PubsModel.findById(id).lean();
    if (!pub) return;
    return JSON.parse(JSON.stringify(pub));
  } catch (error) { return }
}

export const getExtras = unstable_cache(
  async (amount = 10) => {
    await db();
    return await PubsModel.aggregate([{ $sample: { size: amount } }]);
  },
  ['extras'], // clave única de caché
  { revalidate: 3600 } // revalida cada 3600 segundos (1 hora)
);