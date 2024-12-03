'use client';

import { QuerySnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function StatCard({ snapshot }: { snapshot: QuerySnapshot }) {
	const [avgRating, setAvgRating] = useState<number>();

	function calculateAverageRating() {
		var sum = 0;
		snapshot.docs.forEach((doc) => {
			sum += doc.get('rating');
		});
		setAvgRating(sum / snapshot.size);
	}

	useEffect(() => {
		calculateAverageRating();
	}, []);

	return (
		<div className="mx-auto flex flex-col my-4">
			<p>Total Entries: {snapshot.size}</p>
			<p>Average Rating: {avgRating?.toFixed(2)}</p>
		</div>
	);
}
