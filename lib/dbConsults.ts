import { cacheLife, cacheTag, unstable_cache } from 'next/cache';
import DbFactory from '@/lib/adapters/server/db/dbFactory';
import services from "./services/allServices";
import { ResponseGeneric, ResponseAvatars, ResponseGetPub, ResponseExtras } from '@/lib/types/response';

//CONSULTS
export async function getAvatars(limit:number = 30): Promise<ResponseAvatars> {
  'use cache: remote';

  cacheLife("days");
  cacheTag("avatarsCarrousel");

  const dbAdapter = DbFactory(process.env.DB_TYPE);
  try {
    const avatars = await dbAdapter.getAvatars(limit);
    return { message: avatars };
  } catch (error) { return { errors: error } }
}

export async function getUncacheableData(page:number, search:string, author:string, docsPerPage:number): Promise<ResponseGeneric> {
  const skip = (page - 1) * docsPerPage;
  const dbAdapter = DbFactory(process.env.DB_TYPE);
  try {
    const pubs = await dbAdapter.getPubs({docsPerPage, search, author, skip});
    return { message: pubs };
  } catch (error) { return { errors: error } }
}

export async function getCacheableData(page:number, docsPerPage:number): Promise<ResponseGeneric> {
  'use cache: remote';

  //CACHE CONFIG
  cacheLife("days");
  cacheTag(`pubsPage-${page}`);

  const skip = (page - 1) * docsPerPage;
  const dbAdapter = DbFactory(process.env.DB_TYPE);

  try {
    const pubs = await dbAdapter.getPubs({docsPerPage, skip});
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(1000);
    return { message: pubs };
  } catch (error) { return { errors: error } }
}

export async function getPub(id:string): Promise<ResponseGetPub> {
  const dbAdapter = DbFactory(process.env.DB_TYPE);
  try {
    const pub = await dbAdapter.getPub(id);
    return { message: pub }
  } catch (error) { return { errors: error instanceof Error ? error.message : "Error al obtener la publicación" }}
}

export const getExtras = unstable_cache(
  async (amount = 10): Promise<ResponseExtras> => {
    const dbAdapter = DbFactory(process.env.DB_TYPE);
    try {
      const extras = await dbAdapter.getExtras(amount);
      return { message: extras };
    } catch (error) { return { errors: error } }
  },
  ['extras'], // clave única de caché
  { revalidate: 3600 } // revalida cada 3600 segundos (1 hora)
);

export async function getFavourites(): Promise<ResponseGeneric> {
  return await services.getFavourites();
}