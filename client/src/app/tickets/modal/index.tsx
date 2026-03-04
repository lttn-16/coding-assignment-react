import { Input, Modal } from "antd";
import { useState } from "react";

interface IAddModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (description: string) => void;
}

const AddModal = ({ open, onClose, onSubmit }: IAddModalProps) => {
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        if(!description.trim()) return;
        onSubmit && onSubmit(description);
        setDescription("");
    }

    return (
        <Modal open={open} onCancel={onClose} onOk={handleSubmit}>
            <h3>Add New Ticket</h3>
            <Input
                placeholder="Add description for the ticket"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
        </Modal>
    );
};

export default AddModal;
