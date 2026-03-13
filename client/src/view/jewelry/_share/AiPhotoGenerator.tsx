import {useRef} from 'react';
import {ActionIcon, Box, Button, Checkbox, FileButton, Group, Image, Stack} from '@mantine/core';
import {IconCamera, IconPhotoPlus, IconSparkles, IconTrash} from '@tabler/icons-react';

import EzText from '@/ezMantine/text/EzText.tsx';
import EzGrid from '@/ezMantine/gridLayout/EzGrid.tsx';
import EzLoader from '@/ezMantine/loader/EzLoader.tsx';
import CameraButton from '@/view/jewelry/_share/CameraButton.tsx';
import {JewelryModalController} from '@/view/jewelry/_modal/JewelryModalController.ts';

export default function AiPhotoGenerator() {
    const {
        aiPhotosRaw,
        aiPhotos,
        aiPhotosSelected,
        aiPhotosLoading,
        addAiPhotoRaw,
        removeAiPhotoRaw,
        generateAiPhotos,
        toggleAiPhotoSelection,
        saveSelectedAiPhotos,
        formData,
    } = JewelryModalController;

    const resetRef = useRef<() => void>(null);
    const productId = formData?.product?.product_id;

    const hasSelected = Object.values(aiPhotosSelected).some(Boolean);

    return (
        <Stack gap={24}>
            {/* Raw Photos Section */}
            <Stack gap={8}>
                <Group gap={6}>
                    <IconSparkles size={18} color='var(--mantine-color-violet-5)'/>
                    <EzText>AI Photo Generator</EzText>
                </Group>
                <EzText size='xs' c='dimmed'>
                    Upload rough photos and let AI create professional product images.
                </EzText>
                <Group gap={8}>
                    <FileButton
                        onChange={(files) => {
                            addAiPhotoRaw(files);
                            resetRef.current?.();
                        }}
                        accept='image/*'
                        multiple
                        resetRef={resetRef}
                    >
                        {(props) => (
                            <Button
                                size='md'
                                flex={1}
                                leftSection={<IconPhotoPlus />}
                                {...props}
                            >Upload</Button>
                        )}
                    </FileButton>
                    <CameraButton
                        onCapture={(file) => addAiPhotoRaw([file])}
                        flex={1}
                        leftSection={<IconCamera />}
                        text='Camera'
                    />
                </Group>

                {aiPhotosRaw.length > 0 && (
                    <EzGrid gridTemplateColumns='repeat(auto-fill, minmax(140px, 1fr))'>
                        {aiPhotosRaw.map((file: File, i: number) => (
                            <Box pos='relative' key={`${file.name}-${i}`}>
                                <ActionIcon
                                    pos='absolute'
                                    style={{right: 8, top: 8}}
                                    color='red'
                                    size='sm'
                                    onClick={() => removeAiPhotoRaw(file)}
                                >
                                    <IconTrash size={14} />
                                </ActionIcon>
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    fit='cover'
                                    w='100%'
                                    h={140}
                                    radius={4}
                                />
                            </Box>
                        ))}
                    </EzGrid>
                )}

                <Button
                    size='md'
                    color='blue.7'
                    disabled={!aiPhotosRaw.length || aiPhotosLoading}
                    loading={aiPhotosLoading}
                    onClick={generateAiPhotos}
                >
                    Generate AI Photos
                </Button>
            </Stack>

            {/* AI Generated Photos Section */}
            {(aiPhotos.length > 0 || aiPhotosLoading) && (
                <Stack gap={8}>
                    <EzText>AI Generated Photos</EzText>
                    <EzText size='xs' c='dimmed'>
                        Select the photos you want to keep
                    </EzText>

                    {aiPhotosLoading && <EzLoader h={200} />}

                    {aiPhotos.length > 0 && (
                        <>
                            <EzGrid
                                gridTemplateColumns='repeat(auto-fill, minmax(180px, 1fr))'
                            >
                                {aiPhotos.map((url: string, i: number) => (
                                    <Checkbox.Card
                                        key={`ai-${i}`}
                                        checked={!!aiPhotosSelected[i]}
                                        radius='md'
                                        p={4}
                                        onClick={() => toggleAiPhotoSelection(i)}
                                    >
                                        <Box pos='relative'>
                                            <Checkbox.Indicator
                                                pos='absolute'
                                                style={{right: 8, top: 8, zIndex: 1}}
                                            />
                                            <Image
                                                src={url}
                                                alt={`AI photo ${i + 1}`}
                                                fit='cover'
                                                w='100%'
                                                h={180}
                                                radius={4}
                                            />
                                        </Box>
                                    </Checkbox.Card>
                                ))}
                            </EzGrid>

                            {productId && (
                                <Button
                                    size='md'
                                    color='teal.7'
                                    disabled={!hasSelected}
                                    onClick={() => saveSelectedAiPhotos(productId)}
                                >
                                    Save Selected
                                </Button>
                            )}
                        </>
                    )}
                </Stack>
            )}
        </Stack>
    );
}
