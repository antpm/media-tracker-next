import { MouseEventHandler } from 'react';

type props = {
	children: React.ReactNode;
	modalState: Boolean;
	modalToggle: MouseEventHandler;
	saveFunction: MouseEventHandler;
	media: string;
	mode: string;
};

export default function Modal({ children, modalState, modalToggle, saveFunction, media, mode }: props) {
	return (
		<>
			<div onClick={modalToggle} id="modal-bg" className={`${modalState ? 'block' : 'hidden'} modal-background fixed inset-x-0 inset-y-0`}></div>
			<div id="modal" className={`${modalState ? 'flex flex-col' : 'hidden'} w-96 h-96 fixed inset-x-0 inset-y-0 m-auto items-center bg-gray-800 rounded-xl`}>
				<h1 className="mx-auto">
					{mode} {media}
				</h1>
				<div className="flex-grow">{children}</div>
				<div className="flex flex-row justify-evenly w-full">
					<button onClick={saveFunction} className="bg-gray-500">
						Save {media}
					</button>
					<button onClick={modalToggle} className=" bg-gray-500">
						Cancel
					</button>
				</div>
			</div>
		</>
	);
}
