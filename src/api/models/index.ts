import AssetModel from './AssetModel.ts';
import AssetOptionModel from './AssetOptionModel.ts';
import UserModel from './UserModel.ts';
import NotificationModel from './NotificationModel.ts';
import DocumentModel from './DocumentModel.ts';
import PhoneModel from './PhoneModel.ts';
import ClientModel from './ClientModel.ts';
import ProjectModel from './ProjectModel.ts';
import InteractionModel from './InteractionModel.ts';
import PipelineStageModel from './PipelineStageModel.ts';
import ProductModel from './ProductModel.ts';
// TODO: WhatsApp - future implementation
// import WhatsAppMessageModel from './WhatsAppMessageModel.ts';

const models = {
	asset: AssetModel,
	assetOption: AssetOptionModel,
	user: UserModel,
	notification: NotificationModel,
	document: DocumentModel,
	phone: PhoneModel,
	client: ClientModel,
	project: ProjectModel,
	interaction: InteractionModel,
	pipelineStage: PipelineStageModel,
	product: ProductModel,
	// whatsappMessage: WhatsAppMessageModel,
} as const;

type ModelName = keyof typeof models;

export const getModel =
	(name: ModelName) => {
		return models[name];
	};
