import EzModel from "../model/EzModel.ts";

export default class InteractionModel extends EzModel {
    static modelName = "interaction";

    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'interaction_id', type: 'int'
            }, {
                name: 'interaction_type', type: 'string'
            }, {
                name: 'content', type: 'string'
            }, {
                name: 'priority', type: 'string'
            }, {
                name: 'is_completed', type: 'boolean'
            }, {
                name: 'due_date', type: 'string'
            }, {
                name: 'client_client_id', type: 'int'
            }, {
                name: 'project_project_id', type: 'int'
            }, {
                name: 'created_by', type: 'int'
            }, {
                name: 'creator', type: 'object'
            }, {
                name: 'client', type: 'object'
            }, {
                name: 'project', type: 'object'
            }, {
                name: 'created_at', type: 'string'
            }],
            data
        });
    }
}
