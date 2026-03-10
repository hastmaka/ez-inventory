import {updateSessionStore} from "@/util/updateLocalStore.ts";
import type {TabItem} from "@/types";
import _ from "lodash";

export async function setParentTabsList(
    this: any,
    row: any,
) {
    // check max tabs
    if (
        this.tempParentTabsList.length === 8 && _.isObject(row) && !_.isEmpty(row) &&
        !this.tempParentTabsList.some((t: {label: string, value: string}) => +t.value === +row.client_id) &&
        !this.wasReloaded
    ) {
        return window.toast.W(`Max tabs 8 reached. Please close some tab to create a new one.`)
    }

    if (row === "grid") {
        this.activeParentTab = row;
        updateSessionStore(this.reference["activeTab"], row);
    } else {
        let recordId: string | number | undefined;
        let clientName: string | undefined;
        const tempParentTabsList = this.tempParentTabsList as TabItem[];
        const keyId = this.keyId;
        const label = this.label;
        const model = this.model;
        const tabId = row instanceof model ? row.get(keyId).toString() : row;
        const item = tempParentTabsList.find((tab) => +tab.value === +tabId);

        if (this.wasReloaded && tempParentTabsList.length > 0) {
            recordId = item?.value;
            clientName = item?.label;
        } else {
            recordId = typeof item === "object" ? item?.value : row.get(keyId).toString();
            clientName = typeof item === "object" ? item?.label : row.get(label);
        }

        const activeIds = this.tempParentTabsList.map((i: TabItem) => i.value);
        const isNot = !activeIds.includes(recordId);

        if (isNot) {
            this.tempParentTabsList = [
                ...this.tempParentTabsList,
                { label: clientName!, value: recordId! },
            ];
        }

        updateSessionStore(this.reference.tempTab, this.tempParentTabsList);
        updateSessionStore(this.reference.activeTab, recordId);
        this.activeParentTab = recordId as string;
        this.wasReloaded = false;

        this.childTabController?.setActiveTab(recordId!);

        if (this.childController?.length > 0) {
            this.childController.forEach((child: any) => ((child as any).recordId = recordId));
        }
    }
}