import _ from "lodash";

/**
 * Update an obj values depend on data and fields provided
 * only adding the values that are not null | undefined
 * @param field
 * @param data
 */

export function updateFormData(
    field: any,
    data: Record<string, any>
): Record<string, any> {
    const tmp: Record<string, any> = {};
    _.each(field, (key: string) => {
        if (!_.isNil(data[key])) {   // _.isNil checks for null or undefined
            tmp[key] = data[key];
        }
    });
    return tmp;
}