// import { FetchApi } from "@/api/FetchApi.ts";
import type {/*OptionLike,*/ Stores} from "@/types";
import { SignalState } from "@/signals/SignalClass.ts";
// import {getModel} from "@/api/models";
import _ from "lodash";
// import {LoginController} from "@/view/login/LoginController.ts";

export const AppController =
    new SignalState({
        burger: { opened: true },
        stores: {} as Stores,
        storeLoading: true,
    }, {
        storeGetData: async function(this: any) {
            // const res = await FetchApi('v1/asset');
            // const stores: Record<string, OptionLike[]> = {};
            // // this.stores = res.data.map((asset: Option) => new (getModel('asset'))(asset));
            // for (const [index, value] of Object.entries(res.data)) {
            //     (stores as any)[index] = (value as OptionLike[]).map((option: OptionLike) =>
            //         new (getModel('assetOption'))(option))
            // }
            // this.stores = stores as unknown as Stores;
            // console.log(res.data);

            /** here we have to model the User*/
            // LoginController.setUser((new (getModel('user'))(LoginController.user)))

            this.storeLoading = false;
        },
        getStore: function(this: any, store: string) {
            const segment: boolean = store.split('/').length > 1;
            const fullStoreKey = segment ? store : `v1/asset/${store}`;
            const storeData = this.stores[fullStoreKey];
            if (!storeData || !Array.isArray(storeData)) return null;
            return storeData
        },
        checkIfStoreExist: function(this: any, storeName, newStore) {
            if (!_.has(this.stores, storeName)) {
                this.stores[storeName as string] = newStore;
            } else if (!_.isEqual(this.stores[storeName as string], newStore)) {
                this.stores[storeName as string] = newStore;
            }
        },
        valueToLabel: function(this: any, store: string, value: string) {
            if (!value) return null;
            const option = this.getStore(store).find((i: any)=> +i.value === +value);
            return option ? option.label : null;
        },
        labelToValue: function(this: any, store: string, label: string) {
            if (!label) return null;
            const option = this.getStore(store).find((i: any)=> i.label === label);
            return option ? option.value : null;
        },
        toggleNav: function(this: any) {
            this.burger.opened = !this.burger.opened;
        }
    }).signal;