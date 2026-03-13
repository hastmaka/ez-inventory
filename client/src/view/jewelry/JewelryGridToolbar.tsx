import ToolBar from "@/ezMantine/mantineDataGrid/toolbar/ToolBar.tsx";
import {Drawer, Group, Skeleton, Table} from "@mantine/core";
import EzSearchInput from "@/ezMantine/searchInput/EzSearchInput.tsx";
import {lazy, Suspense, useEffect, useMemo, useState} from "react";
import {IconCirclePlus, IconFileExport, IconHistory} from "@tabler/icons-react";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {JewelryModalController} from "./_modal/JewelryModalController.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {useDisclosure} from "@mantine/hooks";
// dynamic import
const AddEditProduct =
    lazy(() => import('./_modal/AddEditProduct'))
const ExportToCsv =
    lazy(() => import('./_modal/ExportToCsv.tsx'))
const GenerateQr =
    lazy(() => import('./_modal/GenerateQR.tsx'))
const  ExportHistory =
    lazy(() => import('./_modal/ExportHistory.tsx'))

export default function JewelryGridToolbar({
    state
}: {
    state: any;
}) {
    const {resetState} = JewelryModalController
    const [opened, { open, close }] = useDisclosure(false);
    const [metalPrices, setMetalPrices] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!opened) return;
        setIsLoading(true);
        FetchApi('v1/metal-prices').then((response) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {capturedAt, ...rest} = response.data
            if (response.success) setMetalPrices(rest);
        }).catch(() => {
            window.toast.E('Failed to fetch metal prices');
        }).finally(() => {
            setIsLoading(false);
        });
    }, [opened]);

    function handleExportHistory() {
        const modalId = 'export-history-modal';
        window.openModal({
            modalId,
            title: "Export History",
            size: '80%',
            children: (
                <Suspense fallback={<EzLoader h='400'/>}>
                    <ExportHistory/>
                </Suspense>
            ),
            onClose: resetState
        })
    }

    function handleExport() {
        const modalId = 'export-to-modal';
        window.openModal({
            modalId,
            title: "Export To CSV",
            size: '600px',
            children: (
                <Suspense fallback={<EzLoader h='400'/>}>
                    <ExportToCsv modalId={modalId}/>
                </Suspense>
            ),
            onClose: resetState
        })
    }

    function handleAddProduct() {
        const modalId = "add-product-modal"

        // const a = JewelryModalController
        // debugger
        window.openModal({
            modalId,
            title: "Add Product",
            fullScreen: true,
            children: (
                <Suspense fallback={<EzLoader h={400}/>}>
                    <AddEditProduct modalId={modalId}/>
                </Suspense>
            ),
            onClose: resetState
        })
    }

    async function handleAddProductFromPhone() {
        const modalId = 'qr-to-phone';

        window.openModal({
            modalId,
            title: "Add Product from Phone",
            size: 'sm',
            children: (
                <Suspense fallback={<EzLoader h={300}/>}>
                    <GenerateQr/>
                </Suspense>
            ),
            onClose: () => {
            }
        })
    }

    const ACTIONBTNS =
        useMemo(() => [
            {
                icon: IconHistory,
                label: "Export History",
                onClick: handleExportHistory
            },
            {
                icon: IconFileExport,
                label: "Export",
                onClick: handleExport
            },
            {
                icon: IconCirclePlus,
                label: 'Add Product',
                onClick: handleAddProduct
            },
            {
                icon: IconCirclePlus,
                label: 'Add Product From Phone',
                onClick: handleAddProductFromPhone
            },
            {
                icon: IconCirclePlus,
                label: 'Metals Price',
                onClick: open
            }
        ], [])

    return (
        <ToolBar>
            <Group justify='space-between' flex={1}>
                <EzSearchInput state={state} name='search' size='sm'/>
                <EzGroupBtn ITEMS={ACTIONBTNS} size='sm'/>
            </Group>

            <Drawer
                opened={opened}
                onClose={close}
                position='right'
                title='Metales Price'
            >
                {isLoading ? (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Metal</Table.Th>
                                <Table.Th>Ounce</Table.Th>
                                <Table.Th>Gram</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {[0, 1].map((i) => (
                                <Table.Tr key={i}>
                                    <Table.Td><Skeleton h={16} w={50}/></Table.Td>
                                    <Table.Td><Skeleton h={16} w={60}/></Table.Td>
                                    <Table.Td><Skeleton h={16} w={50}/></Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                ) : (
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Metal</Table.Th>
                                <Table.Th>Ounce</Table.Th>
                                <Table.Th>Gram</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {metalPrices && Object.entries(metalPrices).map(([metal, prices]: [string, any]) => {
                                return (
                                    <Table.Tr key={metal}>
                                        <Table.Td>
                                            {metal.charAt(0).toUpperCase() + metal.slice(1)}
                                        </Table.Td>
                                        <Table.Td>${prices.ounce.toFixed(2)}</Table.Td>
                                        <Table.Td>${prices.gram.toFixed(2)}</Table.Td>
                                    </Table.Tr>
                                )
                            })}
                        </Table.Tbody>
                    </Table>
                )}
            </Drawer>
        </ToolBar>
    )
}