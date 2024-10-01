import { QueryDocumentSnapshot } from 'firebase/firestore';

function HomeBookCard({ bookDoc }: { bookDoc: QueryDocumentSnapshot }) {
	const book = bookDoc.data();
	const date = book.complete.toDate();
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
				<p>{book.title}</p>
				<p>{book.author}</p>
				<p>{book.genre}</p>
				<p>{formattedDate}</p>
				<p>{book.rating}</p>
			</div>
		</div>
	);
}

export { HomeBookCard };
