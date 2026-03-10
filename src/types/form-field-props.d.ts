import React from "react";

export type FormFieldProps = {
    name?: string;
    url?: string;
    multiselect?: boolean;
    autoClose?: boolean;
    fromDb?: boolean;
    data?: any[];
    max?: number;
    min?: number;
    freeMode?: boolean;
    thousandSeparator?: string;
    flex?: number;
    size?: string;
    clearFileInput?: () => void;
    fileSize?: number;
    fileValidator?: (file: File | File[] | null) => void;
    multiple?: boolean;
    resetRef?: React.RefObject<() => void>;
    /** in case of having an info icon with tooltip*/
    info?: string;
    [key: string]: any; // fallback for dynamic keys
}