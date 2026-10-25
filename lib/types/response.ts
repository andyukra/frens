import { Avatar } from '@/lib/types/avatar';
import { Publication, PublicationsCount } from '@/lib/types/publication';

export type ResponsePub = {
  errors?: {
    title?: string[];
    descripton?: string[];
    image?: string[];
    audio?: string[];
    yt?: string[];
    server?: string;
  };
  message?: string;
};
export type ResponseComment = {
  errors?: string;
  message?: string;
};
export type ResponseDelete = {
  errors?: string;
  message?: string;
};
export type ResponseSignature = {
  errors?: string;
  signature?: string;
};
export type ResponseGeneric = {
  errors?: string;
  message?: string;
};
export type ResponseAvatars = {
  errors?: string,
  message?: Avatar[]
}
export type ResponseGetPub = {
  errors?: string,
  message?: Publication
}
export type ResponseExtras = {
  errors?: string,
  message?: Record<string, string>[]
}