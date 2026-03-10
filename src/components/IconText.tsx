import {Group, Stack} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.jsx";
import {createElement, type ElementType} from "react";

interface IconTextProps {
    icon: ElementType;
    text: string | string[];
    [key: string]: any;
}

export default function IconText({icon, text, ...rest}: IconTextProps) {
    return (
        <Stack gap={8} {...rest}>
            <Group wrap="nowrap" align="flex-start">
                {createElement(icon, {stroke: 1, style: {minHeight: '1.5rem', minWidth: '1.5rem'}})}
                <Stack gap={2} style={{ flex: 1 }}>
                    {Array.isArray(text)
                        ? text.map((text: string, index: number) => (
                            <EzText key={index} fw={index === 0 ? 'md' : 'sm'}>{text}</EzText>
                        ))
                        : <EzText>{text}</EzText>
                    }
                </Stack>
            </Group>
        </Stack>
    )
}
