const DeleteUserButton = () => {
    return (
        <section
            id="inicio"
            className="h-[10vh] bg-[#3C6C0C] translate-y-[10%] w-full rounded-[38px]"
        >
            <section className="h-[9vh] bg-[#FCB201] overflow-hidden w-full rounded-[38px] mt-8">
                <div className="flex flex-col items-center justify-center h-full mx-auto w-[40vw]">
                    <h1 className="text-black text-sm xs:text-md sm:text-xl md:text-2xl font-bold break-words">
                        Deletar usuário
                    </h1>
                </div>
            </section>
        </section>
    );
};

export default DeleteUserButton;
