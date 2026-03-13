import _ from "lodash";

export function hasRequiredKeys(data: any[]) {
    return _.every(data, (item: any) =>
        _.has(item, 'value') && _.has(item, 'label'));
}