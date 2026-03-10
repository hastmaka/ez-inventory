import {IconHome2} from "@tabler/icons-react";

export type SideBarNavItem = {
    icon: typeof IconHome2;
    label: string;
    path: string;
    permission: number;
    children?: SideBarNavItem[];
}