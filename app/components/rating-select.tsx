'use client';
import { useState } from 'react';
import Image from 'next/image';
import { StarFilled } from '../public/icons/icons';

export default function RatingSelect({ setRating }: { setRating: Function }) {
	const [hoverStars, setHoverStars] = useState<boolean[]>([false, false, false, false, false]);
	const [selectedStars, setSelectedStars] = useState<boolean[]>([true, false, false, false, false]);
	const [tempStars, setTempStars] = useState<boolean[]>([true]);

	function enableHoverStars(num: number) {
		let array: boolean[] = [false, false, false, false, false];
		for (let i = 0; i <= num; i++) {
			array[i] = true;
		}

		setHoverStars(array);
	}

	function disableHoverStars() {
		setHoverStars([false, false, false, false, false]);
	}

	function enableSelectStars(num: number) {
		let array: boolean[] = [false, false, false, false, false];
		for (let i = 0; i <= num; i++) {
			array[i] = true;
		}

		setSelectedStars(array);
		setTempStars(array);
	}

	function disableSelectStars() {
		setSelectedStars([false]);
	}

	return (
		<section title="Books Page" className="md:w-3/5 w-10/12 h-fit mx-auto my-10">
			<div className="flex flex-row flex-wrap w-full h-fit">
				<Image
					alt="star"
					src={StarFilled}
					className={`${hoverStars[0] || selectedStars[0] ? 'opacity-100' : 'opacity-25'} hover:scale-110 w-24 h-24  transition-all duration-300 ease-in-out`}
					onMouseEnter={() => {
						enableHoverStars(0);
						disableSelectStars();
					}}
					onMouseLeave={() => {
						disableHoverStars();
						setSelectedStars(tempStars);
					}}
					onClick={() => {
						enableSelectStars(0);
						setRating(1);
					}}
				/>
				<Image
					alt="star"
					src={StarFilled}
					className={`${hoverStars[1] || selectedStars[1] ? 'opacity-100' : 'opacity-25'} hover:scale-110  w-24 h-24  transition-all duration-300 ease-in-out`}
					onMouseEnter={() => {
						enableHoverStars(1);
						disableSelectStars();
					}}
					onMouseLeave={() => {
						disableHoverStars();
						setSelectedStars(tempStars);
					}}
					onClick={() => {
						enableSelectStars(1);
						setRating(2);
					}}
				/>
				<Image
					alt="star"
					src={StarFilled}
					className={`${hoverStars[2] || selectedStars[2] ? 'opacity-100' : 'opacity-25'} hover:scale-110  w-24 h-24  transition-all duration-300 ease-in-out`}
					onMouseEnter={() => {
						enableHoverStars(2);
						disableSelectStars();
					}}
					onMouseLeave={() => {
						disableHoverStars();
						setSelectedStars(tempStars);
					}}
					onClick={() => {
						enableSelectStars(2);
						setRating(3);
					}}
				/>
				<Image
					alt="star"
					src={StarFilled}
					className={`${hoverStars[3] || selectedStars[3] ? 'opacity-100' : 'opacity-25'} hover:scale-110  w-24 h-24  transition-all duration-300 ease-in-out`}
					onMouseEnter={() => {
						enableHoverStars(3);
						disableSelectStars();
					}}
					onMouseLeave={() => {
						disableHoverStars();
						setSelectedStars(tempStars);
					}}
					onClick={() => {
						enableSelectStars(3);
						setRating(4);
					}}
				/>
				<Image
					alt="star"
					src={StarFilled}
					className={`${hoverStars[4] || selectedStars[4] ? 'opacity-100' : 'opacity-25'} hover:scale-110  w-24 h-24  transition-all duration-300 ease-in-out`}
					onMouseEnter={() => {
						enableHoverStars(4);
						disableSelectStars();
					}}
					onMouseLeave={() => {
						disableHoverStars();
						setSelectedStars(tempStars);
					}}
					onClick={() => {
						enableSelectStars(4);
						setRating(5);
					}}
				/>
			</div>
		</section>
	);
}
