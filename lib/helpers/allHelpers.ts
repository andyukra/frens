export function filterFileSizeAndType(x: File, fileType: string): boolean {
  if (x.size > 15000000) return false;
  if (fileType === "image" && !/^image/.test(x.type)) return false;
  if (fileType === "audio" && !/^audio/.test(x.type)) return false;
  return true;
}

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