import {Stack} from "@mantine/core";
import GenericModal from "@/components/modal/GenericModal.tsx";
import {JewelryController} from "@/view/jewelry/JewelryController.ts";
import {JewelryModalController} from "./JewelryModalController.ts";
import EzText from "@/ezMantine/text/EzText.tsx";
import PlatformExporter, {type PlatformExporterProps} from "./PlatformExporter.tsx";
import {useMemo} from "react";

export default function ExportToCsv({modalId}: {modalId: string}) {
    const {rowSelection} = JewelryController
    const {handleExport, resetState, platformGeneratorLoader} = JewelryModalController

    async function handleExportToCsv(platform: string) {
        if (!rowSelection || Object.keys(rowSelection).length === 0) {
            return window.toast.E('Some product have to be selected in order to export.')
        }
        handleExport(platform)
    }

    const PLATFORM: PlatformExporterProps[] = useMemo(() => [
        {
            src: '/platformIcon/whatnot.svg',
            platName: 'Whatnot 12% Fee',
            config: () => {},
            generate: () => handleExportToCsv('whatnot'),
            loading: platformGeneratorLoader.whatnot
        },
        // {
        //     src: '/platformIcon/etsy.png',
        //     platName: 'Etsy 10% Fee',
        //     config: () => {},
        //     generate: () => handleExportToCsv('etsy'),
        //     loading: platformGeneratorLoader.etsy
        // },
        // {
        //     src: '/platformIcon/shopify.png',
        //     platName: 'Shopify',
        //     config: () => {},
        //     generate: () => handleExportToCsv('shopify'),
        //     loading: platformGeneratorLoader.shopify
        // }
    ], [
        platformGeneratorLoader.whatnot,
        platformGeneratorLoader.shopify,
        platformGeneratorLoader.etsy,
    ])

    return (
        <GenericModal
            cancel={() => {
                resetState()
                window.closeModal(modalId)
            }}
        >

            <Stack p={8}>
                <Stack gap={0}>
                    <EzText>Platforms</EzText>
                    <EzText size='12px' c='gray.6'>
                        Because every platform is different in the way of handle data.
                    </EzText>
                </Stack>

                {PLATFORM.map(platform =>
                    <PlatformExporter key={platform.platName} {...platform}/>
                )}
            </Stack>
        </GenericModal>
    );
}