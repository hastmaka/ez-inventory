import EzModel from "../model/EzModel.ts";

export default class AssetModel extends EzModel {
    static modelName = "asset";
    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'asset_id', type: 'int'
            }, {
                name: 'asset_code', type: 'string',
            }, {
                name: 'asset_name', type: 'string',
            }, {
                name: 'asset_options', type: 'array',
            }],
            data
        });
    }
}