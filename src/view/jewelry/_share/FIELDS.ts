// src/view/jewelry/_fromPhone/formFields.ts
import type { FormField } from "@/types";

/**
 * Returns the base product fields, dynamically built from dependencies.
 * @param tagLength number of tags currently in formData['product']?.product_tag
 */
export function getProductFields(tagLength: number = 0): FormField[] {
    return [
        {
            name: "product_title",
            label: "Title",
            required: true,
        },
        {
            name: "product_color",
            label: "Color",
        },
        {
            name: "product_weight_g",
            label: "Weight",
            type: "number",
            rightSection: "oz",
            required: true,
        },
        {
            name: "product_height",
            label: "Height",
            type: "number",
            rightSection: "in",
            required: true,
        },
        {
            name: "product_width",
            label: "Width",
            type: "number",
            rightSection: "in",
            required: true,
        },
        {
            name: "product_length",
            label: "Length",
            type: "number",
            rightSection: "in",
            required: true,
        },
        {
            name: "product_tag",
            label: `Tags (${tagLength})`,
            type: "multi-select-free-local",
            options: ["gift for her"],
            required: true,
        },
    ];
}

export function getProductSelect(disabled?: boolean): FormField[] {
    return [
        {
            label: 'Material',
            name: 'product_material',
            type: 'select',
            fieldProps: {
                searchable: true,
                clearable: disabled,
                url: 'v1/asset/product_material',
                iterator: {label: 'asset_option_name', value: 'asset_option_id'},
            },
            required: true,
            disabled,
        },
        {
            label: 'Type',
            type: 'select',
            name: 'product_type',
            fieldProps: {
                searchable: true,
                clearable: disabled,
                url: 'v1/asset/product_type',
                iterator: {label: 'asset_option_name', value: 'asset_option_id'},
            },
            required: true,
            disabled
        },
        {
            label: 'Gem',
            name: 'product_gem_type',
            type: 'select',
            fieldProps: {
                searchable: true,
                clearable: disabled,
                url: 'v1/asset/product_gem_type',
                iterator: {label: 'asset_option_name', value: 'asset_option_id'},
            },
            disabled,
        },
        {
            label: 'Labour',
            name: 'product_crafting_price',
            type: 'number',
            leftSection: '$',
            decimalScale: 2,
            fixedDecimalScale: true,
            disabled,
        },
    ]
}