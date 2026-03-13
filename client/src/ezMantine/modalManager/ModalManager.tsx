import {FocusTrap, Modal} from "@mantine/core";
import classes from './Modal.module.scss';
import toast from "../toast/toast.tsx";
import {useLayoutEffect, useState} from "react";
import EzLoadingOverlay from "../loadingOverlay/EzLoadingOverlay.tsx";
import {deepSignal} from "deepsignal/react";
import type {ModalProps} from "@/types/global";

type Signal = {
    loading: { [key: string]: boolean };
    opened: { [key: string]: boolean };
    activeModalId: string | null
};

const signal = deepSignal<Signal>({
    loading: {},
    opened: {},
    activeModalId: null,
})

export default function ModalManager() {
    const [modals, setModals] = useState<ModalProps[]>([])

    function openModal (modal: ModalProps) {
        if (!modal.modalId) throw new Error('modalId is required')
        setModals(prev => {
            //check if modal already exists
            if (prev.find(m => m.modalId === modal.modalId)) {
                throw new Error(`Modal with id ${modal.modalId} already exists`)
            }
            return [...prev, modal]
        });
        setTimeout(() => {
            signal.opened[modal.modalId] = true
            // mark as active
            signal.activeModalId = modal.modalId;
        }, 10); // slight delay to trigger transition
    }
    function closeModal (modalId: string) {
        //animate out then safe remove the modal
        signal.opened[modalId] = false
        setTimeout(() => {
            setModals(prev => prev.filter(modal => modal.modalId !== modalId))
            signal.loading[modalId] = false

            // passing the focus to the prev modal
            if (signal.activeModalId === modalId) {
                // fallback to last opened
                const last = [...modals].filter(m => m.modalId !== modalId).at(-1);
                signal.activeModalId = last?.modalId ?? null;
            }
        }, 200)
    }
    function modalIsLoading (modalId: string) {
        signal.loading[modalId] = true
    }

    //when make an operation in place and don't need to close the modal just update the loading state
    function modalIsDone (modalId: string) {
        signal.loading[modalId] = false
    }

    function updateModal(modalId: string, modal: Record<string, any>) {
        setModals((prev) =>
            prev.map((m) => (m.modalId === modalId ? { ...m, ...modal } : m))
        );
    }

    useLayoutEffect(() => {
        (window as any).openModal = openModal;
        (window as any).closeModal = closeModal;
        (window as any).modalIsLoading = modalIsLoading;
        (window as any).modalIsDone = modalIsDone;
        (window as any).updateModal = updateModal;
        (window as any).toast = toast;
    }, []);

    return modals.map(({children, modalId, onClose, ...rest}: ModalProps, index) => {
        if (!onClose || typeof onClose !== 'function') throw new Error('onClose is required and must be a function')
        const isActive = signal.activeModalId === modalId;
        return <Modal
            key={index}
            opened={signal.opened[modalId]}
            onClose={() => {
                closeModal(modalId)
                if (onClose) onClose()
            }}
            closeOnClickOutside={false}
            closeOnEscape={isActive}   // only active modal closes on ESC
            trapFocus={isActive}       // only active modal traps focus
            centered={true}
            // keepMounted={true}
            size='50%'
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            withinPortal={false}
            classNames={{
                header: classes.header,
                content: !rest?.fullScreen ? classes.content : classes['content-full'],
                close: classes.close,
                body: !rest?.fullScreen ? classes.body : classes['body-full'],
            }}
            {...rest}
        >
            <FocusTrap.InitialFocus />
            {signal.loading?.[modalId] && <EzLoadingOverlay.modal visible={signal.loading[modalId]} />}
            {children}
        </Modal>
    })
}

ModalManager.propTypes = {}
