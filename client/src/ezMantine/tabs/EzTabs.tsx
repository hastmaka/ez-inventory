import classes from './EzTabs.module.scss'
import {ActionIcon, Drawer, Tabs, Tooltip} from "@mantine/core";
import {IconHome2, IconX} from "@tabler/icons-react";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import {type ElementType, type JSX, Suspense, useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.jsx";

interface EzTabsProps {
    signal: any;
    Grid: ElementType;
    View: ElementType;
    actionBtns?: { icon: typeof IconHome2; label?: string, onClick?: () => void }[];
}

/**
 * EzTabs component renders a tabbed interface with dynamic parent tabs, temporary tabs, action buttons, and a side drawer.
 * @param signal
 - activeParentTab: currently active parent tab value.
 - parentTabsList: array of main parent tabs.
 - tempParentTabsList: array of temporary tabs.
 - closeTab: function to close a tab.
 - setParentTabsList: function to set the active parent tab.
 - wasReloaded: boolean indicating if the component was reloaded.
 - drawer: object controlling the drawer state.
 - closeDrawer: function to close the drawer.
 * @param Grid
 - Grid component use in the first render
 * @param View
 - Component to use as Edit view, or second view
 * @param actionBtns
 */

export default function EzTabs({signal, Grid, View, actionBtns}: EzTabsProps): JSX.Element {
    const {
        wasReloaded,
        activeParentTab,
        parentTabsList,
        tempParentTabsList,
        closeTab,
        setParentTabsList,
        drawer,
        closeDrawer,
    } = signal;

    useLayoutEffect(() => {
        if (wasReloaded) setParentTabsList(activeParentTab).then();
    }, [wasReloaded]);

    if (wasReloaded && activeParentTab !== 'grid') return <EzLoader h='100vh'/>

    return (
        <>
            <div
                style={{
                    // padding: '1rem 0 1rem 1rem',
                    display: 'flex',
                    overflow: 'hidden',
                    flex: 1,
                }}
            >
                <Tabs
                    variant="outline"
                    value={activeParentTab}
                    classNames={{
                        root: classes['tabs-root'],
                        list: classes['tabs-list'],
                    }}
                >
                    <Tabs.List>
                        {[...parentTabsList, ...tempParentTabsList].map(({label, value}, index) =>
                            <Tabs.Tab
                                value={value}
                                key={index}
                                onClick={() => setParentTabsList(value)}
                                className={classes['tabs-tab']}
                                pr={index === 0 ? '1rem' : '.5rem'}
                                mah='36px'
                                {...(value !== 'grid') && {
                                    rightSection: (
                                        <Tooltip label='Close'>
                                            <ActionIcon
                                                variant="default"
                                                size="xs"
                                                radius="xl"
                                                aria-label="Close"
                                                component='span'
                                                autoContrast
                                                className={classes.close}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    closeTab(value)
                                                }}
                                            >
                                                <IconX style={{width: '100%', height: '100%'}} stroke={1.5}/>
                                            </ActionIcon>
                                        </Tooltip>
                                    )
                                }}
                            >
                                {label}
                            </Tabs.Tab>
                        )}
                    </Tabs.List>

                    {actionBtns && actionBtns.length > 0 &&
                        <EzGroupBtn
                            className={classes['action-btns']}
                            ITEMS={actionBtns}
                            // style={{'--actions-btns-right': activeParentTab === 'grid' ? '1rem' : '1rem'}}
                        />
                    }

                    <Tabs.Panel
                        value={activeParentTab}
                        className={classes['tabs-panel']}
                    >
                        <div
                            className={classes['container']}
                            style={{
                                ['--grid-container-padding' as string]: activeParentTab === 'grid' ? '1rem' : '0',
                            }}
                        >
                            <Suspense fallback={<EzLoader h='100vh'/>}>
                                {activeParentTab === 'grid'
                                    ? <Grid/>
                                    : <View/>
                                }
                            </Suspense>
                        </div>
                    </Tabs.Panel>
                </Tabs>
            </div>

            <Drawer
                opened={drawer.open}
                onClose={closeDrawer}
                title="Logs"
                offset={8}
                radius="md"
                position='right'
                size='lg'
            >
                <span>notes</span>
            </Drawer>
        </>
    );
}