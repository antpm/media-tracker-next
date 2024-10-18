import { QuerySnapshot } from 'firebase/firestore';

type props = {
	games: QuerySnapshot;
	books: QuerySnapshot;
};

export default function StatCard({ snapshots }: { snapshots: props }) {
	return (
		<div className="mx-auto flex flex-col">
			{!snapshots.games.empty && <p>Games: {snapshots.games.size}</p>}
			{!snapshots.books.empty && <p>Books: {snapshots.books.size}</p>}
		</div>
	);
}
