import {Collapse} from '@mantine/core';
import { deepSignal } from 'deepsignal/react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SideBarNavItem } from "@/types";
import NavbarLink from "./NavbarLink.tsx";
import {AppController} from "@/AppController.ts";

const signal = deepSignal({
    currentView: {
        parent: '',
        child: null as string | null,
    },
});

function normalizePath(p: string): string {
    return (p || '')
        .replace(/^\/?app\/?/, '')
        .replace(/^\/+|\/+$/g, '');
}

function buildChildPath(parent: string, child: string): string {
    const p = normalizePath(parent);
    const c = normalizePath(child);
    if (c.startsWith(`${p}/`) || c === p) return c;         // already prefixed
    return `${p}/${c}`;                                      // join parent/child
}

export function EzSideNavItem(item: SideBarNavItem) {
    const {burger} = AppController
    const { icon: Icon, children, path, label } = item;
    const location = useLocation();
    const navigate = useNavigate();

    const hasChildren = Array.isArray(children) && children.length > 0;

    const activePath = normalizePath(location.pathname);
    const parentPath = normalizePath(path);

    const hasActiveChild = activePath.startsWith(`${parentPath}/`);
    const isParentActive = activePath === parentPath;
    const isParentOpen =
        signal.currentView.parent === parentPath || isParentActive || hasActiveChild;

    const handleParentClick = () => {
        if (hasChildren) {
            signal.currentView.parent = isParentOpen ? '' : parentPath;
            signal.currentView.child = null;
        } else {
            signal.currentView = { parent: parentPath, child: null };
            navigate(`/app/${parentPath}`);
        }
    };

    const handleChildClick = (childPath: string) => {
        const dest = buildChildPath(parentPath, childPath);
        signal.currentView = { parent: parentPath, child: dest };
        navigate(`/app/${dest}`);
    };

    return (
        <>
            <NavbarLink
                icon={Icon}
                label={label}
                opened={isParentOpen}
                onClick={handleParentClick}
                hasLinks={hasChildren}
                active={isParentActive}
            />

            {hasChildren && (
                <Collapse in={isParentOpen}>
                    <div
                        style={{
                            marginLeft: burger.opened ? 0 : 16,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        {children.map((child) => {
                            const childFull = buildChildPath(parentPath, child.path);
                            const isChildActive = activePath === childFull;
                            return (
                                <NavbarLink
                                    key={child.path}
                                    icon={child.icon}
                                    label={child.label}
                                    opened={false}
                                    onClick={() => handleChildClick(child.path)}
                                    hasLinks={false}
                                    active={isChildActive}
                                />
                            );
                        })}
                    </div>
                </Collapse>
            )}
        </>
    );
}