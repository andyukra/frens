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