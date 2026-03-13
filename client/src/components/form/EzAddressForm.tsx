import type {FormField} from "@/types";
import EzForm, {type EzFormProps} from "@/components/form/EzForm.tsx";
import {EzDelete} from "@/components/form/EzDelete.tsx";
import _ from "lodash";

type EzAddressFormProps = Omit<EzFormProps,
    "FIELDS" | "structure" | "handleSaveEdit" | "handleDelete">;

export default function EzAddressForm(props: EzAddressFormProps) {

    const FIELDS: FormField[] = [
        {
            name: 'address_primary',
            label: 'Is Primary',
            type: 'checkbox',
            // required: true,
            fieldProps: {
                info: 'If need to update Primary Address, just create a new one and set Primary as true',
            },
            ...(props.controller.isPrimary && {
                disabled: true
            })
        },
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
            name: 'caregiver_caregiver_id',
            label: 'Related to',
            type: 'select',
            fieldProps: {
                url: 'v1/client/client_view/address/caregiver/' + props.related_field_id,
                iterator: {label: 'caregiver_relation', value: 'caregiver_caregiver_id'},
            },
            // required: true
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
            type: 'number',
            maxLength: 5,
            required: true
        },
        {
            name: 'address_comment',
            label: 'Comment',
            type: 'textarea',
        }
    ]

    async function handleSaveEdit(): Promise<any> {
        // we need to check if the isPrimary change to make this logic
        const dirtyFields = props.controller.dirtyFields
        if (_.has(dirtyFields, 'address_primary')) {
            const canProceed: boolean = await props.controller.handleAddressIsPrimaryEdit()
            if (!canProceed) {
                return { success: false, error: "User cancelled" };
            }
        }

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
        const modalId = 'delete-address-modal';
        const address = props.controller.formData.address;
        EzDelete({
            modalId,
            text: 'Deleting Address: ' + address.address_street,
            description: `Description example`,
            handleDelete: async function(){
                return await window.toast.U({
                    modalId,
                    id: {
                        title: 'Deleting Address',
                        message: 'Please wait ...'
                    },
                    update: {
                        success: `Address deleted successfully`,
                        error: `Failed to delete address`
                    },
                    cb: () => props.controller.handleAddressDelete(props.id)
                })
            }
        })
    }

    return (
        <EzForm
            FIELDS={FIELDS}
            structure={[1,2,2,3,1]}
            handleSaveEdit={handleSaveEdit}
            {...(!props.controller.isPrimary && {
                handleDelete: handleDeleteM
            })}
            {...props}
        />
    )
}