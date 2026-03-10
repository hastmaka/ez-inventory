import Cropper from 'react-easy-crop'
import {Button, Group, Slider, Stack} from "@mantine/core";
import {forwardRef, useEffect} from "react";
import EzText from "@/ezMantine/text/EzText.tsx";
import {readFile} from "@/util/readFile.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {getCroppedImg, type PixelCrop} from "@/util/canvasUtil.ts";
import ImageProfile from "@/ezMantine/cropImageTool/ImagePreview.tsx";
import {deepSignal} from "deepsignal/react";
import classes from "./EzCropImageTool.module.scss";

type CropState = {
    crop: { x: number; y: number };
    zoom: number;
    croppedAreaPixels: { x: number; y: number; width: number; height: number } | null;
    imageSrc?: string;
    croppedImage: File | null;
    loading: boolean;
};

const signal = deepSignal<CropState>({
    crop: { x: 0, y: 0 },
    zoom: 1,
    croppedAreaPixels: null,
    imageSrc: undefined,
    croppedImage: null,
    loading: false
});

const EzCropImageTool = forwardRef<HTMLDivElement,{
    file: File | null
    handleCropAndSave: (file: File) => void
}>(function EzCropImageTool({ file, handleCropAndSave }, ref) {

    useEffect(() => {
        readFile(file!).then((url) => signal.imageSrc = url).catch(console.error)
        return () => {
            signal.crop = {x: 0, y: 0}
            signal.zoom = 1
            signal.croppedAreaPixels = null
            signal.imageSrc = undefined
            signal.croppedImage = null
            signal.loading = false
        }
    }, [file])

    const showCroppedImage =
        async (accept: boolean = false) => {
            try {
                signal.croppedImage = await getCroppedImg(
                    signal.imageSrc!,
                    signal.croppedAreaPixels!,
                    file?.name ?? 'cropped-image'
                )
                if (!accept) {
                    signal.crop = {x: 0, y: 0}
                    signal.zoom = 1
                }
            } catch (e) {
                console.error(e)
            }
        }

    const onCropChange =
        (crop: {x: number, y: number}) => {
            signal.crop = crop
        }

    const onCropComplete =
        (_croppedArea: PixelCrop, croppedAreaPixels: PixelCrop) => {
            signal.croppedAreaPixels = croppedAreaPixels
        }

    const onZoomChange =
        (zoom: number) => {
            signal.zoom = zoom
        }

    return (
        <div ref={ref} style={{display: 'flex', width: '100%'}}>
            <div className={classes['crop-container']}>
                {signal.croppedImage
                    ? (
                        <ImageProfile
                            file={signal.croppedImage}
                            alt='cropped-image-preview'
                            className={classes['preview-cropped-img']}
                        />
                    )
                    : !signal.imageSrc
                        ? <EzLoader h='calc(100vh - 120px)'/>
                        : (
                            <Cropper
                                image={signal.imageSrc}
                                crop={signal.crop}
                                zoom={signal.zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid
                                onCropChange={onCropChange}
                                onCropComplete={onCropComplete}
                                onZoomChange={(zoom) => signal.zoom = zoom}
                            />
                        )
                }
            </div>
            {signal.loading && <EzLoader h='calc(100vh - 120px)' />}
            {!signal.loading && <Stack
                className={classes['crop-controls']}
                justify='center'
                align='center'
                p='1rem'
                gap={0}
                flex={1}
            >
                {!signal.croppedImage && <EzText>Zoom</EzText>}
                {!signal.croppedImage && <Slider
                    value={signal.zoom}
                    label={signal.zoom}
                    size='lg'
                    maw={600}
                    w={{base: '95%', sm: 600}}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(v) => onZoomChange(v)}
                />}

                <Group>
                    <Button
                        maw={200}
                        onClick={() => {
                            if (!signal.croppedImage) return showCroppedImage()
                            signal.croppedImage = null
                        }}
                        {...(signal.croppedImage && {
                            color: 'red.7'
                        })}
                    >
                        {signal.croppedImage ? 'Cancel' : 'Preview'}
                    </Button>
                    <Button
                        maw={200}
                        onClick={async () => {
                            signal.loading = true
                            try {
                                const croppedFile = await getCroppedImg(
                                    signal.imageSrc!,
                                    signal.croppedAreaPixels!,
                                    file?.name ?? 'cropped-image'
                                )
                                if (croppedFile) {
                                    await handleCropAndSave(croppedFile)
                                    window.closeModal('crop-tool')
                                }
                            } catch (e) {
                                console.error(e)
                                signal.loading = false
                            }
                        }}
                    >
                        Accept
                    </Button>
                </Group>
            </Stack>}
        </div>
    );
})

export default EzCropImageTool;