import _ from 'lodash'
/**
 * @param obj1 - base obj with the default values
 * @param obj2 - obj with the dirty values
 * @param exclude - fields you don't want to check
 */

export function checkFormValues(
    this: any,
    obj1: Record<string, any>,
    obj2: Record<string, any>,
    exclude: string[] = []
) {
    const differences: Record<string, any> = {};

    const clean1 = _.cloneDeep(obj1);
    const clean2 = _.cloneDeep(obj2);

    for (const key of Object.keys(clean2)) {
        if (exclude.includes(key)) continue;
        if (!_.isEqual(clean1[key], clean2[key])) {
            differences[key] = clean2[key];
        }
    }

    return {
        differences,
        isDifferent: Object.keys(differences).length > 0,
    };
}