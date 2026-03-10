import {createElement, Suspense, useState} from 'react';
import {ActionIcon, Burger, Drawer, Group, Menu, Stack} from '@mantine/core';
import {IconSettings, IconX} from '@tabler/icons-react';

import EzLoader from '@/ezMantine/loader/EzLoader.tsx';
import EzScroll from '@/ezMantine/scroll/EzScroll.tsx';

import type {Tab} from '@/types';

import classes from './MobileTabsDrawer.module.scss';

const iconStyle = {width: '1.5rem', height: '1.5rem'};
const menuIconStyle = {width: '1.2rem', height: '1.2rem'};

type MobileTabsDrawerProps = {
    tabs: Tab[];
    tabsPanel: Record<string, any>;
    activeTab: string;
    setActiveTab: (value: string) => void;
    scrollHeight: string;
};

export function MobileTabsDrawer({
    tabs,
    tabsPanel,
    activeTab,
    setActiveTab,
    scrollHeight,
}: MobileTabsDrawerProps) {
    const [drawerOpened, setDrawerOpened] = useState(false);
    const activeTabObj = tabs.find(t => t.view === activeTab);

    return (
        <Stack flex={1}>
            <Group gap={8} className={classes['mobile-header']}>
                <Burger
                    opened={drawerOpened}
                    onClick={() => setDrawerOpened(o => !o)}
                    size="sm"
                />
                {activeTabObj && createElement(
                    activeTabObj.icon ?? IconSettings,
                    {style: iconStyle},
                )}
                <span style={{fontWeight: 600}}>
                    {activeTabObj?.text}
                </span>
            </Group>

            <Drawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                size="xs"
                withCloseButton={false}
                position="left"
            >
                <Group justify="flex-end" pt="xs">
                    <ActionIcon
                        variant='outline'
                        onClick={() => setDrawerOpened(false)}
                    >
                        <IconX size={24} />
                    </ActionIcon>
                </Group>
                <Menu>
                    <Stack gap={0} pt={16}>
                        {tabs.map((tab, index) => (
                            <Menu.Item
                                key={index}
                                leftSection={createElement(
                                    tab.icon ?? IconSettings,
                                    {style: menuIconStyle},
                                )}
                                className={
                                    tab.view === activeTab
                                        ? classes['menu-item-active']
                                        : undefined
                                }
                                onClick={() => {
                                    setActiveTab(tab.view);
                                    setDrawerOpened(false);
                                }}
                            >
                                {tab.text}
                            </Menu.Item>
                        ))}
                    </Stack>
                </Menu>
            </Drawer>

            <Suspense fallback={<EzLoader h="calc(100dvh - 200px)" />}>
                <EzScroll h={scrollHeight}>
                    {createElement(tabsPanel[activeTab])}
                </EzScroll>
            </Suspense>
        </Stack>
    );
}
