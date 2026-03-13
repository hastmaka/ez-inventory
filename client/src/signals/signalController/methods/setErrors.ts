import _ from 'lodash';

export type ErrorTuple = [type: string, name: string, msg: string];

/**
 * @param type - Either a string (error group/type) or an array of tuples [type, name, message].
 * @param name - Field name to apply the error (only if `type` is a string).
 * @param msg - Error message (only if `type` is a string).
 * @param isLocal - When is a local check we need to return to prevent log error in the console
 * @returns Always throws, but return type is boolean for typing.
 */

export function setErrors(
    this: any,
    type: string | ErrorTuple[],
    name?: string,
    msg?: string,
    isLocal?: boolean
): void {
    if (_.isArray(type)) {
        (type as ErrorTuple[]).forEach(([t, n, m]) => {
            _.set(this.errors, [t, n], m);
        });
    } else if (name && msg) {
        _.set(this.errors, [type, name], msg);
    }

    const error = new Error(msg) as any;
    error.field = type;
    error.success = false
    if (isLocal) {
        return error;
    }
    throw error;
}