import type {FormField} from "@/types";
import EzForm, {type EzFormProps} from "@/components/form/EzForm.tsx";
import {EzDelete} from "@/components/form/EzDelete.tsx";

const FIELDS: FormField[] = [
    {
        name: 'caregiver_primary',
        label: 'Is Primary',
        type: 'checkbox',
        // required: true,
        fieldProps: {
            info: 'Default contact of the client',
        },
    },
    {
        name: 'caregiver_first_name',
        label: 'First Name',
        required: true
    },
    {
        name: 'caregiver_middle_name',
        label: 'Middle Name',
        fieldProps: {
            maxLength: 1
        }
    },
    {
        name: 'caregiver_last_name',
        label: 'Last Name',
        required: true
    },
    {
        name: 'caregiver_relation',
        label: 'Relation with Client',
        required: true
    },
    {
        name: 'caregiver_sex',
        label: 'Sex',
        type: 'select',
        fieldProps: {
            url: 'v1/asset/sex',
        }
    },
    {
        name: 'caregiver_email',
        label: 'Email',
    }
]

type EzCaregiverFormProps = Omit<EzFormProps,
    "FIELDS" | "structure" | "handleSaveEdit" | "handleDelete">;

export default function EzCaregiverForm(props: EzCaregiverFormProps) {
    async function handleSaveEdit(): Promise<any>{
        return await window.toast.U({
            modalId: props.modalId,
            id: {
                title: `${props.id ? 'Editing' : 'Creating'} Address`,
                message: 'Please wait...',
            },
            update: {
                success: `Address ${props.id ? 'updated' : 'created'} successfully`,
                error: `Failed to ${props.id ? 'update' : 'create'} address`
            },
            cb: props.handler
        })
    }

    function handleDeleteM() {
        const modalId = 'delete-caregiver-modal';
        const caregiver = props.controller.formData.caregiver;
        EzDelete({
            modalId,
            text: 'Deleting Caregiver: ' + caregiver.caregiver_full_name,
            description: `Description example`,
            handleDelete: async function(){
                return await window.toast.U({
                    modalId,
                    id: {
                        title: 'Deleting Caregiver',
                        message: 'Please wait ...'
                    },
                    update: {
                        success: `Caregiver deleted successfully`,
                        error: `Failed to delete caregiver`
                    },
                    cb: () => props.controller.handleCaregiverDelete(props.id)
                })
            }
        })
    }
    return (
        <EzForm
            FIELDS={FIELDS}
            structure={[1,3,3]}
            handleSaveEdit={handleSaveEdit}
            handleDelete={handleDeleteM}
            {...props}
        />
    );
}