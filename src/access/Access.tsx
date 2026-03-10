import _ from "lodash";
import type {Permission} from "@/types";
import {type ComponentType, memo, useMemo} from 'react';
import {LoginController} from "@/view/login/LoginController.ts";

function createFilterItemsMemo() {
    const cache = new WeakMap<any, Map<string, any[]>>();

    return function memoized(items: any[], allowed: Set<string>): any[] {
        const allowedKey = [...allowed].sort().join(',');
        let itemCache = cache.get(items);

        if (!itemCache) {
            itemCache = new Map();
            cache.set(items, itemCache);
        }

        if (itemCache.has(allowedKey)) {
            return itemCache.get(allowedKey)!;
        }

        const result = items
            .filter(item => !item.permission || allowed.has(String(item.permission)))
            .map(item => ({
                ...item,
                sub_menu: _.isArray(item.sub_menu) && item.sub_menu.length > 0
                    ? memoized(item.sub_menu, allowed)
                    : undefined
            }));

        itemCache.set(allowedKey, result);
        return result;
    };
}

const filterItems = createFilterItemsMemo();

/**
 * ITEMS - array of default items to be filtered depending on user permissions or hardCode values
 * hardCode - number[] there are some cases that hard code values are needed, just pass it here
 */

interface WithAccessProps {
    ITEMS: any[];
    hardCode?: number[];
    [key: string]: any
}

function withAccess<P extends WithAccessProps>(WrappedComponent: ComponentType<P>) {
    const AccessControlledComponent = memo((props: P) => {
        const { user } = LoginController;
        const { /*hardCode,*/ ITEMS, ...restProps } = props;

        // const allowedTypes = useMemo(() => {
        //     return hardCode
        //         ? new Set(hardCode)
        //         : new Set(user.permissions?.map((p: Permission) => p.permission_type));
        // }, [hardCode, user.permissions]);

        const allowedTypes: Set<string> = useMemo(() => {
            return new Set(user.role.permissions?.map((p: Permission) => String(p.permission_id)))
        }, [user.role.permissions])

        const filteredItems = useMemo(() => {
            return _.isArray(ITEMS) && ITEMS.length > 0
                ? filterItems(ITEMS, allowedTypes)
                : [];
        }, [ITEMS, allowedTypes]);

        return <WrappedComponent {...({ ...restProps, ITEMS: filteredItems } as P)} />;
    });

    AccessControlledComponent.displayName = `withAccess(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return AccessControlledComponent;
}

export default withAccess;