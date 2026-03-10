import EzModel from "../model/EzModel.ts";

export default class AssetOptionModel extends EzModel {
    static modelName = "assetOption";
    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'asset_asset_id', type: 'int'
            }, {
                name: 'asset_option_id', type: 'int'
            }, {
                name: 'asset_option_name', type: 'string',
            }],
            data
        });
    }
}