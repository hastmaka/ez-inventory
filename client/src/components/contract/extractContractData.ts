function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatMoney(val: string | number | null | undefined): string {
    if (val === null || val === undefined) return '0.00';
    return Number(val).toFixed(2);
}

export function extractContractData(contract: any) {
    const employer = contract.employer;
    const candidate = contract.candidate;
    const isEmployer = contract.contract_type === 'EMPLOYER';

    const employerName = employer?.employer_company_name
        || employer?.employer_name
        || 'N/A';

    const employerContactName = [
        employer?.employer_first_name,
        employer?.employer_last_name,
    ].filter(Boolean).join(' ') || '';

    const candidateName = [
        candidate?.candidate_first_name,
        candidate?.candidate_last_name,
    ].filter(Boolean).join(' ') || 'N/A';

    return {
        contractType: (contract.contract_type || 'EMPLOYER') as 'EMPLOYER' | 'CANDIDATE',
        contractNumber: contract.contract_number || '',
        agencyName: 'Work Force Staffing Agency',
        employerName,
        employerContactName,
        candidateName,
        positionTitle: contract.contract_position_title || 'N/A',
        payRate: formatMoney(contract.contract_pay_rate),
        billRate: formatMoney(contract.contract_bill_rate),
        payType: contract.contract_pay_type_option?.asset_option_name
            || contract.contract_pay_type
            || 'hour',
        startDate: formatDate(contract.contract_start_date),
        endDate: formatDate(contract.contract_end_date),
        workLocation: contract.contract_work_location || '',
        terms: contract.contract_terms || '',
        // Generic signature fields — mapped by contract type
        signature: isEmployer
            ? (contract.contract_employer_signature || null)
            : (contract.contract_candidate_signature || null),
        signedName: isEmployer
            ? (contract.contract_employer_signed_name || null)
            : (contract.contract_candidate_signed_name || null),
        signedAt: isEmployer
            ? formatDate(contract.contract_employer_signed_at)
            : formatDate(contract.contract_candidate_signed_at),
    };
}
