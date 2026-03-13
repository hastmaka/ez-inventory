import {Group, Image} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzButton from "@/ezMantine/button/EzButton.tsx";
import {IconFileTypeCsv, IconSettings} from "@tabler/icons-react";

export type PlatformExporterProps = {
    src: string;
    platName: string;
    config: () => void;
    generate: () => void;
    loading?: boolean;
}

export default function PlatformExporter({src, platName, config, generate, loading}: PlatformExporterProps) {
    return (
        <Group justify='space-between'>
            <Group align='center' gap={8}>
                <Image src={src} w={30} h='auto'/>
                <EzText>{platName}</EzText>
            </Group>
            <Group>
                <EzButton leftSection={<IconSettings/>} onClick={config}>Config</EzButton>
                <EzButton leftSection={<IconFileTypeCsv/>} onClick={generate} loading={loading}>Generate</EzButton>
            </Group>
        </Group>
    )
}