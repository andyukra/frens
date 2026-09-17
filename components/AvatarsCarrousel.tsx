
//TYPES
type Avatar = {image: string};
//MAIN FC
export default function AvatarsCarrousel({ avatars }:Record<string, Avatar[]>) {
  return (
	<div className="mt-5 md:block hidden">
		<h2 className="text-2xl font-bold mb-4">Usuarios recientes</h2>
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
