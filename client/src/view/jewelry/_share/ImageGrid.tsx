import {ActionIcon, Box, Image} from "@mantine/core";
import EzGrid from "@/ezMantine/gridLayout/EzGrid.tsx";
import {JewelryModalController} from "../_modal/JewelryModalController.ts";
import {IconTrash} from "@tabler/icons-react";
import {lazy, Suspense} from "react";
const FullCarousel =
    lazy(() => import('./FullCarousel.tsx'));

export default function ImageGrid({
    images,
    modalId
}: {
    images: any[],
    modalId?: string
}) {
    const {removeFile, modal} = JewelryModalController


    function handleImageClick() {
        window.openModal({
            modalId: "image-view-modal",
            title: "Image Carousel",
            size: "xl",
            children: (
                <Suspense fallback={null}>
                    <FullCarousel images={images}/>
                </Suspense>
            ),
            styles: {
                body: {padding: 0}
            },
            onClose: () => {}
        })
    }

    async function handleRemoveFile(file: any) {
        const editing = modal.state === 'editing'
        if (!editing) return removeFile(file)

        await window.toast.U({
            modalId,
            id: {
                title: "Removing image.",
                message: 'Please wait...'
            },
            update: {
                success: 'Image successfully removed.',
                error: 'Image could not be removed.'
            },
            cb: () => removeFile(file)
        })
    }

    return (
        <Box>
            <EzGrid gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))">
                {images.map((file: File | any, i: number) => (
                    <Box pos='relative' key={i}>
                        <ActionIcon
                            pos='absolute'
                            style={{
                                right: 20,
                                top: 8,
                            }}
                            onClick={() => handleRemoveFile(file)}
                        >
                            <IconTrash/>
                        </ActionIcon>
                        <Image
                            src={file instanceof File ? URL.createObjectURL(file) : file.document_url}
                            alt={file.name}
                            fit='cover'
                            w="100%"
                            h="100%"
                            mih={180}
                            radius={4}
                            onClick={handleImageClick}
                        />
                    </Box>
                ))}
            </EzGrid>
        </Box>
    );
}