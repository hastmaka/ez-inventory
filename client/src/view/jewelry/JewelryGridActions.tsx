import { lazy, Suspense, useMemo} from 'react';
import {IconPencil} from "@tabler/icons-react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {ActionIconsToolTip} from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import {JewelryModalController} from "./_modal/JewelryModalController.ts";
// dynamic imports
const AddEditProduct =
    lazy(() => import('./_modal/AddEditProductTabs.tsx'))

function JewelryGridActions({/*state,*/ row}: { state: any, row: any }) {
    const {resetState} = JewelryModalController

    function handleEditClient(e: any) {
        e.stopPropagation()
        const modalId = "edit-product-modal"
        window.openModal({
            modalId,
            title: "Edit Product",
            fullScreen: true,
            children: (
                <Suspense fallback={<EzLoader h={400}/>}>
                    <AddEditProduct id={row.product_id} modalId={modalId}/>
                </Suspense>
            ),
            onClose: resetState
        })
    }

    const ITEMS = useMemo(() => [
        {
            icon: <IconPencil onClick={handleEditClient}/>,
            tooltip: 'Edit',
            permission_name: 'product_grid_edit',
        }
    ], [])

    return <ActionIconsToolTip ITEMS={ITEMS} size={30}/>
}

export default JewelryGridActions;