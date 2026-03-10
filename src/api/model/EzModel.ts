import _ from "lodash";
import u from "@/util";

const convertData = (
    value: any,
    type: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _key: any
): any => {
    const valueTypes: {
        [key: string]: (value: any) => any;
    } = {
        int: (value) => parseInt(String(value)),
        number: (value) => parseFloat(String(value)),
        boolean: (value) => !!value,
        string: (value) => value.toString(),
        object: (value) => (!value ? {} : { ...(value as object) }),
        array: (value) => (!value ? [] : [...(value as any[])]),
        json: (value) => (!value ? '' : JSON.parse(String(value))),
        phone: (value) => (!value ? '' : u.formatPhoneNumber(value)),
        money: (value) => (!value ? '' : (value/100).toString()),
    };

    try {
        return valueTypes[type](value);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null;
    }
};

interface FieldDefinition {
    name: string;
    type: string;
    render?: (value: any, row: Record<string, any>) => any;
    mapping?: string;
    instance?: typeof EzModel;
    filterable?: boolean;
}

interface EzModelConfig {
    fields: FieldDefinition[];
    data: Record<string, any>;
}

const _fields = new WeakMap<object, string[]>();

export default class EzModel {
    static suffix: string;
    static modelName: string;
    static instantiate: (dataToInstantiate: any) => EzModel[] | EzModel;
    static getPrimary?: (dataToGetPrimary: any) => any;

    [key: string]: any;

    constructor({ fields, data }: EzModelConfig) {
        if (!_fields.has(this)) {
            _fields.set(this, fields.filter(f => f.filterable).map(f => f.name));
        }

        try {
            for (const {name, type, render, mapping, instance} of fields) {
                const key = mapping ?? name;
                // check if the field is in the data to return only those fields
                // that way we can reuse the same model
                if (!Object.prototype.hasOwnProperty.call(data, key)) {
                    continue;
                }

                if (instance) {
                    if (typeof (instance as any).instantiate === "function") {
                        this[name] = (instance as any).instantiate(data[key]);
                    } else {
                        this[name] = new (instance as any)(data[key]);
                    }
                } else if (render) {
                    this[name] = render(data[key], data);
                } else {
                    this[name] = convertData(data[key], type, key);
                }

                data[name] = this[name];
            }
        } catch (e) {
            console.log(e)
        }

        EzModel.instantiate = function (dataToInstantiate: any): EzModel[] | EzModel {
            const me = this as typeof EzModel;
            if (!dataToInstantiate) return [];
            if (_.isArray(dataToInstantiate)) {
                return dataToInstantiate.map((instance: any) => new me(instance));
            }
            return new me(dataToInstantiate);
        };
    }

    get(field: string): any {
        return this[field];
    }

    getFields() {
        return _fields.get(this);
    }

    set(field: string | Record<string, any>, value?: any): void {
        if (typeof field === 'object' && field !== null) {
            for (const [key, val] of Object.entries(field)) {
                if (Object.prototype.hasOwnProperty.call(field, key)) {
                    this[key] = val;
                }
            }
        } else {
            this[field] = value;
        }
    }
}