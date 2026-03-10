import {Flex} from "@mantine/core";
import classes from './ToolBar.module.scss'
import React from "react";

export default function ToolBar({
    children,
    ...rest
}: {
    children?: React.ReactNode;
    [key: string]: any;
}) {

    return (
        <Flex
            justify='space-between'
            align='center'
            p='.5rem 0'
            // direction='row'
            // h={50}
            className={classes.toolbar}
            {...rest}
        >
            {children}
        </Flex>

    );
}