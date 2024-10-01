import { QueryDocumentSnapshot } from 'firebase/firestore';

function HomeGameCard({ gameDoc }: { gameDoc: QueryDocumentSnapshot }) {
	const game = gameDoc.data();
	const date = game.complete.toDate();
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: '2-digit',
		year: 'numeric',
	}).format(date);

	return (
		<div className="card border-gray-500 shadow-md shadow-slate-950 p-4">
			<div className="h-full w-1/3 bg-slate-900">
				<p>Image Will Go here</p>
			</div>
			<div className=" m-2 h-full flex flex-col">
				<p>{game.title}</p>
				<p>{game.developer}</p>
				<p>{game.platform}</p>
				<p>{game.genre}</p>
				<p>{formattedDate}</p>
				<p>{game.rating}</p>
			</div>
		</div>
	);
}

function ListGameCard({ gameDoc }: { gameDoc: any }) {}

export { HomeGameCard, ListGameCard };
