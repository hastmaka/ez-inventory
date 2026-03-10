import _ from "lodash";
import {IconMenu} from "@tabler/icons-react";
import {ActionIcon, Group, Menu} from "@mantine/core";
import { DEFAULT_THEME } from '@mantine/core';
import {ThemeController} from "@/theme/ThemeController.ts";
import classes from './Menu.module.scss';
import type {ReactNode} from "react";
import withAccess from "@/access/Access.tsx";

interface ColorButtonMenuProps {
    ITEMS: string[],
    target?: ReactNode,
    [key: string]: any
}

function ColorButtonMenu({target, ITEMS, ...rest}: ColorButtonMenuProps) {
    const {primaryColor} = ThemeController
    return (
        <Menu
            position='bottom-end'
            classNames={{
                item: classes['color-button']
            }}
            {...rest}
        >
            <Menu.Target>
                <ActionIcon variant='outline' size={26}>{target || <IconMenu/>}</ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                {ITEMS.map((color: string) => {
                    const c = color === 'dark' ? 'black' : color === 'grape' ? '#862e9c' : color
                    return (
                        <Menu.Item
                            key={color}
                            color={c}
                            bg={color === primaryColor ? '#00000010' : 'transparent'}
                            onClick={() => {
                                ThemeController.setPrimaryColor(color)
                            }}
                            style={{['--item-hover-bg-color' as string]: DEFAULT_THEME.colors[color][1]}}
                        >
                            <Group>
                                <div
                                    style={{
                                        backgroundColor: c,
                                        width: 20,
                                        height: 20,
                                        borderRadius: 4
                                    }}
                                />
                                {_.startCase(color)}
                            </Group>
                        </Menu.Item>
                    )
                })}
            </Menu.Dropdown>
        </Menu>
    );
}

ColorButtonMenu.displayName = 'ColorButtonMenu';

const ColorButtonMenuWithAccess = withAccess(ColorButtonMenu);

export {ColorButtonMenu};
export default ColorButtonMenuWithAccess;