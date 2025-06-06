export function FirstSeparator() {
    return (
        <div className="w-full bg-[url('/firstseparatorbg.png')] bg-cover bg-center bg-no-repeat h-[25vh] flex items-center justify-center">
            <div className="text-white text-3xl md:text-5xl font-heebo font-bold text-center drop-shadow-lg flex flex-col">
                Possuímos membros em{" "}
                <span className="text-yellow-400 font-bold">
                    mais de 7 países pelo mundo.
                </span>
            </div>
        </div>
    );
}

export function SecondSeparator() {
    return (
        <div className="w-full bg-[url('/secondseparatorbg.png')] bg-cover bg-center bg-no-repeat h-[25vh] flex items-center justify-center">
         <div className="text-white text-3xl md:text-5xl font-heebo font-bold text-center drop-shadow-lg flex flex-row gap-2">
             <span>E</span>
                    <span className="text-yellow-400 font-bold">você</span>
                <span>pode fazer parte!</span>
            </div>
        </div>
    );
}
