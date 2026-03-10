import {Carousel} from "@mantine/carousel";
import {Image} from "@mantine/core";
import NoImage from "@/components/NoImage.tsx";

export default function FullCarousel({
    fullScreen = false,
    images
}: {
    fullScreen?: boolean;
    images: any[];
}) {
    if (!images) return <NoImage size={10}/>;
    return (
        <Carousel
            slideGap="sm"
            withIndicators
            emblaOptions={{
                loop: true,
                dragFree: false,
                align: 'center'
            }}
            {...(fullScreen && {
                styles: {
                    container: {height: '100dvh'}
                }
            })}
        >
            {images.map((file: File | any, i: number) => (
                <Carousel.Slide key={i}>
                    <Image
                        src={file instanceof File ? URL.createObjectURL(file) : file.document_url}
                        alt={file.name}
                        fit='cover'
                        w="100%"
                        h="auto"
                    />
                </Carousel.Slide>
            ))}
        </Carousel>
    );
}