import {Stack} from "@mantine/core";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";
import {useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import type {FormField} from "@/types";
import _ from "lodash";

export type EzFormProps = {
    /** Unique identifier for the modal */
    modalId: string;
    /** Optional ID of the address being edited */
    id?: number;
    /** Foreign key used for relation lookups (e.g. caregiver) */
    related_field_id?: number;
    /** Controller with state and form handlers */
    controller: any;
    /** Handler function to make the corresponding action Create | Edit*/
    handler: () => void;
    /** Root key for namespacing formData/errors */
    root: string;
    /** Whether to render Save/Cancel buttons */
    btns?: boolean;
    /** Fields of the form*/
    FIELDS: FormField[];
    /** Structure of the form*/
    structure: number[];
    /** Func use to Save or Edit*/
    handleSaveEdit: () => Promise<{ success: boolean; data?: Record<string, any>; error?: any }>;
    /** Func to delete the record*/
    handleDelete?: () => void;
    /** Height of the Loader*/
    h?: number
}

export default function EzForm({
    modalId,
    id,
    controller,
    root,
    btns = true,
    FIELDS,
    structure,
    handleSaveEdit,
    handleDelete,
    h
}: EzFormProps){
    const {
        handleInput,
        formData,
        modal,
        modalData,
        errors,
        checkRequired
    } = controller;

    useLayoutEffect(() => {
        modalData(root, FIELDS, id).then()
    }, [id])

    async function handleSave() {
        if(!_.isEmpty(controller.dirtyFields) && checkRequired(root, FIELDS)) {
            const response = await handleSaveEdit()
            if (response.success) {
                window.closeModal(modalId)
                controller.formData[root] = {}
                return
            }
        }
    }

    function handleCancel() {
        window.closeModal(modalId)
        controller.resetState(root)
    }

    if (modal!.loading) return <EzLoader h={h || 360}/>

    return (
        <Stack>
            <EzScroll needPaddingBottom={btns}>
                <FormGenerator
                    field={FIELDS}
                    handleInput={(name: string, value: any, api?: any) =>
                        handleInput(root, name, value, api)}
                    structure={structure}
                    formData={{...formData![root]}}
                    errors={errors![root]}
                />
            </EzScroll>

            {btns &&
                <SaveCancelDeleteBtns
                    cancel={handleCancel}
                    accept={handleSave}
                    {...(id && {
                        _delete: handleDelete
                    })}
                    withScroll
                    label={{
                        accept: id ? 'Edit' : 'Save'
                    }}
                />
            }
        </Stack>
    )
}