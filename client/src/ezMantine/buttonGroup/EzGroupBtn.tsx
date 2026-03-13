import classes from './EzGroupBtn.module.scss';
import { Group, type GroupProps } from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzButton from "@/ezMantine/button/EzButton.tsx";
import {cloneElement} from "react";

type item = {
    icon: any;
    label?: string;
    withMenu?: boolean;
    onClick?: (e: MouseEvent) => void;
}

interface EzGroupBtnProps extends GroupProps {
    ITEMS: item[];
    className?: string;
    size?: "xs" | "sm" | "md" | "lg";
}

export default function EzGroupBtn({
    ITEMS,
    className = '',
    size,
    ...rest
}: EzGroupBtnProps){
    const onlyOne = Array.isArray(ITEMS) && ITEMS.length === 1

    return (
        <Group
            gap={0}
            className={`${onlyOne ? classes['only-one'] : classes['btn-container']} ${className}`}
            {...rest}
        >
            {ITEMS.map((item: any, index: number) => {
                const {icon, label, onClick, withMenu, ...rest} = item;
                const Icon = icon;
                if (withMenu) return cloneElement(icon, {key: index})

                return (
                    <EzButton
                        key={index}
                        size={size || 'sm'}
                        onClick={onClick}
                        {...rest}
                    >
                        <Icon/>
                        {label && <EzText>{label}</EzText>}
                    </EzButton>
                )
            })}
        </Group>
    );
}