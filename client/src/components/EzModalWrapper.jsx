import PropTypes from "prop-types";
import {ScrollArea, Stack} from "@mantine/core";
import SaveCancelBtns from "@/component/SaveCanceBtns.jsx";

export default function EzModalWrapper({h, handleSave, handleCancel, children}) {
    if (!h) throw new Error('EzModalWrapper: height prop is required')
    return (
        <Stack>
            <ScrollArea.Autosize
                // h={`calc(100vh - ${h}px)`}
                // mah={h}
                offsetScrollbars
                type='hover'
            >
                {children}
            </ScrollArea.Autosize>

            {handleSave && handleCancel && <SaveCancelBtns
                handleCancel={handleCancel}
                handleSave={handleSave}
            />}
        </Stack>
    )
}

EzModalWrapper.propTypes = {
    children: PropTypes.node,
    handleSave: PropTypes.func,
    handleCancel: PropTypes.func,
    h: PropTypes.number
}
