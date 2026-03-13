import { Menu } from "@mantine/core";
import _ from "lodash";
import type { MenuItemProps, MenuProps, SubMenuProps } from "@/types";
import EzActionIcon from "@/ezMantine/actionIcon/EzActionIcon.tsx";
import { useEffect, useState } from "react";
import { FetchApi } from "@/api/FetchApi.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import { AppController } from "@/AppController.ts";

function EzMenu({ target, ITEMS, onItemClick, size, tooltip, url, iterator, custom, ...rest }: MenuProps) {
    if ((!ITEMS || !ITEMS.length) && !url) {
        throw Error("Provide either ITEMS array or a URL.");
    }

    const initialStore = (!ITEMS || !ITEMS.length) ? AppController.getStore(url!) : ITEMS;
    const [data, setData] = useState(initialStore);
    const [loading, setLoading] = useState(!ITEMS);

    // Load from URL if no ITEMS passed
    const fetchData = async () => {
        setLoading(true);

        const cached = AppController.getStore(url!);
        if (!cached) {
            const asset: any = await FetchApi(url!);
            const newData = asset.data.map((item: any) => ({
                label: iterator ? item?.[iterator.label] : item.asset_option_name,
                value: iterator ? item[iterator.value] : item.asset_option_code,
            }));

            setData(newData);
            setLoading(false);

            AppController.checkIfStoreExist(url, newData);
        } else {
            setData(cached);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ITEMS) {
            setData(ITEMS);
            setLoading(false);
        }
    }, [ITEMS]);

    const menuItem = (item: MenuItemProps) => (
        <Menu.Item
            key={item.label}
            onClick={() => {
                onItemClick?.(item);
                item.onClick?.();
            }}
            leftSection={item.icon || null}
        >
            {item.label}
        </Menu.Item>
    );

    return (
        <Menu
            withArrow
            {...rest}
            onChange={async () => {
                if (loading && url) await fetchData();
            }}
        >
            <Menu.Target>
                {tooltip ? (
                    <EzActionIcon.Tooltip label={tooltip}>{target}</EzActionIcon.Tooltip>
                ) : custom ? (
                    target
                ) : (
                    <EzActionIcon size={size}>{target}</EzActionIcon>
                )}
            </Menu.Target>

            <Menu.Dropdown>
                {loading ? (
                    <EzLoader h={40} size={20} />
                ) : (
                    data?.map((item: MenuItemProps) => {
                        if (item.sub_menu && _.isArray(item.sub_menu) && item.sub_menu.length > 0) {
                            return (
                                <Menu.Sub key={item.label}>
                                    <Menu.Sub.Target>
                                        <Menu.Sub.Item>{item.label}</Menu.Sub.Item>
                                    </Menu.Sub.Target>

                                    <Menu.Sub.Dropdown>
                                        {item.sub_menu.map((sub: SubMenuProps) => menuItem(sub))}
                                    </Menu.Sub.Dropdown>
                                </Menu.Sub>
                            );
                        }

                        return menuItem(item);
                    })
                )}
            </Menu.Dropdown>
        </Menu>
    );
}

export default EzMenu;