import {lazy} from "react";
import type {ModuleDefinition} from "@/types";
import {IconGauge, IconDiamond} from "@tabler/icons-react";

export const moduleDefinitions: ModuleDefinition[] = [
    {
        path: 'dashboard',
        label: 'Dashboard',
        icon: IconGauge,
        component: lazy(() => import("@/view/dashboard/Dashboard.tsx")),
        permission: 1,
    },
    {
        path: 'jewelry',
        label: 'Jewelry Test',
        icon: IconDiamond,
        component: lazy(() => import('@/view/jewelry/Jewelry')),
        permission: 100,
    },
];