import {forwardRef} from 'react';
import {AppController} from "@/AppController.ts";
import {Group, rem, UnstyledButton} from "@mantine/core";
import classes from "./EzSideNavItem.module.scss";
import {IconChevronRight, IconHome2} from "@tabler/icons-react";

const UnStyledButton = forwardRef(({
    hasLinks, icon: Icon, active, label, onClick, opened
}: {
    icon: typeof IconHome2,
    label: string,
    active?: boolean;
    onClick?: () => void;
    hasLinks?: boolean | undefined,
    opened?: boolean
}, ref: any) => {
    const {burger} = AppController
    return (
        <UnstyledButton
            ref={ref}
            onClick={onClick}
            className={classes.link}
            data-active={active || undefined}
            style={{
                ['--btn-width' as string]: burger.opened ? '50px' : '190px',
                ['--btn-justify' as string]: burger.opened ? 'center' : 'space-between',
                ['--btn-height' as string]: burger.opened ? '50px' : '36px',
                width: '100%',
            }}
        >
            <Group gap={0} wrap='nowrap'>
                <Icon size={22} stroke={1.5} style={{marginInline: 10}}/>
                {!burger.opened && <span>{label}</span>}
            </Group>
            {hasLinks && !burger.opened && (
                <IconChevronRight
                    className={classes.chevron}
                    stroke={2}
                    style={{
                        width: rem(16),
                        height: rem(16),
                        marginRight: '8px',
                        transform: opened ? 'rotate(-90deg)' : 'none',
                    }}
                />
            )}
        </UnstyledButton>
    )
})

export default UnStyledButton;