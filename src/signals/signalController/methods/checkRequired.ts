import _ from 'lodash';
import type {FormField} from "@/types";

export function checkRequired(
    this: any,
    type: string,
    fields: FormField[]
): boolean {
    _.each(fields, (field: FormField) => {
        const value = this.formData?.[type]?.[field.name];

        if (field.required && (_.isArray(value) ? !(value.length > 0) : !value)) {
            this.setErrors(type, field.name, 'This field is required', true);
        }

        if (field.fieldProps?.type === 'email' && value) {
            const checkEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
            if (!checkEmail.test(value)) {
                this.setErrors(type, field.name, 'Invalid email: example@example.com', true);
            }
        }
    });

    return _.isEmpty(this.errors?.[type]);
}