import {SignalState} from "@/signals/SignalClass.ts";
import * as methods from "@/signals/signalGridClass/methods";
import {LoginController} from "@/view/login/LoginController.ts";

type FuncType = Record<string, (...args: any[]) => any>;
type PropsType = {
    loading?: boolean;
    confirmRowToDelete?: string;
    data?: {
        list: any[],
        total: number
    };
    rowSelection?: Record<number, boolean>;
    pagination?: {
        pageIndex: number,
        pageSize: number
    };
    businessData?: Record<string, any>;
    isSearching?: boolean;
    isEditing?: boolean;
    [key: string]: any;
};

export class SignalGridClass extends SignalState<PropsType, FuncType> {
    constructor(
        props: PropsType,
        func: FuncType,
    ) {
        const defaultProps: PropsType = {
            // statusBar: false,
            // loadingForm: false,
            user: LoginController.user,
            avoidDeepClone: ['user'],
            loading: true,
            isSearching: false,
            confirmRowToDelete: '',
            data: {list: [], total: 0},
            rowSelection: {},
            pagination: {pageIndex: 0, pageSize: props.store.limit < 10 ? 10 : props.store.limit},
            businessData: {},
            isEditing: false,
        }
        super({...defaultProps, ...props}, func);
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