import {IconMoonFilled, IconSunFilled} from "@tabler/icons-react";
import {ActionIcon} from "@mantine/core";
import {ThemeController} from "@/theme/ThemeController.ts";

type ThemeButtonProps = {
    withActionIcon?: boolean;
    isLocal?: boolean;
    [key: string]: any;
};

function ThemeButton({withActionIcon = true, isLocal, ...rest}: ThemeButtonProps) {
    const {theme, toggleTheme} = ThemeController

    const Icon = theme === 'dark' ? IconMoonFilled : IconSunFilled;

    if (withActionIcon) {
        return (
            <ActionIcon
                variant='outline'
                onClick={() => toggleTheme(isLocal)}
                {...rest}
            >
                <Icon />
            </ActionIcon>
        );
    }

    return <Icon />
}

export default ThemeButton;