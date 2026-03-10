import EzModel from "../model/EzModel.ts";

export default class UserModel extends EzModel {
    static modelName = "user";

    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: "user_id", type: "int"
            }, {
                name: 'user_type', type: 'string'
            },{
                name: 'user_first_name', type: 'string'
            }, {
                name: 'user_last_name', type: 'string'
            }, {
                name: 'user_email', type: 'string'
            }, {
                name: 'user_uid', type: 'string'
            }, {
                name: 'user_full_name', type: 'string'
            }, {
                name: 'user_verified', type: 'string'
            }, {
                name: 'user_preference', type: 'json'
            }, {
                name: 'permissions', type: 'array'
            }, {
                name: 'user_role', type: 'string'
            }, {
                name: 'company_company_id', type: 'int'
            }, {
                name: 'company', type: 'object'
            }, {
                name: 'role', type: 'object'
            }],
            data,
        });
    }
}