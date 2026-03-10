import {ActionIcon, Box, Image} from "@mantine/core";
import EzGrid from "@/ezMantine/gridLayout/EzGrid.tsx";
import {IconTrash} from "@tabler/icons-react";
import {lazy, Suspense} from "react";
const FullCarousel =
    lazy(() => import('./FullCarousel.tsx'));

export default function ImageGrid({
    images = [],
    removeFile,
}: {
    images: any[],
    removeFile: (file: File) => void,
}) {
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

    return (
        <EzGrid gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))">
            {images.map((file: File | any, i: number) => (
                <Box pos='relative' key={i}>
                    <ActionIcon
                        pos='absolute'
                        style={{
                            right: 8,
                            top: 8,
                        }}
                        onClick={() => removeFile(file)}
                    >
                        <IconTrash/>
                    </ActionIcon>
                    <Image
                        src={file instanceof File ? URL.createObjectURL(file) : file.document_url}
                        alt={file.name}
                        fit='cover'
                        w="100%"
                        h="100%"
                        mih={140}
                        radius={4}
                        onClick={handleImageClick}
                    />
                </Box>
            ))}
        </EzGrid>
    );
}