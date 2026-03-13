import EzModel from "../model/EzModel.ts";

export default class DocumentModel extends EzModel {
    static modelName = "document";

    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'document_id', type: 'int'
            }, {
                name: 'candidate_candidate_id', type: 'int'
            }, {
                name: 'select_document_type', type: 'object', mapping: 'document_type_option',
                render: (_value, row) => {
                    if (!row.document_type_option) return null
                    return {
                        label: row.document_type_option?.asset_option_name || '',
                        value: String(row.document_type)
                    };
                }
            }, {
                name: 'document_name', type: 'string'
            }, {
                name: 'document_url', type: 'string'
            }, {
                name: 'document_expiration', type: 'string'
            }, {
                name: 'document_note', type: 'string'
            }, {
                name: 'document_type_option', type: 'object'
            }, {
                name: 'created_at', type: 'string'
            }],
            data
        });
    }
}
