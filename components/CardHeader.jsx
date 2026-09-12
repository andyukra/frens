
export default function CardHeader({pub, pubDate}) {
  return (
    <div className="flex justify-between items-center pb-2 text-black">
      <div className="flex gap-3 items-center">
        <img
          src={pub.avatar}
          alt="author avatar"
          className="rounded-full shadow w-10 h-10"
        />
        <div>
          <h2 className="text-lg font-bold">{pub.author}</h2>
          <p className="text-sm text-gray-500">{pubDate}</p>
        </div>
      </div>
    </div>
  );
}
