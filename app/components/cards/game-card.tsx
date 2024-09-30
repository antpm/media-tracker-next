import { QueryDocumentSnapshot } from "firebase/firestore";

function HomeGameCard({ gameDoc }: { gameDoc: QueryDocumentSnapshot }) {
    const game = gameDoc.data();
    const date = game.complete.toDate();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
    }).format(date);

    return (
        <div className="w-fit h-fit flex flex-row card-bg rounded-xl border-t-2 border-gray-500 shadow-md shadow-slate-950 p-4">
            <div className="h-full bg-slate-900">
                <p>Image Will Go here</p>
            </div>
            <div className=" m-2 h-full flex flex-col text-4xl">
                <p>{game.title}</p>
                <p>{game.developer}</p>
                <p>{game.platform}</p>
                <p>{game.genre}</p>
                <p>{formattedDate}</p>
                <p>{game.rating}</p>
            </div>
        </div>
    );
}

function ListGameCard({ gameDoc }: { gameDoc: any }) { }

export { HomeGameCard, ListGameCard };
