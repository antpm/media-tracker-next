'use client';

import { QuerySnapshot } from 'firebase/firestore';
import test from 'node:test';
import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function StatCard({ snapshot }: { snapshot: QuerySnapshot }) {
	const [avgRating, setAvgRating] = useState<number>();
	const [monthEntryCount, setMonthEntryCount] = useState<{ name: string; count: number }[]>([]);

	const testData = [
		{ name: 'test1', count: 4 },
		{ name: 'test2', count: 5 },
	];

	function calculateAverageRating() {
		var sum = 0;
		snapshot.docs.forEach((doc) => {
			sum += doc.get('rating');
		});
		setAvgRating(sum / snapshot.size);
	}

	function countEntriesPerMonth() {
		var countArray = [
			{ name: 'Jan', count: 0 },
			{ name: 'Feb', count: 0 },
			{ name: 'Mar', count: 0 },
			{ name: 'Apr', count: 0 },
			{ name: 'May', count: 0 },
			{ name: 'June', count: 0 },
			{ name: 'July', count: 0 },
			{ name: 'Aug', count: 0 },
			{ name: 'Sept', count: 0 },
			{ name: 'Oct', count: 0 },
			{ name: 'Nov', count: 0 },
			{ name: 'Dec', count: 0 },
		];
		snapshot.docs.forEach((doc) => {
			var month = doc.get('complete').toDate().getMonth();
			countArray[month].count += 1;
		});
		setMonthEntryCount(countArray);
	}

	useEffect(() => {
		calculateAverageRating();
		countEntriesPerMonth();
	}, []);

	return (
		<div className="mx-auto flex flex-col my-4 w-full">
			<div className="flex flex-row gap-4 mx-auto">
				<p>Total Entries: {snapshot.size}</p>
				<p>Average Rating: {avgRating?.toFixed(2)}</p>
			</div>
			<h5 className="mx-auto">Entries Per Month:</h5>
			<div className="mr-20 w-full">
				<ResponsiveContainer width={'100%'} height={250}>
					<BarChart data={monthEntryCount} width={600} height={250} margin={{ top: 5, right: 50, left: 0, bottom: 5 }}>
						<XAxis dataKey={'name'} className="text-white" />
						<YAxis className="text-white" />
						<Tooltip />
						<Bar dataKey="count" fill="#ffffff" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
