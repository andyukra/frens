"use server";

import services from '@/lib/services/allServices';
import { ResponseComment, ResponsePub } from '@/lib/types/response';
//ACTIONS
export async function like(id: string) {
 return services.like(id);
}
export async function upComment(prevState: ResponseComment, form: FormData) {
  return services.upComment(prevState, form);
}
export async function publicate(prevState: ResponsePub, form: FormData) {
  return services.publicate(prevState, form);
}
export async function Delete(form: FormData) {
  return services.Delete(form);
}
export async function getSignature(timestamp: number) {
  return services.getSignature(timestamp);
}