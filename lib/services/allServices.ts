import { updateTag } from "next/cache";
import { auth } from "@/auth";
import blockeds from "@/lib/blocked";
import { getVideoId } from "@/lib/helpers/allHelpers";
import { verifyToken } from "./verifToken";
import { webPushNotif } from "./webPushService";
import S3factory from "@/lib/adapters/server/S3/S3factoryServer";
import DbFactory from "@/lib/adapters/server/db/dbFactory";
//TYPES
import {
  ResponseComment,
  ResponseDelete,
  ResponsePub,
  ResponseSignature,
  ResponseGeneric,
} from "@/lib/types/response";
//********************** I N I T ****************************
//SERVICES
export default {
  async like(id: string): Promise<ResponseGeneric> {
    // 1. Verificar autenticación directamente en el servidor por seguridad
    const session = await auth();
    if (!session || !session.user) {
      return { errors: "Sin autorización" };
    }

    const dbAdapter = DbFactory(process.env.DB_TYPE);

    try {
      await dbAdapter.like(id, session.user.email);
      //revaldiate cache and return OK
      updateTag("pubsPage-1");
      return { message: "OK" };
    } catch (error) {
      return { errors: error };
    }
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
    const token = (form.get("token") as string) ?? "";
    const turnstileStatus = await verifyToken(token);
    if (!turnstileStatus) return { errors: "Sin autorización" };
    //EXTRACT DATA FROM FORMDATA
    const image = (form.get("image") as string) ?? "";
    const comment = (form.get("comment") as string) ?? "";
    const id = (form.get("id") as string) ?? "";
    //VERIFY DATA INTEGRITY
    if (!id) return { errors: "El id esta mal" };
    if (!image && !comment)
      return { errors: "Debes enviar al menos un texto o una imagen" };
    if (comment && comment.length > 500)
      return { errors: "El comentario no puede tener mas de 500 caractéres." };
    //GET DB ADAPTER
    const dbAdapter = DbFactory(process.env.DB_TYPE);
    //POST COMMENT
    try {
      const { image: avatar } = await dbAdapter.getUserAvatarAndPubsPerDay(
        user.email,
      );
      const Comment = {
        pubId: id,
        author: user.name,
        avatar: avatar,
        content: image ? image : comment,
      };
      await dbAdapter.pushComment(Comment);
    } catch (error) {
      return { errors: error };
    }
    //REVALIDATE CACHE
    updateTag("pubsPage-1");
    updateTag("pubsPage-2");

    return { message: comment || image };
  },
  async publicate(
    prevState: ResponsePub,
    form: FormData,
  ): Promise<ResponsePub> {
    //GET SESSION
    const { user } = await auth();
    if (!user) return { errors: { server: "Sin autorización" } };
    if (blockeds.includes(user.email))
      return { errors: { server: "Sin autorización" } };
    //GLOBAL VARS
    let Avatar = "";
    let yt_id = "";
    //GET DB ADAPTER
    const dbAdapter = DbFactory(process.env.DB_TYPE);
    //GET USER DATA FROM DB
    try {
      const { image: avatar, pubcountperday } =
        await dbAdapter.getUserAvatarAndPubsPerDay(user.email);
      //CHECK PUBS PER DAY LIMIT
      if (pubcountperday <= 0)
        return {
          errors: {
            server: "Ha alcanzado la cuota máxima de publicaciones por día",
          },
        };
      //SUBSTRACT ONE PUBCOUNTPERDAY
      await dbAdapter.substractOnePubsPerDay(user.email);
      //SET AVATAR
      Avatar = avatar;
    } catch (error) {
      return { errors: error };
    }
    //INIT
    // const type = form.get("type") as string;
    const title = form.get("title") as string;
    const description = (form.get("description") as string) ?? "";
    const image = (form.get("image") as string) ?? "";
    const audio = (form.get("audio") as string) ?? "";
    const yt = (form.get("yt") as string) ?? "";
    //FILTER DATA
    if (!title || title.length > 50)
      return { errors: { server: "Falta el título" } };
    if (description && description.length > 500)
      return {
        errors: {
          server: "La descripción es muy larga, máximo 500 caractéres",
        },
      };
    if (yt) {
      yt_id = getVideoId(yt.trim());
      console.log(yt_id);
      if (!yt_id) return { errors: { yt: ["Link de yt erróneo"] } };
    }
    //POST PUBLICATION
    const Pub = {
      author: user.name,
      avatar: Avatar,
      title,
      description,
      image,
      audio,
      yt: yt_id,
    };
    try {
      await dbAdapter.postPub(Pub);
    } catch (error) {
      return { errors: error };
    }

    //SEND WEB PUSH NOTIFICATION
    await webPushNotif(title.trim(), image, description.trim());

    //REVALIDATE CACHE
    updateTag("pubsPage-1");
    updateTag("pubsPage-2");

    return { message: "OK" };
  },
  async Delete(form: FormData): Promise<ResponseDelete> {
    //GET SESSION
    const { user } = await auth();
    if (!user) return { errors: "Sin autorización" };
    if (blockeds.includes(user.email)) return { errors: "Sin autorización" };
    //EXTRACT VARS
    const type = form.get("type") as string;
    const id = form.get("id") as string;
    const src = (form.get("src") as string) || null;
    //GET DB ADAPTER and DELETE
    const dbAdapter = DbFactory(process.env.DB_TYPE);
    try {
      await dbAdapter.deletePub(id, user.name);
    } catch (error) {
      return { errors: error };
    }
    //DELETE SRC FROM S3
    if (type == "image" || type == "audio") {
      if (!src) return { errors: "No se encontró el recurso multimedia" };
      const S3adapter = S3factory(process.env.NEXT_PUBLIC_S3_PROVIDER);
      try {
        await S3adapter.Delete(src);
      } catch (e) {
        return { errors: e };
      }
    }
    //revaldiate cache
    updateTag("pubsPage-1");
    updateTag("pubsPage-2");

    return { message: "OK" };
  },
  async getSignature(timestamp: number): Promise<ResponseSignature> {
    //GET SESSION
    const { user } = await auth();
    if (!user) return { errors: "Sin autorización" };
    if (blockeds.includes(user.email)) return { errors: "Sin autorización" };
    //GET DB ADAPTER AND GET PUBCOUNTPERDAY
    const dbAdapter = DbFactory(process.env.DB_TYPE);
    try {
      const { pubcountperday } = await dbAdapter.getUserAvatarAndPubsPerDay(
        user.email,
      );
      //CHECK PUBS PER DAY FOR THIS USER
      if (pubcountperday <= 0)
        return { errors: "Has alcanzado la cuota diaria de publicaciones" };
    } catch (error) {
      return { errors: error };
    }
    //GET SIGNATURE FROM S3
    const S3adapter = S3factory(process.env.NEXT_PUBLIC_S3_PROVIDER);
    const signature = S3adapter.getSignature(timestamp);

    return { signature };
  },
  async addFavourite(pubId: string): Promise<ResponseGeneric> {
    const { user } = await auth();
    if (!user) return { errors: "Sin autorización" };
    if (blockeds.includes(user.email)) return { errors: "Sin autorización" };
    //GET DB ADAPTER
    const dbAdapter = DbFactory(process.env.DB_TYPE);

    try {
      await dbAdapter.addFavourite(pubId, user.name);
      return { message: "OK" };
    } catch (error) {
      return { errors: "Error al agregar favorito" };
    }
  },
  async delFavourite(pubId: string): Promise<ResponseGeneric> {
    const { user } = await auth();
    if (!user) return { errors: "Sin autorización" };
    if (blockeds.includes(user.email)) return { errors: "Sin autorización" };
    //GET DB ADAPTER
    const dbAdapter = DbFactory(process.env.DB_TYPE);

    try {
      await dbAdapter.delFavourite(pubId, user.name);
      return { message: "OK" };
    } catch (error) {
      return { errors: "Error al eliminar favorito" };
    }
  },
  async getFavourites(): Promise<ResponseGeneric> {
    const { user } = await auth();
    if (!user) return { errors: "Sin autorización" };
    if (blockeds.includes(user.email)) return { errors: "Sin autorización" };
    //GET ADAPTER AND GO PROCES
    const dbAdapter = DbFactory(process.env.DB_TYPE);

    try {
      const favourites = await dbAdapter.getFavourites(user.name);
      return { message: JSON.stringify(favourites) };
    } catch (error) {
      return { errors: "Error al obtener favoritos" };
    }
  },
};
