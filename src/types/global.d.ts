// src/types/global.d.ts
import React from "react";

export interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
    modalId: string;
    title: string;
    fullScreen?: boolean;
    size?: "sm" | "md" | "lg" | "xl" | "xxl" | string,
    [key: string]: any;
}
declare global {
    interface Window {
        openModal: (modal: ModalProps) => void;
        closeModal: (modalId: string) => void;
        modalIsLoading: (modalId: string) => void;
        modalIsDone: (modalId: string) => void;
        updateModal: (modalId: string, modal: Record<string, any>) => void;
        toast: {
            (props: object): void;
            S: (msg: string) => void;
            W: (msg: string) => void;
            E: (msg: string) => void;
            U: (props: ToastU) => Promise<void>;
            Progress: (props: { id: string; message: string, [key: string]: any }) => void;
            close: (id: string) => void;
        };
        navigate: (url: string) => void;
    }
}

export {};
