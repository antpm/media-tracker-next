'use client';
import { useState } from 'react';
import RatingSelect from '../components/rating-select';

export default function Books() {
	const [rating, setRating] = useState(1);

	return (
		<section title="Books Page" className="md:w-3/5 w-10/12 h-fit mx-auto my-10">
			<div className="flex flex-row flex-wrap w-full h-fit">
				<RatingSelect setRating={setRating} rating={3} />
				<p>Rating: {rating}</p>
			</div>
		</section>
	);
}
