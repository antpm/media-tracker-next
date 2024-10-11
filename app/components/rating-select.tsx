'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star } from '../public/icons/icons';

export default function RatingSelect({ setRating, rating }: { setRating: Function; rating: number }) {
	const [stars, setStars] = useState<boolean[]>([true, false, false, false, false]);
	const [selectedStars, setSelectedStars] = useState<boolean[]>([true, false, false, false, false]);

	function starHovered(num: number) {
		let array: boolean[] = [false, false, false, false, false];
		for (let i = 0; i <= num; i++) {
			array[i] = true;
		}

		setStars(array);
	}

	useEffect(() => {
		let array: boolean[] = [false, false, false, false, false];
		for (let i = 0; i < rating; i++) {
			array[i] = true;
		}

		setStars(array);
		setSelectedStars(array);
	}, [rating]);

	function starUnhovered() {
		setStars(selectedStars);
	}

	function starSelected(num: number) {
		let array: boolean[] = [false, false, false, false, false];
		for (let i = 0; i <= num; i++) {
			array[i] = true;
		}

		setSelectedStars(array);
	}

	return (
		<div className="flex flex-row w-full h-10 items-center text-end justify-end mb-4">
			<label>Rating*:</label>
			<div className="flex w-48 h-10">
				{stars.map((star, i) => {
					return (
						<button
							key={i}
							className={`${star ? 'opacity-100' : 'opacity-25'} hover:scale-125 h-full  transition-all duration-300 ease-in-out`}
							onClick={(e) => {
								e.preventDefault();
								starSelected(i);
								setRating(i + 1);
								console.log('star clicked');
							}}>
							<Image
								alt="star"
								src={Star}
								onMouseEnter={() => {
									starHovered(i);
								}}
								onMouseLeave={() => {
									starUnhovered();
								}}
							/>
						</button>
					);
				})}
			</div>
		</div>
	);
}
