import BasicSkeleton from "@/components/BasicSkeleton";

export default function PubsListSkeleton() {
  return (
	<div className="lg:columns-4 md:columns-2 break-inside-avoid">
		{[...Array(20)].map((_, key) => <BasicSkeleton key={key}/>)}
	</div>
  )
}
