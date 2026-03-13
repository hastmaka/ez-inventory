import {IconHome2} from "@tabler/icons-react";

export type ModuleDefinition = {
    path: string,
    label: string,
    icon: typeof IconHome2;
    component?: any,
    permission: number,
    children?: ModuleDefinition[]
};