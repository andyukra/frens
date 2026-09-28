
//TYPES
type Avatar = {image: string};
//MAIN FC
export default function AvatarsCarrousel({ avatars }:Record<string, Avatar[]>) {
  return (
	<div className="mt-5 md:flex flex-col hidden items-start">
		<h2 className="text-2xl font-bold mb-4 p-2 bg-[#0008] backdrop-blur-sm rounded-md">Usuarios recientes</h2>
		<div className="overflow-x-auto scrollLess">
			<div className="flex space-x-4 py-2 px-2 avatarCarrousel">
				{avatars.map((avatar, index) => (
					<img 
						key={index}
						src={avatar.image}
						alt="Avatar"
						className="w-16 h-16 rounded-full object-cover"
					/>
				))}
				{avatars.map((avatar, index) => (
					<img 
						key={index}
						src={avatar.image}
						alt="Avatar"
						className="w-16 h-16 rounded-full object-cover"
					/>
				))}
			</div>
		</div>
	</div>
  )
}
