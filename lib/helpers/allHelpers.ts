import { getSignature } from '@/app/actions/serverActions';

export function getVideoId(input: string): string {
  let yt_id = "";
  try {
    yt_id = input.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/,
    )[1];
  } catch (error) {
    return "";
  }
  return yt_id.replace("?", "");
}

export async function verifyToken(token: string): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
    const result = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`,
      },
    );
    const data = await result.json();
    if (!data.success) return false;
    return true;
}

export  async function upToCloudinary(file: File): Promise<string> {
    //GET SIGNATURE
    const timestamp = Math.floor(Date.now() / 1000);
    const cloudyURl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/auto/upload`;
    const { errors, signature } = await getSignature(timestamp);
    if (errors) throw new Error(errors);
    if (!signature) throw new Error("No se puede subir la imágen");
    //UPLOAD
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    const response = await fetch(cloudyURl, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Fallo al subir la imágen");
    const { secure_url } = await response.json();
    return secure_url;
  }