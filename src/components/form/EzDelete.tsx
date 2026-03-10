import {lazy, Suspense} from 'react';
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
const GenericModal =
    lazy(() => import("@/components/modal/GenericModal.tsx"))

type EzDeleteProps = {
    modalId: string;
    title?: string;
    text?: string;
    description?: string;
    handleDelete: () => Promise<void>;
}

export function EzDelete(props: EzDeleteProps) {
    const modalId = props.modalId;
    window.openModal({
        size: 'sm',
        modalId,
        title: props.title || 'Please confirm your action',
        children: (
            <Suspense fallback={<EzLoader h={120}/>}>
                <GenericModal
                    text={props.text}
                    description={props.description}
                    cancel={() => window.closeModal(modalId)}
                    accept={async () => {
                        await props.handleDelete();
                        window.closeModal(modalId);
                    }}
                    label={{accept: 'Delete' }}
                />
            </Suspense>
        ),
        onClose: () => {}
    })
}