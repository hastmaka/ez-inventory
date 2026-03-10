import PropTypes from "prop-types";
import {LoadingOverlay} from "@mantine/core";

export default function EzLoading({loading}) {
    return (
        <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
            loaderProps={{ color: 'teal', type: 'bars', size: 'xs' }}
        />
    )
}

EzLoading.propTypes = {
    loading: PropTypes.bool
}
