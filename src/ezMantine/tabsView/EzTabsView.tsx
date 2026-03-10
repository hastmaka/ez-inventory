import classes from './EzTabsView.module.scss'
import {Flex, Tabs} from '@mantine/core';
import {IconSettings} from "@tabler/icons-react";
import {createElement, Suspense} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";
import type {Tab} from "@/types";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";

const iconStyle = {width: '1.5rem', height: '1.5rem'};

/**
 *
 * @param rootId
 * @param activeTab
 * @param setActiveTab
 * @param TABS
 * @param TABSPANEL
 * @returns {JSX.Element} - view to use in the tabs, ClientView, StaffView, etc...
 * @constructor
 */

type TabsViewProps = {
    rootId?: number,
    activeTab: string | Record<string, any>,
    setActiveTab: {
        (rootId: number, tab?: any): void;
        (value: any): void;
    },
    TABS: Tab[],
    scrollHeight: string,
    TABSPANEL: Record<string, any>,
    orientation?: "horizontal",
}

export default function EzTabsView({
    rootId,
    activeTab,
    setActiveTab,
    TABS,
    TABSPANEL,
    orientation,
    scrollHeight
}: TabsViewProps) {
    const value = rootId && typeof activeTab !== 'string' ? activeTab[rootId] : activeTab;
    const isHorizontal = orientation === 'horizontal';

    const tabItems = TABS.map((tab, index) => (
        <Tabs.Tab
            value={tab.view}
            key={index}
            p={8}
            leftSection={createElement(tab.icon ?? IconSettings, {style: iconStyle})}
            styles={{
                tabLabel: {textAlign: 'left'},
            }}
        >
            {tab.text}
        </Tabs.Tab>
    ));

    return (
        <Flex flex={1} gap={16} id='ez-tabs-view-container'>
            <Tabs
                flex={1}
                orientation={orientation ?? 'vertical'}
                value={value}
                variant="pills"
                color="var(--mantine-primary-color-9)"
                onChange={(value) => {
                    if (rootId) {
                        setActiveTab(rootId, value);
                    } else {
                        setActiveTab(value);
                    }
                }}
                classNames={{
                    root: classes[isHorizontal ? 'tab-root-horizontal' : 'tab-root'],
                    tab: classes['tab'],
                    ...(isHorizontal && {list: classes['tab-list-horizontal']}),
                }}
            >
                <Tabs.List miw={isHorizontal ? undefined : 190}>
                    {tabItems}
                </Tabs.List>

                <Tabs.Panel
                    value={value}
                    style={{
                        display: 'flex',
                        ...(isHorizontal && {minWidth: 0, overflow: 'hidden'}),
                    }}
                >
                    <Flex flex={1} miw={0}>
                        <Suspense fallback={<EzLoader h='calc(100vh - 200px)'/>}>
                            <EzScroll
                                h={scrollHeight}
                                flex={1}
                                scrollbars={isHorizontal ? 'x' : 'y'}
                            >
                                {createElement(TABSPANEL[value])}
                            </EzScroll>
                        </Suspense>
                    </Flex>
                </Tabs.Panel>
            </Tabs>
        </Flex>
    );
}
