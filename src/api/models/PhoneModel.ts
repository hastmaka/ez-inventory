import EzModel from "../model/EzModel.ts";

export default class PhoneModel extends EzModel {
    static modelName = "phone";
	constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'phone_id', type: 'int'
            }, {
                name: 'phone_type', type: 'string',
            }, {
                name: 'phone_number', type: 'string',
            }, {
                name: 'phone_comment', type: 'string',
            }, {
                name: 'phone_primary', type: 'boolean',
            }, {
                name: 'phone_relation', type: 'string',
            }, {
                name: 'phone_ext', type: 'string',
            }, {
                name: 'caregiver_caregiver_id', type: 'string',
            }, {
                name: 'caregiver_relation', type: 'string',
            }],
            data
        });
	}
}