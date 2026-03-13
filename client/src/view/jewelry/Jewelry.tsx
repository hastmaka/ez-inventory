import {useLayoutEffect} from 'react';
import {Stack} from '@mantine/core';
import {DataTable} from '@/ezMantine/DataTable.tsx';
import EzText from '@/ezMantine/text/EzText.tsx';
import {JewelryController} from './JewelryController.ts';
import JewelryGridToolbar from './JewelryGridToolbar.tsx';
import JewelryGridActions from './JewelryGridActions.tsx';
import ImageOnHover from '@/view/jewelry/_share/ImageOnHover.tsx';
import u from '@/util';

const columns = [
    {
        accessorKey: 'product_image',
        header: 'Product Image',
        cell: ({row}: {row: any}) => {
            const image = row.original.product_image_url.find((i: any) => i.document_primary);
            return <ImageOnHover image={image}/>;
        },
        size: 140
    },
    {
        accessorKey: 'product_title',
        header: 'Title',
    },
    {
        accessorKey: 'product_sku',
        header: 'SKU',
        size: 90,
    },
    {
        accessorKey: 'product_price',
        header: 'Price',
        size: 70,
        cell: ({row}: {row: any}) => {
            return u.formatMoney(row.product_price);
        },
    },
    {
        accessorKey: 'product_quantity',
        header: 'Quantity',
        size: 70,
    },
    {
        accessorKey: 'product_material',
        header: 'Material',
    },
    {
        accessorKey: 'product_weight_g',
        header: 'Weight',
        size: 140,
        cell: (cell: any) => {
            const grams = cell.getValue();
            return (
                <Stack gap={8}>
                    <EzText size='12px'>{u.gramsToOz(grams)} oz</EzText>
                    <EzText size='10px' c='dimmed'>{grams} g</EzText>
                </Stack>
            );
        },
    },
    {
        accessorKey: 'product_height',
        header: 'Height',
        size: 100,
        cell: (cell: any) => {
            return `${cell.getValue()} in`;
        },
    },
    {
        accessorKey: 'product_width',
        header: 'Width',
        size: 100,
        cell: (cell: any) => {
            return `${cell.getValue()} in`;
        },
    },
    {
        accessorKey: 'product_length',
        header: 'Length',
        size: 100,
        cell: (cell: any) => {
            return `${cell.getValue()} in`;
        },
    },
];

export default function Jewelry() {
    const {fetchData} = JewelryController;
    useLayoutEffect(() => {fetchData().then();}, [fetchData]);

    return (
        <DataTable
            state={{...JewelryController, columns}}
            rowId="product_id"
            toolbar={<JewelryGridToolbar state={{...JewelryController}}/>}
            actions={{comp: JewelryGridActions, itemCount: 2}}
            withRowSelection
        />
    );
}
