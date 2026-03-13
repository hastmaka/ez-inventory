import EzModel from '../model/EzModel.ts';

export default class NotificationModel extends EzModel {
    static modelName = 'notification';

    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: 'notification_id', type: 'int',
            }, {
                name: 'user_user_id', type: 'int',
            }, {
                name: 'notification_title', type: 'string',
            }, {
                name: 'notification_message', type: 'string',
            }, {
                name: 'notification_type', type: 'string',
            }, {
                name: 'notification_status', type: 'string',
            }, {
                name: 'notification_read_at', type: 'string',
            }, {
                name: 'created_at', type: 'string',
            }],
            data, suffix: 'notification', requiresPrimary: false,
        });
    }
}
