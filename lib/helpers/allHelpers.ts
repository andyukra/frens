
export function getVideoId(input: string): string {
  let yt_id = "";
  try {
    yt_id = input.match(
      /(?:youtu\.be\/|(?:www\.|m\.|music\.)?youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|(?:embed|v|shorts|live)\/))([A-Za-z0-9_-]{10,12})/,
    )[1];
  } catch (error) {
    return "";
  }
  return yt_id.replace("?", "");
}