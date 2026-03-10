import type {FormField} from "@/types";
import EzForm, {type EzFormProps} from "@/components/form/EzForm.tsx";
import {EzDelete} from "@/components/form/EzDelete.tsx";
import u from "@/util";

type EzPhoneFormProps = Omit<EzFormProps,
    "FIELDS" | "structure" | "handleSaveEdit" | "handleDelete">;

export default function EzPhoneForm(props: EzPhoneFormProps) {
    const FIELDS: FormField[] = [
        {
            name: 'phone_primary',
            label: 'Is Primary',
            type: 'checkbox',
            // required: true,
            fieldProps: {
                info: 'If need to update Primary Phone, just create a new one and set Primary as true',
            },
            ...(props.controller.isPrimary && {
                disabled: true
            })
        },
        {
            name: 'phone_number',
            label: 'Phone Number',
            placeholder: '(___) ___-____',
            type: 'phone',
            required: true,
        }, {
            name: 'phone_type',
            label: 'Phone Type',
            type: 'select',
            fieldProps: {
                url: 'v1/asset/phone_type',
            },
            required: true
        }, {
            name: 'caregiver_caregiver_id',
            label: 'Phone Relation',
            type: 'select',
            fieldProps: {
                url: 'v1/client/client_view/phone/caregiver/' + props.related_field_id,
                iterator: {label: 'caregiver_relation', value: 'caregiver_caregiver_id'}
            },
            // required: true
        }, {
            name: 'phone_ext',
            label: 'Phone Extension',
            type: 'number'
        }, {
            name: 'phone_comment',
            label: 'Phone Comment',
            type: 'textarea'
        },
    ]

    async function handleSaveEdit(): Promise<any> {
        return await window.toast.U({
            modalId: props.modalId,
            id: {
                title: `${props.id ? 'Editing' : 'Creating'} Phone`,
                message: 'Please wait...',
            },
            update: {
                success: `Phone ${props.id ? 'updated' : 'created'} successfully`,
                error: `Failed to ${props.id ? 'update' : 'create'} phone`
            },
            cb: props.handler
        })
    }

    function handleDeleteM() {
        const modalId = 'delete-phone-modal';
        const phone = props.controller.formData.phone;
        EzDelete({
            modalId,
            text: 'Deleting Phone: ' + u.formatPhoneNumber(phone.phone_number) + ` (${phone.caregiver_caregiver_id})`,
            description: `Description example`,
            handleDelete: async function(){
                return await window.toast.U({
                    modalId,
                    id: {
                        title: 'Deleting Phone',
                        message: 'Please wait ...'
                    },
                    update: {
                        success: `Phone deleted successfully`,
                        error: `Failed to delete phone`
                    },
                    cb: () => props.controller.handlePhoneDelete(props.id)
                })
            }
        })
    }

    return (
        <EzForm
            FIELDS={FIELDS}
            structure={[1,2,2,1]}
            handleSaveEdit={handleSaveEdit}
            {...(!props.controller.isPrimary && {
                handleDelete: handleDeleteM
            })}
            {...props}
        />
    )
}