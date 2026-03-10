import {Textarea} from "@mantine/core";
import {JewelryModalController} from "@/view/jewelry/_modal/JewelryModalController.ts";

export default function EditDescriptionModal() {
    const {setText, selectToEdit} = JewelryModalController;
    return (
        <Textarea
            value={selectToEdit}
            autosize
            maxRows={9}
            onChange={(e) => setText(e.target.value)}
        />
    );
}