import {SignalState} from "@/signals/SignalClass.ts";
import * as methods from "@/signals/signalTabClass/methods";
import type {TabItem} from "@/types";
import {LoginController} from "@/view/login/LoginController.ts";

/** when EzTabs is combined with EzViewTabs
 * childController - it's an array with all Controllers References from the View to update the recordId
 * childTabController - it's the reference to the (Wherever)ViewController
 *
 * EzTabs with different view
 * childController - it's the reference to the (Wherever)ViewController
 * childTabController - no need to provide this
 *
 * avoidDeepClone - here goes all keys you don't need to deepClone, because there are functions or references
 */

type FuncType = Record<string, (...args: any[]) => any>;
type PropsType = {
    avoidDeepClone?: string[];
    wasReloaded?: boolean;
    activeParentTab?: string;
    parentTabsList?: TabItem[];
    tempParentTabsList?: TabItem[];
    childController?: Array<Record<string, unknown>>;
    childTabController: any;
    keyId: string;
    label: string;
    model: { name: string, message?: string, modelName: string  };
    drawer?: {open: boolean };
    reference: {
        tempTab: string;
        activeTab: string;
    };
    [key: string]: any;
};

export class SignalTabClass extends SignalState<PropsType, FuncType> {
    constructor(props: PropsType, func?: FuncType) {
        if (!props.model) throw new Error("SignalTab: model is required");
        if (!props.keyId) throw new Error("SignalTab: keyId is required");
        if (!props.label) throw new Error("SignalTab: label is required");
        if (!props.reference) throw new Error("SignalTab: reference is required");

        const checkModel = props.model.modelName.toLowerCase()
        if (checkModel === "error") throw new Error(props.model.message);
        // if (!props.keyId.includes(checkModel) || !props.label.includes(checkModel)) {
        //     throw new Error("SignalTab: keyId and label must match the model name");
        // }

        if (import.meta.env.DEV && (!props.childController?.length || !Array.isArray(props.childController))) {
            console.warn("SignalTab: childController is empty or is not an array");
        }

        const {avoidDeepClone, ...rest} = props

        const _avoidDeepClone = avoidDeepClone && Array.isArray(avoidDeepClone)
            ? ['user', 'childController', ...avoidDeepClone]
            : ['user', 'childController']

        const defaultProps: PropsType = {
            user: LoginController.user,
            avoidDeepClone: _avoidDeepClone,
            wasReloaded: false,
            activeParentTab: "",
            parentTabsList: [],
            tempParentTabsList: [],
            childController: [],
            drawer: { open: false },
            ...rest,
        };


        super(defaultProps, func || {});
        this.addDefaultMethods();
    }

    addDefaultMethods() {
        for (const [key, method] of Object.entries(methods)) {
            if (!(key in this.signal)) {
                this.signal[key] = method.bind(this.signal);
            }
        }
    }
}