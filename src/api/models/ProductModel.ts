import EzModel from "../model/EzModel.ts";

export default class ProductModel extends EzModel {
    static modelName = "caregiver";
	constructor(data: Record<string, any>) {
        super({
            fields: [
                { name: 'product_id', type: 'int' },
                { name: 'product_title', type: 'string' },
                { name: 'product_description', type: 'string' },
                { name: 'product_price', type: 'int' },
                { name: 'product_quantity', type: 'int' },
                { name: 'product_color', type: 'string' },
                { name: 'product_weight_g', type: 'number' },
                { name: 'product_tag', type: 'array' },
                { name: 'product_image_url', type: 'array' },
                { name: 'product_condition', type: 'int' },
                { name: 'created_at', type: 'string' },
                { name: 'updated_at', type: 'string' },
                { name: 'deleted_at', type: 'string' },
                { name: 'product_height', type: 'number' },
                { name: 'product_width', type: 'number' },
                { name: 'product_length', type: 'number' },
                { name: 'company_company_id', type: 'int' },
                { name: 'product_finish', type: 'string' },
                { name: 'product_style', type: 'string' },
                { name: 'product_close_method', type: 'string' },
                { name: 'product_gem_type', type: 'string' },
                { name: 'product_gem_color', type: 'string' },
                { name: 'product_gem_found_count', type: 'int' },
                { name: 'product_type', type: 'string' },
                { name: 'product_material', type: 'string' },
                { name: 'product_category', type: 'int' },
                { name: 'is_whatnot', type: 'int' },
                { name: 'is_etsy', type: 'int' },
                { name: 'is_shopify', type: 'int' },
                { name: 'product_crafting_price', type: 'string' },
            ],
            data,
        });
	}
}