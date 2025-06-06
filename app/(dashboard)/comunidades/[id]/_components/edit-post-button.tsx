import { Edit } from "lucide-react";

interface EditPostButtonProps {
    onClick: () => void;
}

const EditPostButton = ({ onClick }: EditPostButtonProps) => (
    <button
        className="flex items-center gap-2 text-[#234B0C] font-bold w-full px-2 py-1.5 rounded hover:bg-gray-100"
        onClick={onClick}
        type="button"
    >
        <Edit />
        Editar
    </button>
);

export default EditPostButton;
