import type {FormField} from "@/types";
import EzForm, {type EzFormProps} from "@/components/form/EzForm.tsx";
import {EzDelete} from "@/components/form/EzDelete.tsx";

type EzTherapistFormProps = Omit<EzFormProps,
    "FIELDS" | "structure" | "handleSaveEdit" | "handleDelete">;

export default function EzTherapistForm(props: EzTherapistFormProps) {

    const FIELDS: FormField[] = [
        {
            name: 'address_type',
            label: 'Select Type',
            type: 'select',
            fieldProps: {
                url: 'v1/asset/address_type'
            },
            required: true
        },
        {
            name: 'address_street',
            label: 'Street',
            required: true
        },
        {
            name: 'address_apt',
            label: 'Apartment'
        },
        {
            name: 'address_city',
            label: 'City',
            required: true
        },
        {
            name: 'address_state',
            label: 'State',
            required: true
        },
        {
            name: 'address_zip',
            label: 'Zip Code',
            required: true
        },
        {
            name: 'address_relation',
            label: 'Related to',
            type: 'select',
            fieldProps: {
                url: 'v1/client/info/address/caregiver/' + props.related_field_id,
                iterator: {label: 'caregiver_concat', value: 'caregiver_id'},
            },
            // required: true
        }
    ]

    async function handleSaveEdit(): Promise<any> {
        return await window.toast.U({
            modalId: props.modalId,
            id: {
                title: `${props.id ? 'Editing' : 'Creating'} Therapist`,
                message: 'Please wait...',
            },
            update: {
                success: `Therapist ${props.id ? 'updated' : 'created'} successfully`,
                error: `Failed to ${props.id ? 'update' : 'create'} therapist`
            },
            cb: props.handler
        })
    }

    function handleDeleteM() {
        const modalId = 'delete-therapist-modal';
        const employee = props.controller.formData.employee;
        EzDelete({
            modalId,
            text: 'Deleting Therapist: ' + employee.employee_full_name,
            description: `Description example`,
            handleDelete: async function(){
                return await window.toast.U({
                    modalId,
                    id: {
                        title: 'Deleting Therapist',
                        message: 'Please wait ...'
                    },
                    update: {
                        success: `Therapist deleted successfully`,
                        error: `Failed to delete therapist`
                    },
                    cb: () => props.controller.handleCaregiverDelete(props.id)
                })
            }
        })
    }

    return (
        <EzForm
            FIELDS={FIELDS}
            structure={[2,2,2]}
            handleSaveEdit={handleSaveEdit}
            handleDelete={handleDeleteM}
            {...props}
        />
    )
}