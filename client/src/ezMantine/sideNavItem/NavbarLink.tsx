import {AppController} from "@/AppController.ts";
import {Group, rem, Tooltip} from "@mantine/core";
import UnStyledButton from "./UnstyledButton.tsx";
import {IconChevronRight, IconHome2} from "@tabler/icons-react";
import classes from "@/ezMantine/sideNavItem/EzSideNavItem.module.scss";

const TooltipLabel = ({
    label, hasChildren, opened
} : {
    label: string,
    hasChildren: boolean,
    opened: boolean
}) => {
    if (!hasChildren) return label;
    return (
        <Group gap={4}>
            {label}
            <IconChevronRight
                className={classes.chevron}
                stroke={2}
                style={{
                    width: rem(16),
                    height: rem(16),
                    transform: opened ? 'rotate(-90deg)' : 'none',
                }}
            />
        </Group>
    )
}

function NavbarLink({
    hasLinks, icon, label, active, onClick, opened, ...rest
}: {
    icon: typeof IconHome2,
    label: string,
    active?: boolean;
    onClick?: () => void;
    hasLinks: boolean;
    opened: boolean;
    [key: string]: any;
}) {
    const {burger} = AppController

    if (!burger.opened) {
        return (
            <UnStyledButton
                active={active}
                onClick={onClick}
                icon={icon}
                label={label}
                hasLinks={hasLinks}
                opened={opened}
                {...rest}
            />
        )
    }

    return (
        <Tooltip
            label={<TooltipLabel label={label} hasChildren={burger.opened && hasLinks} opened={opened}/>}
            position="right"
            transitionProps={{ duration: 0 }}
        >
            <UnStyledButton
                active={active}
                onClick={onClick}
                icon={icon}
                label={label}
                hasLinks={hasLinks}
                opened={opened}
                {...rest}
            />
        </Tooltip>
    );
}

export default NavbarLink;