import type {FormFieldProps} from "@/types/form-field-props";

export type FormField = {
    name: string;
    type?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    description?: string;
    options?: string[] | Record<string, any>[];
    fieldProps?: FormFieldProps;
    value?: any;
    [key: string]: any
}