import {LoginController} from "@/view/login/LoginController.ts";
import {moduleDefinitions} from "@/routes/moduleDefinitions.ts";
import type {ModuleDefinition} from "@/types";

function filterByPermissions(
    defs: ModuleDefinition[],
    allowed: number[]
): ModuleDefinition[] {
    const has = (perm: number) => (perm ? allowed.includes(perm) : true);

    return defs.reduce<ModuleDefinition[]>((acc, item) => {
        const filteredChildren = item.children
            ? filterByPermissions(item.children as ModuleDefinition[], allowed)
            : undefined;

        const includeSelf = has(item.permission) || (filteredChildren && filteredChildren.length > 0);

        if (includeSelf) {
            const nextItem: ModuleDefinition = {
                ...item,
                ...(filteredChildren ? { children: filteredChildren } : {}),
            } as ModuleDefinition;
            acc.push(nextItem);
        }

        return acc;
    }, []);
}

export default function getModules() {
    const allowed = LoginController.userModules;
    return filterByPermissions(moduleDefinitions as ModuleDefinition[], allowed);
}