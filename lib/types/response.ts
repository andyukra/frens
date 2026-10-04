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