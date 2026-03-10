import EzText from "@/ezMantine/text/EzText.tsx";
import {Stack} from "@mantine/core";
import CameraButton from "./CameraButton.tsx";
import ImageViewer from "../_fromPhone/ImageViewer.tsx";
import {JewelryModalController} from "../_modal/JewelryModalController.ts";

export default function DescriptionImage({id}: {id?: number | undefined}) {
    const {
        formData,
        handleInput,
    } = JewelryModalController
    return (
        <Stack gap={16} flex={1}>
            <Stack gap={8}>
                <EzText>Description Only</EzText>
                {/*<EzText size='10px'>This image is only for measurement purposes.</EzText>*/}
                {!id && (
                    <CameraButton
                        onCapture={(file: File) => {
                            handleInput('product', 'file_description', file)
                        }}
                        text='Open'
                    />
                )}
            </Stack>
            <ImageViewer file={formData.product?.file_description}/>
        </Stack>
    );
}