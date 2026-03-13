import _ from 'lodash';
import {gramsToOz} from './weightConversion.ts';

// Helper: derive shipping profile by weight (expects ounces)
function getShippingProfile(weight: number): string {
    if (!weight) return '0-1 oz';
    if (weight <= 1) return '0-1 oz';
    if (weight <= 3) return '1-3 oz';
    if (weight <= 7) return '4-7 oz';
    if (weight <= 11) return '8-11 oz';
    if (weight <= 15) return '12-15 oz';
    return '16+ oz';
}

// Platform transformers
const platformTransformers: Record<string, (data: any[]) => any[]> = {
    generic: data => data,

    whatnot: products =>
        _.map(products, (p: any) => {
            let images: string[] = [];

            try {
                const parsed = Array.isArray(p.product_image_url)
                    ? p.product_image_url
                    : JSON.parse(p.product_image_url || '[]');

                images = parsed.map((img: any) => {
                    if (typeof img === 'string') return img;
                    if (img.document_url) return img.document_url;
                    return '';
                }).filter(Boolean);
            } catch {
                images = [];
            }

            const imageFields = Object.fromEntries(
                images.slice(0, 8).map((url, i) => [`Image URL ${i + 1}`, url])
            );

            return {
                Category: 'Home & Garden',
                'Sub Category': 'Home Decor',
                Title: p.product_title,
                Description: p.product_description,
                Quantity: p.product_quantity || 1,
                Type: 'Buy it Now',
                Price: p.product_price ?? '',
                'Shipping Profile': getShippingProfile(gramsToOz(p.product_weight_g)),
                Offerable: 'TRUE',
                Hazmat: 'Not Hazmat',
                Condition: 'New without box',
                'Cost Per Item': p.product_price ?? '',
                SKU: `SKU-${p.product_id}`,
                ...imageFields
            };
        })
}

export function exportCSV(data: any, filename: string, platform: string) {
    if (!_.isArray(data) || _.isEmpty(data)) return;

    // ✅ Select the correct transformer
    const transformer = platformTransformers[platform] || platformTransformers.generic;
    const transformedData = transformer(data);

    // ✅ Build CSV from transformed data
    const headers = _.uniq(_.flatMap(transformedData, _.keys));

    const escape = (val: any) => {
        if (_.isNil(val)) return '';
        const str = String(val).replace(/"/g, '""');
        return /[",\n]/.test(str) ? `"${str}"` : str;
    };

    const rows = _.map(transformedData, (obj: any) =>
        _.map(headers, (h: any) => escape(obj[h])).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');

    // Trigger download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}