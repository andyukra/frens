import moment from "moment";
import CardHeader from "@/components/CardHeader";

moment.locale("es");

function filterMsg(msg) {
  if (/.*\.(jpg|gif|png|jpeg|tiff|heif|bmp|webp)$/i.test(msg)) {
    return (
      <img
        src={msg}
        alt="comentario con imagen"
        className="max max-w-[200px] max-h-[400px] rounded-lg"
      />
    );
  } else {
    return (
      <p className="p-3 rounded-lg bg-slate-200 text-black break-word">{msg}</p>
    );
  }
}

export default function Comentary({ elem }) {
  return (
    <article
      className="my-4 py-2 px-4 rounded-lg"
    >
      {/* HEADER */}
	  <CardHeader pub={elem} pubDate={moment(elem.date).fromNow()} />
      {/* BODY */}
      <div>{filterMsg(elem.msg)}</div>
    </article>
  );
}
