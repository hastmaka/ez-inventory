type ValueLabelOption = {
    value: number | string;
    label: string;
};

type AssetOption = {
    asset_asset_id: number;
    asset_option_id: number;
    asset_option_name: string;
};

export type OptionLike = ValueLabelOption | AssetOption;

export type Stores = {
    address_type: AssetOption[],
    sex: AssetOption[],
    true_false: AssetOption[],
    yes_no: AssetOption[],
    employee_role: AssetOption[],
    insurance_relation: AssetOption[],
    maladaptive_measure: AssetOption[],
    maladaptive_status: AssetOption[],
    maladaptive_function: AssetOption[],
    maladaptive_intensity: AssetOption[],
    competence_status: AssetOption[],
    caregiver_relation: AssetOption[],
    client_insurance_relation: AssetOption[],
    client_note_type: AssetOption[],
    approval_procedures: AssetOption[],
    scheduling_limit_procedures_daily: AssetOption[],
    scheduling_limit_procedures_weekly: AssetOption[],
    term_objective_status: AssetOption[],
    term_objective_type: AssetOption[],
    time_sheet_action: AssetOption[],
    user_type: AssetOption[],
    preference_category: AssetOption[],
    preference_sub_category_tangibles: AssetOption[],
    preference_sub_category_activities: AssetOption[],
    abc_maladaptive_behavior: AssetOption[],
    analyst_status: AssetOption[],
    analyst_role: AssetOption[],
    [key: string]: ValueLabelOption[],
    
}