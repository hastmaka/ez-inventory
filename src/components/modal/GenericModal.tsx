import {Stack} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.jsx";
import type {ReactNode} from "react";
import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";

export default function GenericModal({
    text,
    description,
    children,
    wrapperProps,
    ...rest
}: {
    text?: string,
    description?: string,
    children?: ReactNode,
    cancel?: () => void,
    accept?: any,
    acceptProps?: Record<string, any>,
    cancelProps?: Record<string, any>,
    [key: string]: any
}) {
    return (
        <Stack flex={1} {...wrapperProps}>
            {text && <EzText size="md">{text}</EzText>}
            {description && <EzText size="xs" c='red.5'>{description}</EzText>}
            {children}
            {(rest?.cancel || rest?.accept ) && <SaveCancelDeleteBtns {...rest}/>}
        </Stack>
    )
}