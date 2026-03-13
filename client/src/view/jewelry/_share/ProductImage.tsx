import {useRef} from "react";
import EzText from "@/ezMantine/text/EzText.tsx";
import NoImage from "@/components/NoImage.tsx";
import CameraButton from "../_share/CameraButton.tsx";
import MobileCarousel from "../_fromPhone/MobileCarousel.tsx";
import {Button, FileButton, Group, Stack} from "@mantine/core";
import {IconCamera, IconPhotoPlus} from "@tabler/icons-react";
import ImageGrid from "../_share/ImageGrid.tsx";
import {JewelryModalController} from "../_modal/JewelryModalController.ts";

export default function ProductImage({
    fromMobile = true,
    modalId
}: {
    fromMobile?: boolean;
    modalId?: string;
}) {
    const {formData, addFile, modal} = JewelryModalController
    const resetRef = useRef<() => void>(null);
    const prodImage = formData?.product?.product_image_url
        ? formData.product.product_image_url.filter((i: any) => !i.document_primary)
        : []
    const images = formData.files ? [...formData.files, ...prodImage] : [...prodImage]

    async function handleFileUpload(files: File[]){
        const editing = modal.state === 'editing'
        if (!editing) {
            addFile(files)
        } else {
            await window.toast.U({
                modalId,
                id: {
                    title: `Adding image${files.length > 1 ? "s" : ""}.`,
                    message: 'Please wait...'
                },
                update: {
                    success: `Image${files.length > 1 ? 's' : ''} successfully added.`,
                    error: `Image${files.length > 1 ? 's' : ''} could not be added.`
                },
                cb: () => addFile(files)
            })
        }
        resetRef.current?.(); // 👈 reset FileButton after use
    }

    return (
        <Stack gap={16} flex={1}>
            <Stack gap={8}>
                <EzText>Product Images</EzText>
                <EzText size='xs' c='dimmed'>
                    Upload your own photos of the product here.
                </EzText>
                <Group gap={8}>
                    <FileButton
                        onChange={handleFileUpload}
                        accept="image/*"
                        multiple
                        resetRef={resetRef}
                    >
                        {(props) =>
                            <Button
                                size='md'
                                flex={1}
                                leftSection={<IconPhotoPlus/>}
                                {...props}
                            >Upload</Button>}
                    </FileButton>
                    <CameraButton
                        onCapture={(file) => addFile([file])}
                        flex={1}
                        leftSection={<IconCamera/>}
                        text='Open'
                    />
                </Group>
            </Stack>

            {!images.length
                ? <div style={{height: 200}}><NoImage/></div>
                : fromMobile ? (
                    <MobileCarousel images={images}/>
                ) : (
                    <ImageGrid images={images} modalId={modalId}/>
                )
            }
        </Stack>
    );
}