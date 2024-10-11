import { MouseEventHandler, useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import { db, auth } from '../util/firebase/firebase-app';

type props = {
	children: React.ReactNode;
	modalState: Boolean;
	modalToggle: MouseEventHandler;
};

export default function AddModal({ children, modalState, modalToggle }: props) {
	return (
		<>
			<div
				onClick={modalToggle}
				id="modal-bg"
				className={`${modalState ? 'visible opacity-100' : 'opacity-0 invisible'} transition-all duration-300 ease-out modal-background fixed inset-x-0 inset-y-0 z-40`}></div>
			<div
				id="modal"
				className={`${
					modalState ? 'visible opacity-100' : 'invisible opacity-0'
				} flex flex-col modal border-gray-500 shadow-md shadow-slate-950  lg:w-1/4 w-fit min-w-80 h-fit fixed inset-x-0 inset-y-0 m-auto items-center rounded-xl z-50 p-4 transition-all duration-300 ease-out`}>
				{children}
			</div>
		</>
	);
}
