'use client';
import { useState } from 'react';

export default function Books() {
	const [stars, setStars] = useState<boolean[]>([false, false, false, false, false]);

	function enableStars(num: number) {
		let array: boolean[] = [false, false, false, false, false];
		for (let i = 0; i <= num; i++) {
			array[i] = true;
		}

		setStars(array);
	}

	function disableStars() {
		setStars([false, false, false, false, false]);
	}

	return (
		<section title="Books Page" className="md:w-3/5 w-10/12 h-fit mx-auto my-10">
			<div className="flex flex-row flex-wrap w-full h-fit">
				<div
					className={`${stars[0] ? 'opacity-100' : 'opacity-50'} w-24 h-24 bg-red-600 transition-all duration-300 ease-in-out`}
					onMouseEnter={() => {
						enableStars(0);
					}}
					onMouseLeave={disableStars}></div>
				<div
					className={`${stars[1] ? 'opacity-100' : 'opacity-50'} w-24 h-24 bg-blue-600 transition-all duration-300 ease-in-out`}
					onMouseEnter={() => {
						enableStars(1);
					}}
					onMouseLeave={disableStars}></div>
				<div
					className={`${stars[2] ? 'opacity-100' : 'opacity-50'} w-24 h-24 bg-yellow-600 transition-all duration-300 ease-in-out`}
					onMouseEnter={() => {
						enableStars(2);
					}}
					onMouseLeave={disableStars}></div>
				<div
					className={`${stars[3] ? 'opacity-100' : 'opacity-50'} w-24 h-24 bg-green-600 transition-all duration-300 ease-in-out`}
					onMouseEnter={() => {
						enableStars(3);
					}}
					onMouseLeave={disableStars}></div>
				<div
					className={`${stars[4] ? 'opacity-100' : 'opacity-50'} w-24 h-24 bg-purple-600 transition-all duration-300 ease-in-out`}
					onMouseEnter={() => {
						enableStars(4);
					}}
					onMouseLeave={disableStars}></div>
			</div>
		</section>
	);
}
