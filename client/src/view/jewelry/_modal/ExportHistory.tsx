import {Image, Stack} from "@mantine/core";
import EzTable from "@/ezMantine/table/EzTable.tsx";
import {useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import moment from "moment";
import {JewelryModalController} from "@/view/jewelry/_modal/JewelryModalController.ts";
import {ActionIconsToolTip} from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import {IconFileDescription, IconFileExport} from "@tabler/icons-react";
import EzButton from "@/ezMantine/button/EzButton.tsx";

export default function ExportHistory() {
    const {
        exportHistoryGetData,
        exportHistoryData,
        exportHistoryLoading,
        handleExport,
        seeProductLoading,
        seeProductGetData,
        seeProductData,
        goingBack
    } = JewelryModalController

    useLayoutEffect(() => {exportHistoryGetData().then()}, [])

    const head = ['Date', 'Platform', 'Products', 'Actions']
    const seeHead = ['Picture', 'Title', 'Material']

    const seeTdMap = [
        {
            name: 'product_image_url',
            render: (row: any) => {
                const image = row.product_image_url.find((i: any) => i.document_primary)
                return (
                    <Image
                        src={image.document_url}
                        maw={80}
                        width={30}
                        height='auto'
                        // onHover
                    />
                )
            }
        },
        'product_title',
        'product_material'
    ]
    const tdMap = [
        {
            name: 'created_at',
            render: (row: any) => {
                return moment(row.created_at).format('DD-MM-YYYY');
            }
        },
        'export_log_platform',
        {
            name: 'export_log_product_id',
            render: (row: any) => {
                return row.export_log_product_id.length
            }
        },
        {
            name: 'actions',
            render: (row: any) => {
                return (
                    <ActionIconsToolTip
                        ITEMS={[{
                            icon: (
                                <IconFileExport
                                    onClick={async () => {
                                        return window.toast.U({
                                            modalId: 'export-history-modal',
                                            id: {
                                                title: 'Exporting',
                                                message: 'Please wait...'
                                            },
                                            update: {
                                                success: 'Product exported successfully',
                                                error: 'Something went wrong, contact Admin'
                                            },
                                            cb: () => handleExport(
                                                row.export_log_platform,
                                                row.export_log_product_id
                                            )
                                        })
                                    }}
                                />
                            ),
                            tooltip: 'Re-Export'
                        }, {
                            icon: (
                                <IconFileDescription
                                    onClick={async () => {
                                        return window.toast.U({
                                            modalId: 'see-product-modal',
                                            id: {
                                                title: 'Fetching',
                                                message: 'Please wait...'
                                            },
                                            update: {
                                                success: 'List of products',
                                                error: 'Something went wrong, contact Admin'
                                            },
                                            cb: () => {
                                                seeProductGetData(
                                                    row.export_log_product_id,
                                                    row.export_log_platform,
                                                    row.created_at
                                                ).then()
                                            }
                                        })
                                    }}
                                />
                            ),
                            tooltip: 'See Products'
                        }]}
                        justify='center'
                    />
                )
            }
        }
    ]

    if (exportHistoryLoading) return <EzLoader h={600}/>

    return (
        <Stack>
            {!seeProductLoading && <EzButton onClick={goingBack}>Back</EzButton>}
            <EzTable
                head={!seeProductLoading ? seeHead : head}
                tdMap={!seeProductLoading ? seeTdMap : tdMap}
                data={!seeProductLoading ? seeProductData : exportHistoryData}
                height={800}
                dataKey={!seeProductLoading ? 'product_id': 'export_log_id'}
            />
        </Stack>
    );
}