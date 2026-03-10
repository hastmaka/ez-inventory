import EzModel from "../model/EzModel.ts";

export default class ProjectModel extends EzModel {
    static modelName = "project";

    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'project_id', type: 'int'
            }, {
                name: 'project_name', type: 'string'
            }, {
                name: 'project_type', type: 'string'
            }, {
                name: 'project_status', type: 'string'
            }, {
                name: 'project_value', type: 'number'
            }, {
                name: 'project_metadata', type: 'object'
            }, {
                name: 'project_priority', type: 'string'
            }, {
                name: 'assigned_to', type: 'int'
            }, {
                name: 'assigned_user', type: 'object'
            }, {
                name: 'stage', type: 'object'
            }, {
                name: 'client', type: 'object'
            }, {
                name: 'client_client_id', type: 'int'
            }, {
                name: 'pipeline_stage_stage_id',
                type: 'int',
                render: (_val: any, row: Record<string, any>) => {
                    if (row.stage?.stage_id) {
                        return {
                            label: row.stage.stage_name,
                            value: String(row.stage.stage_id),
                        };
                    }
                    return null;
                },
            }, {
                name: 'start_date', type: 'string'
            }, {
                name: 'end_date', type: 'string'
            }, {
                name: 'interactions', type: 'array'
            }, {
                name: 'documents', type: 'array'
            }, {
                name: 'reDetail', type: 'object'
            }, {
                name: 'created_at', type: 'string'
            }],
            data
        });
    }
}
