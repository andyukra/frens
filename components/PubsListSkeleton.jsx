export default function PubsListSkeleton() {
  return (
	<div
		className="lg:columns-4 md:columns-2 break-inside-avoid"
	>
		{[...Array(20)].map((_, key) => {
			return (
				<div
					key={key}
					className="bg-gray-200 border border-gray-300 rounded-md shadow-sm p-4 mb-4"
				>
					<div className="animate-pulse">
						<div className="bg-gray-300 h-6 w-full mb-2"></div>
						<div className="bg-gray-300 h-4 w-3/4 mb-2"></div>
						<div className="bg-gray-300 h-4 w-1/2"></div>
					</div>
				</div>
			);
		})}
	</div>
  )
}
