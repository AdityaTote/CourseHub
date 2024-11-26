import { Button } from "./ui/button";

interface ButtonCompoProps{
    text: string;
    onClick: () => void,
    startIcon?: React.ReactNode,
}

export function ButtonCompo({
    text,
    onClick,
    startIcon
}: ButtonCompoProps){
    return(
        <Button variant={"outline"} onClick={onClick} className="flex bg-blue-600 rounded-lg hover:bg-blue-700 text-white font-semibold">
            <div >
            {startIcon}
            </div>
            <div className={"mx-2"}>
            {text}
            </div>
        </Button>
    )
}