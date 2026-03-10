import {updateSessionStore} from "@/util/updateLocalStore.ts";
import type {TabItem} from "@/types";

export function closeTab(
    this: any,
    id: string | number,
) {
    if (this.activeParentTab === id) {
        this.activeParentTab = "grid";
        updateSessionStore(this.reference.activeTab, "grid");
    }

    const tempTabs = this.tempParentTabsList as TabItem[];
    const filteredTabs = tempTabs.filter((item) => item.value !== id);
    const activeTab = this.childTabController?.activeTab ?? {};
    const arrActiveIds = filteredTabs.map((item) => item.value);

    this.tempParentTabsList = filteredTabs;

    if (this.childTabController) {
        this.childTabController.activeTab = Object.keys(activeTab)
            .filter((key) => arrActiveIds.includes(key))
            .reduce((result: Record<string, unknown>, key) => {
                result[key] = activeTab[key];
                return result;
            }, {});
    }

    updateSessionStore(this.reference.tempTab, this.tempParentTabsList);
}
