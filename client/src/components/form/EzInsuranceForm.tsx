import type {FormField} from "@/types";
import EzForm, {type EzFormProps} from "./EzForm.tsx";
import {EzDelete} from "@/components/form/EzDelete.tsx";

const FIELDS: FormField[] = [
    {
        name: 'insurance_id',
        label: 'Insurance Name',
        type: 'select',
        fieldProps: {
            url: 'v1/insurance',
            iterator: {label: 'insurance_name', value: 'insurance_id'},
        },
        required: true
    },
    {
        name: 'client_insurance_number',
        label: 'Insurance Number',
        required: true
    },
    {
        name: 'client_insurance_payer_id',
        label: 'Enter Payer Id',
        required: true
    },
    {
        name: 'client_insurance_effective_start_date',
        label: 'Insurance Card Effective Date',
        type: 'date',
        required: true
    },
    {
        name: 'client_insurance_effective_end_date',
        label: 'Insurance Card Expiration Date',
        type: 'date',
    },
    {
        name: 'client_insurance_relation',
        label: 'Client Insurance Relation',
        type: 'select',
        fieldProps: {
            url: 'v1/asset/client_insurance_relation',
        },
        required: true
    }
]

type EzInsuranceFormProps = Omit<EzFormProps,
    "FIELDS" | "structure" | "handleSaveEdit" | "handleDelete">;

export default function EzInsuranceForm(props: EzInsuranceFormProps) {
    async function handleSaveEdit(): Promise<any>{
        return await window.toast.U({
            modalId: props.modalId,
            id: {
                title: `${props.id ? 'Updating' : 'Creating'} Insurance`,
                message: 'Please wait...',
            },
            update: {
                success: `Insurance ${props.id ? 'updated' : 'created'} successfully`,
                error: `Failed to ${props.id ? 'update' : 'create'} insurance`
            },
            cb: props.handler
        })
    }

    function handleDeleteM() {
        const modalId = 'delete-insurance-modal';
        const insurance = props.controller.formData.insurance;
        EzDelete({
            modalId,
            text: 'Deleting Insurance: ' + insurance.insurance_name,
            description: `Description example`,
            handleDelete: async function(){
                return await window.toast.U({
                    modalId,
                    id: {
                        title: 'Deleting Insurance',
                        message: 'Please wait ...'
                    },
                    update: {
                        success: `Insurance deleted successfully`,
                        error: `Failed to delete insurance`
                    },
                    cb: () => props.controller.handleInsuranceDelete(props.id)
                })
            }
        })
    }

    return (
        <EzForm
            FIELDS={FIELDS}
            structure={[3,2,1]}
            handleSaveEdit={handleSaveEdit}
            handleDelete={handleDeleteM}
            {...props}
        />
    );
}