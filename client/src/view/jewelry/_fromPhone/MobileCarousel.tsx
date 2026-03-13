import {Carousel} from "@mantine/carousel";
import {ActionIcon, Image} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";
import {JewelryModalController} from "@/view/jewelry/_modal/JewelryModalController.ts";
import {lazy, Suspense} from "react";
const FullCarousel =
    lazy(() => import('../_share/FullCarousel.tsx'));

export default function MobileCarousel({images}: {images: any[]}) {
    const {formData, removeFile} = JewelryModalController

    function handleImageClick() {
        window.openModal({
            modalId: "image-view-modal",
            title: "Image Carousel",
            fullScreen:true,
            children: (
                <Suspense fallback={null}>
                    <FullCarousel images={images} fullScreen/>
                </Suspense>
            ),
            styles: {
                body: {padding: 0}
            },
            transitionProps: { transition: 'slide-up', duration: 200 },
            onClose: () => {}
        })
    }

    return (
        <Carousel
            // mah={200}
            slideSize="33.333333%"
            slideGap="sm"
            withIndicators
            emblaOptions={{
                loop: true,
                dragFree: false,
                align: 'center'
            }}
        >
            {formData?.files.map((file: File, i: number) => (
                <Carousel.Slide key={i} pos='relative'>
                    <ActionIcon
                        pos='absolute'
                        style={{
                            right: 20,
                            top: 8,
                        }}
                        onClick={() => removeFile(file)}
                    >
                        <IconTrash/>
                    </ActionIcon>
                    <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        fit='cover'
                        // w="100%"
                        mih={140}
                        mah={140}
                        radius={4}
                        onClick={handleImageClick}
                    />
                </Carousel.Slide>
            ))}
        </Carousel>
    );
}