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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

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
                <DropdownMenuItem className="text-center text-[#234B0C] font-bold">
                    <Trash2 className="w-4 h-4" />
                    Deletar
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tem certeza?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Você tem certeza que deseja deletar esta postagem? Todos os
                    dados serão apagados!
                </DialogDescription>
                <DialogFooter>
                    <Button variant="destructive" onClick={handleDelete}>
                        Deletar
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeletePostButton;
