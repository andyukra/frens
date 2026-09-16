import Pubs from "@/lib/models/pubs";
import { db } from "@/lib/db";
import Users from "@/lib/models/users";
import { cacheLife, cacheTag, unstable_cache } from 'next/cache';


export async function getAvatars(limit = 30) {
  'use cache: remote';

  cacheLife("days");
  cacheTag("avatarsCarrousel");

  await db();
  return await Users.find({}, { image: 1, _id: 0 }).limit(limit).lean();
}

export async function getUncacheableData(page, search, author, docsPerPage) {
  await db();
  const skip = (page - 1) * docsPerPage;
  if (search) {
    const pubs = await Pubs.find({ title: { $regex: search, $options: "i" } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(docsPerPage).lean();
    const count = await Pubs.find({
      title: { $regex: search, $options: "i" },
    }).countDocuments().lean();
    return JSON.stringify({ pubs, count });
  }
  if (author !== "all" && !search) {
    const pubs = await Pubs.find({ author: author })
      .sort({ date: -1 })
      .skip(skip)
      .limit(docsPerPage).lean();
    const count = await Pubs.find({ author: author }).countDocuments().lean();
    return JSON.stringify({ pubs, count });
  }
  const pubs = await Pubs.find({})
    .sort({ date: -1 })
    .skip(skip)
    .limit(docsPerPage).lean();
  const count = await Pubs.find({}).countDocuments().lean();
  return JSON.stringify({ pubs, count });
}

export async function getCacheableData(page, docsPerPage) {
  'use cache: remote';

  console.log("🔥 MONGODB CACHEABLE QUERY:", page);

  //CACHE CONFIG
  cacheLife("days");
  cacheTag(`pubsPage-${page}`);

  await db();
  const skip = (page - 1) * docsPerPage;
  const pubs = await Pubs.find({})
    .sort({ date: -1 })
    .skip(skip)
    .limit(docsPerPage).lean();
  const count = await Pubs.find({}).countDocuments().lean();
  return JSON.stringify({ pubs, count });
}

export async function getPub(id) {
  await db();

  try {
    const pub = await Pubs.findById(id).lean();

    if (!pub) {
      return "EMPTY";
    }

    return JSON.parse(JSON.stringify(pub));
  } catch (error) {
    return "EMPTY";
  }
}

export const getExtras = unstable_cache(
  async (amount = 10) => {
    await db();
    return await Pubs.aggregate([{ $sample: { size: amount } }]);
  },
  ['extras'], // clave única de caché
  { revalidate: 3600 } // revalida cada 3600 segundos (1 hora)
);