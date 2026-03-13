import EzModel from "../model/EzModel.ts";

export default class ClientModel extends EzModel {
    static modelName = "client";

    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'client_id', type: 'int'
            }, {
                name: 'client_name', type: 'string'
            }, {
                name: 'client_last_name', type: 'string'
            }, {
                name: 'full_name', type: 'string', mapping: 'client_name',
                render: (_, row) => {
                    const first = row.client_name || '';
                    const last = row.client_last_name || '';
                    return `${first} ${last}`;
                }
            }, {
                name: 'client_full_name', type: 'string'
            }, {
                name: 'client_email', type: 'string'
            }, {
                name: 'client_phone', type: 'string'
            }, {
                name: 'client_active', type: 'boolean'
            }, {
                name: 'client_status', type: 'string'
            }, {
                name: 'client_source', type: 'string'
            }, {
                name: 'client_tags', type: 'array'
            }, {
                name: 'client_custom_fields', type: 'object'
            }, {
                name: 'client_company', type: 'string'
            }, {
                name: 'client_address', type: 'string'
            }, {
                name: 'client_assigned_to', type: 'int'
            }, {
                name: 'assigned_user', type: 'object'
            }, {
                name: 'projects', type: 'array'
            }, {
                name: 'interactions', type: 'array'
            }, {
                name: 'documents', type: 'array'
            }, {
                name: 'created_at', type: 'string'
            }],
            data
        });
    }
}
