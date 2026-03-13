import {ActionIcon, Group, Tooltip} from "@mantine/core";
import {IconInfoCircle} from "@tabler/icons-react";
import EzText from "@/ezMantine/text/EzText.tsx";

function EzLabel(props: any) {
    const {info, label, required} = props

    if (!info) {
        if (required) {
            return (
                <Group gap={4}>
                    <EzText>{label || "Select values"}</EzText>
                    {required && <EzText c='red.8'>*</EzText>}
                </Group>
            )
        }
        return <EzText>{label || "Select values"}</EzText>
    }

    return (
        <Group gap={4} align='center'>
            <EzText>{label || "Select values"}</EzText>
            {required && <EzText c='red.8'>*</EzText>}
            <Tooltip label={info} multiline maw={360}>
                <ActionIcon  variant='subtle' size='sm'>
                    <IconInfoCircle style={{width: '1.5rem', height: 'auto'}}/>
                </ActionIcon>
            </Tooltip>
        </Group>
    )
}

export default EzLabel;