
//TYPES
type Avatar = {image: string};
//MAIN FC
export default function AvatarsCarrousel({ avatars }:Record<string, Avatar[]>) {
  return (
	<div className="mt-2 md:flex flex-col hidden items-start">
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
