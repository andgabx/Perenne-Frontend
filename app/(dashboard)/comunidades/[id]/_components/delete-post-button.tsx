import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogHeader,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { deletePost } from "@/pages/api/post/delete";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const DeletePostButton = ({
    postId,
    groupId,
}: {
    postId: string;
    groupId: string;
}) => {
    const session = useSession();
    const router = useRouter();

    const handleDelete = async () => {
        try {
            if (!session.data?.user.accessToken) {
                throw new Error("Token não encontrado");
            }
            if (!postId) {
                throw new Error("ID da postagem não encontrado");
            }
            await deletePost(postId, groupId, session.data.user.accessToken);
            toast.success("Postagem deletada com sucesso!");
            router.refresh(); // Refresh the page to update the posts list
        } catch (error) {
            console.error("Erro ao deletar post:", error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="bg-[#FFB800] text-center text-lg text-[#234B0C] w-full font-bold rounded-xl px-8 py-2 border-2 border-[#FFB800] shadow-none hover:bg-[#ffc72c] hover:text-[#234B0C] transition-all"
                >
                    Prosseguir
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white w-[90vw] max-w-xl rounded-3xl p-8">
                <DialogHeader className="items-center">
                    <DialogTitle asChild>
                        <h2 className="text-[#234B0C] text-2xl md:text-3xl font-extrabold text-center uppercase tracking-wide">
                            EXCLUIR PUBLICAÇÃO
                        </h2>
                    </DialogTitle>
                </DialogHeader>
                <div className="w-full h-px bg-[#234B0C] opacity-40 my-2" />
                <DialogDescription asChild>
                    <div className="text-center text-black text-xl font-normal mt-6 mb-8">
                        Tem certeza que deseja excluir esta publicação?
                        <br />
                        Essa ação não pode ser desfeita.
                    </div>
                </DialogDescription>
                <DialogFooter className="flex flex-row gap-4 justify-center mt-4">
                    <DialogClose asChild>
                        <Button
                            className="bg-[#FFB800] text-[#234B0C] font-extrabold text-lg rounded-xl px-8 py-2 border-2 border-[#FFB800] shadow-none hover:bg-[#ffc72c] hover:text-[#234B0C] transition-all"
                            type="button"
                        >
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleDelete}
                        className="bg-white text-[#234B0C] font-extrabold text-lg rounded-xl px-8 py-2 border-2 border-[#FFB800] shadow-none hover:bg-[#FFB800] hover:text-[#234B0C] transition-all"
                        type="button"
                    >
                        Excluir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeletePostButton;
