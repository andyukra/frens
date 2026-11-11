
type Data = { avatar: string , author: string, vip: boolean };
type Props = { pub: Data, pubDate: React.ReactNode }

export default function CardHeader({pub, pubDate}: Props) {
  return (
    <div className="flex justify-between items-center text-[var(--primaryTextLight)]">
      <div className="flex gap-3 items-center">
        <img
          src={pub.avatar}
          alt="author avatar"
          className="rounded-full shadow w-10 h-10"
        />
        <div>
          <h2 className={`text-lg font-bold ${pub.vip ? 'text-white' : 'text-[#222]'}`}>{pub.author}</h2>
          {pubDate}
        </div>
      </div>
    </div>
  );
}
