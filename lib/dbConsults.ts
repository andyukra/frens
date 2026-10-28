import services from "./services/allServices";
import { ResponseGeneric, ResponseAvatars, ResponseGetPub, ResponseExtras } from '@/lib/types/response';

//CONSULTS
export async function getAvatars(limit:number = 30): Promise<ResponseAvatars> {
  return await services.getAvatars(limit);
}
export async function getUncacheableData(page:number, search:string, author:string, docsPerPage:number): Promise<ResponseGeneric> {
  return await services.getUncacheableData(page, search, author, docsPerPage);
}
export async function getCacheableData(page:number, docsPerPage:number): Promise<ResponseGeneric> {
  return await services.getCacheableData(page, docsPerPage);
}
export async function getPub(id:string): Promise<ResponseGetPub> {
  return await services.getPub(id);
}
export async function getFavourites(): Promise<ResponseGeneric> {
  return await services.getFavourites();
}
export async function getExtras() {
  return await services.getExtras();
}