import type { ComponentProps, ReactNode } from "react";
import { Box, Paper, Stack } from "@mantine/core";
import EzCardHeader from "./EzCardHeader.jsx";

export type BtnProps = {
    title?: string;
    label?: string;
    tooltip?: string;
    handleAdd?: () => void;
}

interface EzCardProps extends BtnProps {
    children: ReactNode;
    innerContainer?: ComponentProps<typeof Box>;
    container?: ComponentProps<typeof Stack>;
    customHeader?: ReactNode;
}

export default function EzCard({ children, innerContainer, container, customHeader, ...rest }: EzCardProps) {
    return (
        <Stack
            component={Paper}
            pos='relative'
            display='flex'
            gap={0}
            h='100%'
            {...container}
            style={{
                boxShadow: 'none',
            }}
        >
            {customHeader ? <EzCardHeader>{customHeader}</EzCardHeader> : rest?.title && <EzCardHeader {...rest} />}
            <Box style={{ padding: '1rem' }} {...innerContainer}>
                {children}
            </Box>
        </Stack>
    )
}
