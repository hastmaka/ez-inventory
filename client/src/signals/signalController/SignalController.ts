import {SignalState} from "../SignalClass.ts";
import * as methods from './methods';
import {LoginController} from "@/view/login/LoginController.ts";

/**
 * All whereverData and whereverLoading is created from the GetData method:
 * example:
 * whereverGetData() -> remember wrapped in a setTimeout to simulate the server response
 * will create
 * whereverData: []
 * whereverLoading: false
 * @param recordId
 * this is the id we are going to use to fetch the data from the server, and to identify the every tab
 * @param method
 * resetState(): SignalState created a deep copy from the prop object to reset the state to its initial state
 * @param mode
 * can call this class with mode === 'create' to avoid the check for GetData methods and use it as a regular
 * state controller, to handle formData, errors, etc.
 * @param manualReset
 * there are some cases, when I will need to reset the state manually for wherever reason, so I'm going to pass
 * a manualReset array, having all the keys, I want to reset myself, so those keys will be ignored on "reset"
 */

type BaseFuncType = Record<string, (...args: any[]) => any>;
export type BasePropsType = {
    recordId?: string | number | null;
    modal?: {
        loading: boolean;
        state: string;
    };
    manualReset?: string[];
    formState?: string;
    formData?: { [key: string]: any | { [key: string]: any }};
    dirtyFields?: Record<string, any>,
    errors?: Record<string, Record<string, string>>;
    mode?: 'create' | '';
    editMap?: Partial<Record<
        string,
        | (() => Promise<void>)                           // allow no-arg functions
        | ((id: number) => Promise<void>)
        | ((fields: string[], id: number, who?: any, ...args: any) => Promise<void>)
    >>;
    [key: string]: any;
};

export class SignalController<
    P extends Record<string, any> = BasePropsType,
    M extends Record<string, (...args: any[]) => any> = BaseFuncType
> extends SignalState<P, M> {
    constructor(
        props: P,
        func: M,
        // subscribe
    ) {
        if (!props || !func) throw new Error('SignalController requires props and func arguments');
        const defaults = {
            user: LoginController.user,
            avoidDeepClone: ['user', 'reloadViewValues'],
            recordId: null,
            modal: {loading: false, state: 'create'},
            formState: 'create',
            formData: {},
            dirtyFields: {},
            errors: {},
            reloadViewValues: {loadingKeys: [],dataMethods: []}
        };

        // Dynamically add data/loading keys before super()
        for (const key in func) {
            if (key.includes('GetData')) {
                const dataKey = key.replace('Get', '');
                const loadingKey = key.replace('GetData', 'Loading');
                (defaults as any)[dataKey] = [];
                (defaults as any)[loadingKey] = true;

                (defaults as any).reloadViewValues.loadingKeys.push(loadingKey);
                (defaults as any).reloadViewValues.dataMethods.push(func[key]);
            }
        }

        const defaultProps: P = {
            ...defaults,
            ...props,
        };

        const defaultFunc: M = {
            ...methods,
            ...func
        };

        super(defaultProps, defaultFunc, /*subscribe*/);
    }
}