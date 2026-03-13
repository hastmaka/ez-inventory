import { forwardRef } from "react";
import { Box, Text, type TextProps } from "@mantine/core";
import type { ReactNode } from "react";
import classes from "./EzText.module.scss";

interface EzTextProps extends TextProps {
    fw?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    align?: "left" | "center" | "right";
    bold?: string;
    boldProps?: Record<string, any>;
    children?: ReactNode;
    maw?: number | string;
    [key: string]: any;
}

const EzText = forwardRef<HTMLDivElement, EzTextProps>(
    ({ fw, children, bold, boldProps, maw, ...rest }, ref) => {
        const fwMap: Record<string, number> = {
            xs: 400,
            sm: 500,
            md: 600,
            lg: 700,
            xl: 800,
            xxl: 900,
        };

        const renderBold = () =>
            bold ? (
                <Text component="span" className={classes.text} fw={fwMap["md"]} {...boldProps}>
                    {bold}&nbsp;
                </Text>
            ) : null;

        const renderText = () => (
            <Text
                fw={fwMap[fw as string]}
                className={classes.text}
                {...rest}
                ref={ref} // <- forwardRef applied here
            >
                {renderBold()}
                {children}
            </Text>
        );

        if (maw) {
            return <Box maw={maw}>{renderText()}</Box>;
        }

        return renderText();
    }
);

EzText.displayName = "EzText";

export default EzText;
