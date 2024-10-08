import { MouseEventHandler, useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import { db, auth } from '../util/firebase/firebase-app';

type props = {
	children: React.ReactNode;
	modalState: Boolean;
	modalToggle: MouseEventHandler;
	saveFunction: MouseEventHandler;
	media: string;
	mode: string;
};

export default function AddModal({ children, modalState, modalToggle, saveFunction, media, mode }: props) {
	function saveForm() {
		//console.log(`Title: ${title}\nDeveloper: ${develoer}\nPlatform: ${platform}\nGenere: ${genre}\nRating: ${rating}\nComplete: ${complete}\nImage: ${image?.name}`);
	}

	return (
		<>
			<div onClick={modalToggle} id="modal-bg" className={`${modalState ? 'block' : 'hidden'} modal-background fixed inset-x-0 inset-y-0 z-40`}></div>
			<div
				id="modal"
				className={`${
					modalState ? 'flex flex-col' : 'hidden'
				} modal border-gray-500 shadow-md shadow-slate-950  lg:w-1/4 w-4/5 h-fit fixed inset-x-0 inset-y-0 m-auto items-center rounded-xl z-50 p-4`}
			>
				<h1 className="mx-auto">
					{mode} {media}
				</h1>
				{children}
				<div className="flex flex-row justify-evenly w-full mt-4">
					<button onClick={saveFunction} className="bg-purple-800 min-w-24 h-12 rounded-xl p-1">
						Save {media}
					</button>
					<button onClick={modalToggle} className=" bg-purple-800 min-w-24 h-12 rounded-xl p-1">
						Cancel
					</button>
				</div>
			</div>
		</>
	);
}
