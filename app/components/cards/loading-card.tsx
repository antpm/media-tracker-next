export function HomeLoadingCard() {
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

export function ListLoadingCard() {
	return (
		<div className="lg:w-full mx-auto w-11/12 bg-gray-600 border-gray-500 shadow-md shadow-slate-950 p-2 h-72 items-center justify-start rounded-xl flex flex-row animate-pulse">
			<div className="h-64 w-64 bg-gray-700 rounded-xl"></div>
			<div className="flex flex-col h-64 flex-grow ml-4 justify-evenly">
				<div className="bg-gray-700 w-full h-6 rounded-xl"></div>
				<div className="bg-gray-700 w-full h-6 rounded-xl"></div>
				<div className="bg-gray-700 w-full h-6 rounded-xl"></div>
				<div className="bg-gray-700 w-full h-6 rounded-xl"></div>
				<div className="bg-gray-700 w-full h-6 rounded-xl"></div>
			</div>
		</div>
	);
}
