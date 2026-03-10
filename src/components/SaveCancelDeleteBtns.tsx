import EzButton from "@/ezMantine/button/EzButton.tsx";
import {Flex} from "@mantine/core";

interface SaveCancelBtnsProps {
    /** self*/
    cancel?: () => void,
    accept?: () => void,
    _delete?: () => void,
    label?: {
        accept?: string,
        cancel?: string,
        _delete?: string,
    },
    acceptProps?: Record<string, any>,
    cancelProps?: Record<string, any>,
    _deleteProps?: Record<string, any>,
    /** */
    withScroll?: boolean,
}

/**
 * SaveCancelBtns component
 *
 * Renders two action buttons: **Cancel** (red) and **Accept** (teal).
 * - Useful in modals, forms, and dialogs where you need to confirm or discard changes.
 * - Supports optional labels for each button.
 * - Can be fixed at the bottom of the screen with `withScroll`.
 *
 * Example:
 * ```tsx
 * <SaveCancelBtns
 *   cancel={() => console.log("Canceled")}
 *   accept={() => console.log("Accepted")}
 *   _delete={() => void}
 *   label={{ cancel: "Close", accept: "Save" }}
 *   withScroll
 * />
 * ```
 */

export default function SaveCancelDeleteBtns({
    cancel,
    accept,
    _delete,
    label,
    acceptProps,
    cancelProps,
    _deleteProps,
    withScroll = false,
}: SaveCancelBtnsProps) {
    function deleteBtn(){
        return (
            <EzButton
                color='gray.7'
                onClick={_delete}
                variant='filled'
                {..._deleteProps}
            >{label?._delete || 'Delete'}</EzButton>
        )
    }
    function cancelBtn(){
        return (<EzButton
            color='red.7'
            onClick={cancel}
            variant='filled'
            {...cancelProps}
        >{label?.cancel || 'Cancel'}</EzButton>)
    }
    function acceptBtn(){
        return (
            <EzButton
                color='teal.7'
                onClick={accept}
                variant='filled'
                {...acceptProps}
            >{label?.accept || 'Accept'}</EzButton>
        )
    }
    function render(){
        if (_delete) {
            return (
                <>
                    {deleteBtn()}
                    <Flex gap={16}>
                        {cancelBtn()}
                        {acceptBtn()}
                    </Flex>
                </>
            )
        }

        return (
            <>
                {cancel && cancelBtn()}
                {accept && acceptBtn()}
            </>
        )
    }

    return (
        <Flex
            justify={_delete ? 'space-between' : 'flex-end'}
            gap={16}
            p='.5rem'
            // p='.8rem 1rem 0 1rem'
            style={{
                borderTop: `1px solid var(--mantine-color-default-border)`,
            }}
            {...(withScroll && {
                pos: 'fixed',
                style: {
                    borderTop: `1px solid var(--mantine-color-default-border)`,
                    bottom: 0, left: 0, right: 0,
                    minHeight: '60px',
                    padding: '.8rem 1rem 0 1rem'
                }
            })}

        >
            {render()}
        </Flex>
    )
}
