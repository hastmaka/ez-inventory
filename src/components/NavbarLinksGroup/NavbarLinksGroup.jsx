import { UnstyledButton, Group, Box, Collapse, Text, rem} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './NavbarLinksGroup.module.css';
import {mainController} from "@/view/main/MainController.js";
import PropTypes from "prop-types";
import {deepSignal} from "deepsignal/react";

const signal = deepSignal({
    currentView: {
        parentName: ['dashboard'],
        childName: null
    },
    setCurrentView(name, childName, hasLinks) {
        let parentName = signal.currentView.parentName[0];

        if (parentName !== name && !childName) {
            if (hasLinks) {
                if (signal.currentView.parentName[1] === name && signal.currentView.parentName[1]) {
                    return signal.currentView = {
                        parentName: [parentName],
                        childName: null
                    }
                }
                return signal.currentView = {
                    parentName: [parentName, name],
                    childName: null
                }
            }
            signal.currentView = {
                parentName: [name],
                childName: null
            }
        }

        if (childName) {
            signal.currentView = {
                parentName: [name],
                childName: childName
            }
        }
    }
})

export function LinksGroup({ icon: Icon, label, initiallyOpened, links, name }) {
    const {activeView, setView} = mainController
    const hasLinks = links && Object.keys(links).length > 0;
    let opened = signal.currentView.parentName.includes(name);

    if (links) {
        let parent = signal.currentView.parentName;
        if (parent[0] === 'dashboard' && parent.length === 1) {
            let tempOpened;

            Object.entries(links).forEach(([key, childValue]) => {
                if (childValue.name === activeView) {
                    tempOpened = true;
                }
            })
            if (tempOpened) {
                signal.setCurrentView(name, activeView, hasLinks)
            }
        }
    }

    return (
        <>
            <UnstyledButton
                onClick={() => {
                    signal.setCurrentView(name, null, hasLinks);

                    if(!hasLinks) {
                        setView(name);
                    }
                }}
                className={`${classes.control} ${activeView === name && !hasLinks && classes.active}`}
            >
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon style={{ width: '1rem', height: '1rem' }} />
                        <Box ml="md">{label}</Box>
                    </Box>
                    {hasLinks && (
                        <IconChevronRight
                            className={classes.chevron}
                            stroke={1.5}
                            style={{
                                width: rem(16),
                                height: rem(16),
                                transform: opened ? 'rotate(-90deg)' : 'none',
                            }}
                        />
                    )}
                </Group>
            </UnstyledButton>
            {hasLinks ? <Collapse in={opened}>
                {
                    Object.entries(links).map(([key, childValue]) => {
                        return (
                            <Text
                                component="a"
                                className={`${classes.link} ${activeView === childValue.name && classes.active}`}
                                href={childValue.link}
                                key={key}
                                onClick={() => {
                                    signal.setCurrentView(name, childValue.name, hasLinks )
                                    setView(childValue.name)
                                }}
                            >
                                {childValue.label}
                            </Text>
                        )
                    })
                }
            </Collapse> : null}
        </>
    );
}

LinksGroup.proptypes = {
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    links: PropTypes.objectOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })
    ).isRequired,
    value: PropTypes.string.isRequired
}