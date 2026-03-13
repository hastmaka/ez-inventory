// import type {FormField} from "@/types";
//
// const FIELDS: Record<number, FormField> = {
//     1: {
//         name: 'client_name',
//         label: 'Client Name',
//         type: 'select',
//         fieldProps: {
//             url: `v1/employee/client/1`,
//             iterator: {label: 'client_full_name', value: 'client_id'},
//             filterField: 'client_full_name',
//         },
//         required: true,
//     },
//     2: {
//         name: 'therapist_name',
//         label: 'Therapist Name',
//         type: 'select',
//         fieldProps: {
//             url: 'v1/asset/maladaptive_status',
//         },
//         required: true,
//         searchable: true,
//     },
//     3: {
//         name: 'date',
//         label: 'Date',
//         type: 'date',
//         required: true
//     },
//     4: {
//         name: 'start_time',
//         label: 'Start Time',
//         type: 'time',
//         required: true
//     },
//     5: {
//         name: 'end_time',
//         label: 'End Time',
//         type: 'time',
//         required: true
//     },
//     6: {
//         name: 'location',
//         label: 'Location',
//         type: 'select',
//         fieldProps: {
//             url: 'v1/asset/maladaptive_status',
//         },
//         required: true,
//     },
//     7: {
//         name: 'analyst_name',
//         label: 'Analyst Name',
//         type: 'select',
//         fieldProps: {
//             url: 'v1/asset/maladaptive_status',
//         },
//         required: true,
//     },
//     8: {
//         name: 'procedure',
//         label: 'Procedure',
//         type: 'select',
//         fieldProps: {
//             url: 'v1/asset/maladaptive_status',
//         },
//         required: true,
//     },
//     9: {
//         name: 'supervisor_name',
//         label: 'Supervisor Name',
//         type: 'select',
//         fieldProps: {
//             url: 'v1/asset/maladaptive_status',
//         },
//         required: true,
//     },
//     10: {
//         name: 'rbt_name',
//         label: 'RBT Name',
//         type: 'select',
//         fieldProps: {
//             url: 'v1/asset/maladaptive_status',
//         },
//         required: true,
//     },
//     11: {
//         name: 'type_of_meeting',
//         label: 'Type of Meeting',
//         type: 'select',
//         fieldProps: {
//             url: 'v1/asset/maladaptive_status',
//         },
//         required: true,
//     },
//     12: {
//         name: 'supervisor_name',
//         label: 'Supervisor Name',
//         type: 'select',
//         fieldProps: {
//             url: 'v1/asset/maladaptive_status',
//         },
//         required: true,
//     },
//     13: {
//         name: 'observed_with_client',
//         label: 'Observed with Client',
//         type: 'select',
//         fieldProps: {
//             url: 'v1/asset/maladaptive_status',
//         },
//         required: true,
//     },
//     14: {
//         name: 'bcaba_name',
//         label: 'BCABA Name',
//         type: 'select',
//         fieldProps: {
//             url: 'v1/asset/maladaptive_status',
//         },
//         required: true,
//     },
//     15: {
//         name: 'healthcare_provider',
//         label: 'Healthcare Provider',
//         type: 'select',
//         fieldProps: {
//             url: 'v1/asset/maladaptive_status',
//         },
//         required: true,
//     },
//     16: {
//         name: 'agency_name',
//         type: 'string',
//         label: 'Agency Name',
//         required: true,
//         fieldProps: {
//             type: 'email'
//         }
//     },
//     17: {
//         name: 'agency_phone',
//         type: 'phone',
//         label: 'Agency Phone',
//         required: true
//     },
//     /** address */
//     18: {
//         name: 'address_type',
//         label: 'Select Location',
//         type: 'select',
//         fieldProps: {
//             url: 'v1/asset/address_type',
//         },
//         required: true
//     },
//     19: {
//         name: 'address_street',
//         label: 'Street',
//         required: true
//     },
//     20: {
//         name: "address_apt",
//         label: "Apartment"
//     },
//     21: {
//         name: 'address_city',
//         label: 'City',
//         required: true
//     },
//     22: {
//         name: 'address_state',
//         label: 'State',
//         required: true
//     },
//     23: {
//         name: 'address_zip',
//         label: 'Zip Code',
//         required: true
//     },
//
//     24: {
//         name: 'user_email',
//         type: 'string',
//         label: 'Email',
//         required: true,
//         fieldProps: {
//             type: 'email'
//         }
//     },
//     25: {
//         type: 'string',
//         name: 'employee_employee_id',
//         label: 'Employee Relation',
//         required: true
//     },
//     26: {
//         name: 'client_phone',
//         type: 'phone',
//         label: 'User Role',
//         required: true
//     },
//     27: {
//         name: "caregiver_first_name",
//         label: "First Name",
//         placeholder: "Set Caregiver First Name",
//         required: true,
//     },
//     28: {
//         name: "caregiver_last_name",
//         label: "Last Name",
//         placeholder: "Set Caregiver Last Name",
//     },
//     29: {
//         name: "caregiver_relation",
//         label: "Relation with Client",
//         placeholder: "Set Relation with Client",
//         required: true,
//     },
//     30: {
//         name: "caregiver_sex",
//         label: "Sex",
//         type: "select",
//         fieldProps: {
//             url: "v1/asset/sex",
//         },
//     },
//     31: {
//         name: "caregiver_phone_number",
//         placeholder: "Phone Number",
//         label: "Set a Phone Number",
//         type: "phone",
//     },
//     32: {
//         name: "caregiver_email",
//         placeholder: "Set Email",
//         label: "Email",
//     },
//     /** client */
//     33: {
//         name: "client_first_name", label: "First Name", required: true
//     },
//     34: {
//         name: "client_middle_name", label: "Middle Name"
//     },
//     35: {
//         name: "client_last_name", label: "Last Name", required: true
//     },
//     36: {
//         name: "client_dob", label: "DOB (Date of Birth)", type: "date", required: true
//     },
//     37: {
//         name: "client_sex",
//         label: "Sex",
//         type: "select",
//         fieldProps: {
//             url: "v1/asset/sex",
//         },
//     },
//     38: {
//         name: "client_eqhealth_id", label: "EQ Health ID" },
//     39: {
//         name: "client_start_date", label: "Start Date", type: "date" },
//     40: {
//         name: "client_phone_number",
//         label: "Phone Number",
//         type: "phone" ,
//         placeholder: '(___) ___-____',
//     },
//
//     41: {
//         name: "insurance_insurance_id",
//         label: "Insurance Name",
//         type: "select",
//         fieldProps: {
//             url: "v1/insurance",
//         },
//     },
//     42: {
//         name: "client_insurance_number", label: "Insurance Number" },
//     43: {
//         name: "client_insurance_card_expiration_date",
//         label: "Insurance Card Expiration Date",
//         type: "date",
//     },
//
//     999: {
//         name: 'repeat_four_weeks',
//         label: 'Repeat Every Four Weeks',
//         type: 'checkbox',
//     },
// }

// const FIELDS_MAP: Record<string, number[]> = {
//     behavior_treatment: [1, 2, 3, 4, 5, 6, 999],
//     family_training: [1, 7, 3, 4, 5, 6, 8, 999],
//     rbt_supervision_individual: [1, 9, 10, 3, 4, 5, 11, 999],
//     rbt_supervision_group: [9, 3, 4, 5, 6, 13, 11, 999],
//     bcaba_supervision_individual: [1, 9, 14, 3, 4, 5, 11, 999],
//     bcaba_supervision_group: [12, 3, 4, 5, 6, 13, 11, 999],
//     rbt_competency: [1, 7, 10, 3, 4, 5, 999],
//     medical_visit: [1, 15, 3, 4, 5, 999],
//     assessment: [1],
//     reassessment: [1],
//
//     // add_edit_agency: [16, 17, 18, 19, 21, 22, 23],
//     // add_edit_user: [24, 25, 26],
//     // add_client_address: [18, 19, 20, 21, 22, 23],
//     // add_client_caregiver: [27, 28, 29, 30, 31, 32],
//     // add_client_info: [33,34,35,36,37,38,39],
//     // add_client_insurance: [41,42,43],
//     // add_client_contact: [40]
// }

// const STRUCTURE: Record<string, number[]> = {
//     behavior_treatment: [2, 3, 1, 1],
//     family_training: [2, 3, 1, 1, 1],
//     rbt_supervision_individual: [3, 3, 1, 1],
//     rbt_supervision_group: [1, 3, 2, 1, 1],
//     bcaba_supervision_individual: [3, 3, 1, 1],
//     bcaba_supervision_group: [1, 3, 2, 1, 1],
//     rbt_competency: [3, 3, 1],
//     medical_visit: [2, 3, 1],
//     assessment: [1],
//     reassessment: [1],
// }

// function generateFields(key: string, type?: 'individual' | 'group') {
//     const fieldIds = type ? FIELDS_MAP[`${key}_${type}`] : FIELDS_MAP[key] || [];
//     const fields = fieldIds.map((id) => FIELDS[id]);
//     const structure = type ? STRUCTURE[`${key}_${type}`] : STRUCTURE[key] || [];
//     return {fields, structure};
// }
//
// export {generateFields}