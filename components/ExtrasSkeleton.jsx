
export default function ExtrasSkeleton() {
  return (
	<>
      <section className="overflow-x-hidden md:h-[550px] h-[400px] p-5 shadow-md">
        <div
          className="flex gap-4 w-full h-full"
        >
          {[...Array(10)].map((_, key) => {
			return (
			  <div
				key={key}
				className="bg-gray-200 border border-gray-300 rounded-md shadow-sm p-4 h-full"
			  >
				<div className="animate-pulse">
				  <div className="bg-gray-300 h-full w-full"></div>
				</div>
			  </div>
			);
		  })}
        </div>
      </section>
    </>
  )
}
