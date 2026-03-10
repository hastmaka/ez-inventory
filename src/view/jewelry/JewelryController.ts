import {SignalGridClass} from "@/signals/signalGridClass/SignalGridClass.ts";
import {getModel} from "@/api/models";
import type {Filter, GridStore} from "@/types";
import type {SignalType} from "@/signals/SignalClass.ts";

export const JewelryController: SignalType<any, any> =
    new SignalGridClass({
        store: {
            model: {
                main: getModel('product'),
            },
            filterFields: {} as Record<string, Filter>,
            limit: 20,
            api: {
                read: `v1/product`,
                create: 'client',
                update: 'client',
                delete: 'client'
            }
        } as GridStore,
    },{

    }).signal