import EzText from "@/ezMantine/text/EzText.tsx";
import {Badge, Box, Group, Stack} from "@mantine/core";
import CameraButton from "./CameraButton.tsx";
import ImageViewer from "../_fromPhone/ImageViewer.tsx";
import {JewelryModalController} from "../_modal/JewelryModalController.ts";

export default function DescriptionImage({id}: {id?: number | undefined}) {
    const {
        formData,
        handleInput,
    } = JewelryModalController

    if (id) {
        return (
            <Stack gap={8}>
            <EzText>Description Only</EzText>
            <Group
                gap={0}
                wrap='nowrap'
                align='stretch'
                style={{border: '1px solid var(--mantine-color-dark-4)', borderRadius: 8, overflow: 'hidden'}}
            >
                <Box w={90} miw={90}>
                    <ImageViewer file={formData.product?.file_description} mah={90}/>
                </Box>
                <Stack gap={4} p={10} justify='center'>
                    <Group gap={6}>
                        <EzText fw={600} size='sm'>AI Reference</EzText>
                        <Badge size='xs' variant='light' color='violet'>Source</Badge>
                    </Group>
                    <EzText size='xs' c='dimmed' lh={1.4}>
                        Original photo used to generate details and description.
                    </EzText>
                </Stack>
            </Group>
            </Stack>
        );
    }

    return (
        <Stack gap={16} flex={1}>
            <Stack gap={8}>
                <EzText>Description Only</EzText>
                <CameraButton
                    onCapture={(file: File) => {
                        handleInput('product', 'file_description', file)
                    }}
                    text='Open'
                />
            </Stack>
            <ImageViewer file={formData.product?.file_description}/>
        </Stack>
    );
}