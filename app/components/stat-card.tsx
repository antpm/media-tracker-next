'use client';

import { QuerySnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function StatCard({ snapshot }: { snapshot: QuerySnapshot }) {
	const [avgRating, setAvgRating] = useState<number>();
	const [monthEntryCount, setMonthEntryCount] = useState<{ name: string; count: number }[]>([]);
	const [ratingEntryCount, setRatingEntryCount] = useState<{ name: string; count: number }[]>([]);

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

	function countEntriesPerRating() {
		var countArray = [
			{ name: '1', count: 0 },
			{ name: '2', count: 0 },
			{ name: '3', count: 0 },
			{ name: '4', count: 0 },
			{ name: '5', count: 0 },
		];

		snapshot.docs.forEach((doc) => {
			var rating = doc.get('rating') - 1;
			countArray[rating].count += 1;
		});

		setRatingEntryCount(countArray);
	}

	useEffect(() => {
		calculateAverageRating();
		countEntriesPerMonth();
		countEntriesPerRating();
	}, []);

	return (
		<div className="mx-auto flex flex-row my-4 w-full">
			<div className="flex flex-col gap-4 w-1/2 mx-auto">
				<h5 className="mx-auto">Entries Per Month:</h5>
				<ResponsiveContainer width={'90%'} height={250} className="bg-gray-100 mx-auto rounded-md py-2 mb-2">
					<BarChart data={monthEntryCount} width={600} height={250} margin={{ top: 5, right: 10, left: -40, bottom: 5 }} className="text-black">
						<CartesianGrid />
						<XAxis dataKey={'name'} angle={45} />
						<YAxis />
						<Tooltip />
						<Bar dataKey="count" fill="#5710c9" />
					</BarChart>
				</ResponsiveContainer>
				<p className="mx-auto mb-8">Total Entries: {snapshot.size}</p>
			</div>
			<div className="flex flex-col gap-4 mx-auto mb-4 w-1/2">
				<h5 className="mx-auto">Entries Per Rating:</h5>
				<ResponsiveContainer width={'90%'} height={250} className="bg-gray-100 mx-auto rounded-md py-2 mb-2">
					<BarChart data={ratingEntryCount} width={600} height={250} margin={{ top: 5, right: 10, left: -40, bottom: 5 }} className="text-black">
						<CartesianGrid />
						<XAxis dataKey={'name'} />
						<YAxis />
						<Tooltip />
						<Bar dataKey="count" fill="#5710c9" />
					</BarChart>
				</ResponsiveContainer>
				<p className="mx-auto">Average Rating: {avgRating?.toFixed(2)}</p>
			</div>
		</div>
	);
}
