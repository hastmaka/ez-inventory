import {LoadingOverlay} from "@mantine/core";

function EzLoadingOverlayModal({visible}: {visible: boolean}) {
    return (
        <LoadingOverlay
            zIndex={1200}
            mt={60}
            visible={visible}
            loaderProps={{ color: 'blue', type: 'bars' }}
        />
    )
}

function EzLoadingOverlayForm({visible}: {visible: boolean}) {
    return (
        <LoadingOverlay
            visible={visible}
            loaderProps={{ color: 'blue', type: 'bars' }}
        />
    )
}

const EzLoadingOverlay = {
    modal: EzLoadingOverlayModal,
    form: EzLoadingOverlayForm
}

export default EzLoadingOverlay