import _ from 'lodash';

export function populateForm(
    this: any,
    type: string,
    fields: string[],
    data: Record<string, any>
) {
    const temp: Record<string, any> = {}
    _.each(fields, (key: string) => {
        if (!_.isNil(data[key])) {   // _.isNil checks for null or undefined
            temp[key] = data[key];
        }
    });

    const ids: Record<string, any> = {}
    Object.entries(data).forEach(([key, value]) => {
        // Include _id fields that are valid numbers (not NaN)
        if (/_id/.test(key) && typeof value === 'number' && !isNaN(value)) {
            ids[key] = value;
        }
    });

    const formDataWithIds = {...temp, ...ids}
    this.formData![type] = formDataWithIds
    // Include IDs in formDataCopy so they're excluded from dirty comparison
    this['formDataCopy'] = _.cloneDeep(formDataWithIds.toJSON?.() || formDataWithIds);
    this.isFormDirty = false
    if (import.meta.env.DEV) console.log(this.formData![type])
}