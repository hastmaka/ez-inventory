import Whole from './Whole.tsx';
import Space from './Space.tsx';
import Under from './Under.tsx';

interface ContractTemplateProps {
    border: string;
    contractNumber: string;
    contractType?: 'EMPLOYER' | 'CANDIDATE';
    // Parties
    agencyName: string;
    employerName: string;
    employerContactName: string;
    candidateName: string;
    // Terms
    positionTitle: string;
    payRate: string;
    billRate: string;
    payType: string;
    startDate: string;
    endDate: string;
    workLocation: string;
    terms: string;
    // Signatures — generic (mapped by type in extractContractData)
    signature: string | null;
    signedName: string | null;
    signedAt: string | null;
}

export default function ContractTemplate({
    border,
    contractNumber,
    contractType = 'EMPLOYER',
    agencyName,
    employerName,
    employerContactName,
    candidateName,
    positionTitle,
    payRate,
    billRate,
    payType,
    startDate,
    endDate,
    workLocation,
    terms,
    signature,
    signedName,
    signedAt,
}: ContractTemplateProps) {
    const cellStyle = {padding: '4px 8px', fontSize: '12px'};
    const headerStyle = {
        ...cellStyle,
        fontWeight: 700 as const,
        backgroundColor: 'var(--mantine-color-gray-light)',
    };

    const isEmployer = contractType === 'EMPLOYER';
    const title = isEmployer ? 'SERVICE AGREEMENT' : 'EMPLOYMENT AGREEMENT';
    const signerLabel = isEmployer ? 'Employer Representative' : 'Candidate';

    return (
        <div style={{fontFamily: 'Arial, sans-serif', fontSize: '12px'}}>
            <table
                style={{width: '100%', borderCollapse: 'collapse'}}
                cellPadding={0}
                cellSpacing={0}
            >
                <tbody>
                    {/* Header */}
                    <tr>
                        <td colSpan={4} style={{textAlign: 'center', padding: '10px 0'}}>
                            <span style={{fontSize: '18px', fontWeight: 900}}>
                                {title}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td
                            colSpan={4}
                            style={{textAlign: 'center', padding: '4px 0'}}
                        >
                            <span style={{
                                fontSize: '12px',
                                color: 'var(--mantine-color-dimmed)',
                            }}>
                                Contract #: <Under>{contractNumber}</Under>
                            </span>
                        </td>
                    </tr>

                    <Space n={4} />

                    {/* Parties Section */}
                    <Whole fw={false} span={4}>PARTIES</Whole>
                    <tr>
                        <td style={{...headerStyle, border, width: '25%'}}>Agency</td>
                        <td style={{...cellStyle, border}} colSpan={3}>
                            {agencyName}
                        </td>
                    </tr>
                    {isEmployer ? (
                        <tr>
                            <td style={{...headerStyle, border}}>Employer</td>
                            <td style={{...cellStyle, border}} colSpan={3}>
                                {employerName}
                                {employerContactName
                                    && ` (Contact: ${employerContactName})`}
                            </td>
                        </tr>
                    ) : (
                        <tr>
                            <td style={{...headerStyle, border}}>Candidate</td>
                            <td style={{...cellStyle, border}} colSpan={3}>
                                {candidateName}
                            </td>
                        </tr>
                    )}

                    <Space n={4} />

                    {/* Position & Terms */}
                    <Whole fw={false} span={4}>POSITION & TERMS</Whole>
                    <tr>
                        <td style={{...headerStyle, border}}>Position Title</td>
                        <td style={{...cellStyle, border}} colSpan={3}>
                            {positionTitle}
                        </td>
                    </tr>
                    <tr>
                        <td style={{...headerStyle, border}}>
                            {isEmployer ? 'Bill Rate' : 'Pay Rate'}
                        </td>
                        <td style={{...cellStyle, border}} colSpan={3}>
                            ${isEmployer ? billRate : payRate} / {payType}
                        </td>
                    </tr>
                    <tr>
                        <td style={{...headerStyle, border}}>Start Date</td>
                        <td style={{...cellStyle, border}}>
                            {startDate}
                        </td>
                        <td style={{...headerStyle, border}}>End Date</td>
                        <td style={{...cellStyle, border}}>
                            {endDate || 'Ongoing'}
                        </td>
                    </tr>
                    <tr>
                        <td style={{...headerStyle, border}}>Work Location</td>
                        <td style={{...cellStyle, border}} colSpan={3}>
                            {workLocation || 'TBD'}
                        </td>
                    </tr>

                    <Space n={4} />

                    {/* Terms & Conditions */}
                    <Whole fw={false} span={4}>TERMS & CONDITIONS</Whole>
                    <tr>
                        <td colSpan={4} style={{
                            ...cellStyle,
                            border,
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.6',
                        }}>
                            {terms || 'No terms specified.'}
                        </td>
                    </tr>

                    <Space n={4} />

                    {/* Single Signature Block */}
                    <Whole fw={false} span={4}>SIGNATURE</Whole>
                    <tr>
                        <td colSpan={4} style={{
                            ...cellStyle,
                            border,
                            verticalAlign: 'top',
                        }}>
                            <div style={{padding: '8px', maxWidth: '50%'}}>
                                <div style={{fontWeight: 700, marginBottom: 8}}>
                                    {signerLabel}
                                </div>
                                <div style={{
                                    height: 80,
                                    border: '1px dashed var(--mantine-color-default-border)',
                                    marginBottom: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {signature ? (
                                        <img
                                            src={signature}
                                            alt={`${signerLabel} Signature`}
                                            style={{maxHeight: 70, maxWidth: '90%'}}
                                        />
                                    ) : (
                                        <span style={{
                                            color: 'var(--mantine-color-dimmed)',
                                        }}>
                                            Awaiting signature
                                        </span>
                                    )}
                                </div>
                                <div>
                                    Name: <Under>
                                        {signedName || '___________________'}
                                    </Under>
                                </div>
                                <div style={{marginTop: 4}}>
                                    Date: <Under>
                                        {signedAt || '___________________'}
                                    </Under>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
