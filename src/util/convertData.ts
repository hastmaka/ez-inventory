import {AppController} from "@/AppController.ts";
// import {normalizedData} from "@/util/normalizedData.ts";
// import type {Stores} from "@/types";
import type {OptionLike} from "@/types/stores";
import {hasRequiredKeys} from "@/util/hasRequiredKeys.ts";

export const valueToLabel = (
    storeName: any,
    value: string | number
): string | number => {
    let store = AppController.getStore(storeName) as OptionLike[] | undefined;
    if (!store) {
        console.warn(`Store ${storeName} not found. Please check AppController.ts`);
        return value;
    }

    const hasKeys = hasRequiredKeys(store);

    const result = store.find((item) => {
        if (hasKeys && "value" in item) {
            return String(item.value) === String(value);
        }
        if (!hasKeys && "asset_option_id" in item) {
            return String(item.asset_option_id) === String(value);
        }
        return false;
    });

    if (!result) {
        console.warn(`Value ${value} not found in store ${storeName}. Returning raw value.`);
        return value;
    }

    return hasKeys
        ? ("label" in result ? result.label ?? value : value)
        : ("asset_option_name" in result ? result.asset_option_name ?? value : value);
};