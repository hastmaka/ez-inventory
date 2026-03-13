import {Button, Tooltip} from "@mantine/core";
import {forwardRef} from "react";
import classes from './EzButton.module.scss'

interface EzButtonProps {
    children: any;
    tooltip?: string;
    [key: string]: any;
}

const EzButton = forwardRef<HTMLButtonElement, EzButtonProps>(
    ({children, tooltip, ...rest}, ref) => {
        const btn = () => (
            <Button
                variant='filled'
                ref={ref}
                styles={{
                    label: {
                        display: 'flex',
                        gap: '4px',
                        alignItems: 'center'
                    }
                }}

                classNames={{
                    root: classes.root,
                }}
                {...rest}
            >
                {children}
            </Button>
        );

        if (tooltip) {
            return (
                <Tooltip color="dark.6" label={tooltip}>
                    {btn()}
                </Tooltip>
            );
        }

        return btn();
    }
);

EzButton.displayName = "EzButton";

export default EzButton;