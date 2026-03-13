import EzModel from "../model/EzModel.ts";

export default class PipelineStageModel extends EzModel {
    static modelName = "pipelineStage";

    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'stage_id', type: 'int'
            }, {
                name: 'stage_name', type: 'string'
            }, {
                name: 'stage_order', type: 'int'
            }, {
                name: 'stage_color', type: 'string'
            }, {
                name: 'is_final', type: 'boolean'
            }],
            data
        });
    }
}
