import type {RenderListOptionProps} from "./render-list-option";

export type RenderListProps = {
    options: RenderListOptionProps[] | string[];
    onTransfer?: (options: RenderListOptionProps[] | string[]) => void;
    onChange?: (option: RenderListOptionProps) => void;
    type?: 'forward' | 'backward';
    placeholder?: string;
    title?: string;
    singleSelect?: boolean;
    loading?: boolean;
    [key: string]: any;
}