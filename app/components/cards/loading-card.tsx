export default function LoadingCard() {
	return (
		<div className="lg:w-96 w-4/5 mx-auto h-72 bg-gray-600 animate-pulse rounded-xl text-gray-400 flex flex-row items-center justify-evenly">
			<div className="w-32 h-52 bg-gray-500 mx-2 rounded-xl" />
			<div className="w-44 h-52 mx-2 flex flex-col gap-1 justify-evenly">
				<div className="w-44 h-4 bg-gray-500 rounded-md" />
				<div className="w-44 h-4 bg-gray-500 rounded-md" />
				<div className="w-44 h-4 bg-gray-500 rounded-md" />
				<div className="w-44 h-4 bg-gray-500 rounded-md" />
			</div>
		</div>
	);
}
