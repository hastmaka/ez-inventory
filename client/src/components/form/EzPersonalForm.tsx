import type {FormField} from "@/types";
import EzForm, {type EzFormProps} from "@/components/form/EzForm.tsx";

const FIELDS: FormField[] = [
    {
        name: 'client_first_name',
        label: 'First Name',
        required: true
    }, {
        name: 'client_middle_name',
        label: 'Middle Name',
        fieldProps: {
            maxLength: 1
        }
    }, {
        name: 'client_last_name',
        label: 'Last Name',
        required: true
    }, {
        name: 'client_dob',
        label: 'DOB (Date of Birth)',
        type: 'date',
        required: true
    }, {
        name: 'client_sex',
        label: 'Sex',
        type: 'select',
        fieldProps: {
            url: 'v1/asset/sex',
        }
    },
    {
        name: 'client_eqhealth_id',
        label: 'EQ Health ID'
    },
    {
        name: 'phone_number',
        label: 'Phone Number',
        placeholder: '(___) ___-____',
        type: 'phone'
    },
    {
        name: 'client_start_date',
        label: 'Start Date',
        type: 'date'
    },
    {
        name: 'client_end_date',
        label: 'End Date',
        type: 'date'
    }
]

type EzPersonalFormProps = Omit<EzFormProps,
    "FIELDS" | "structure" | "handleSaveEdit" | "handleDelete">;

export default function EzPersonalForm(props: EzPersonalFormProps) {

    async function handleSaveEdit(): Promise<any> {
        return await window.toast.U({
            modalId: props.modalId,
            id: {
                title: 'Editing Personal Information',
                message: 'Please wait...',
            },
            update: {
                success: 'Personal information updated successfully',
                error: 'Failed to update personal information'
            },
            cb: props.handler
        })
    }

    return (
        <EzForm
            FIELDS={FIELDS}
            structure={[3,2,2,2]}
            handleSaveEdit={handleSaveEdit}
            {...props}
        />
    )
}