import {Badge, Button, Card, Divider, Group, Stack} from '@mantine/core';
import {IconContract, IconEye, IconCalendar} from '@tabler/icons-react';
import EzText from '@/ezMantine/text/EzText.tsx';

interface ContractCardProps {
    contract: any;
    onAction: (contract: any) => void;
    signerType: 'employer' | 'candidate';
}

const STATUS_COLOR: Record<string, string> = {
    PENDING: 'orange',
    COMPLETED: 'green',
    CANCELLED: 'red',
};

const STATUS_LABEL: Record<string, string> = {
    PENDING: 'Pending',
    COMPLETED: 'Signed',
    CANCELLED: 'Cancelled',
};

const TYPE_LABEL: Record<string, string> = {
    EMPLOYER: 'Service Agreement',
    CANDIDATE: 'Employment Agreement',
};

function formatDate(dateStr: string | null | undefined): string | null {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function ContractCard({
    contract,
    onAction,
    signerType,
}: ContractCardProps) {
    const status = contract.contract_status || 'PENDING';
    const color = STATUS_COLOR[status] || 'gray';
    const contractType = contract.contract_type || 'EMPLOYER';
    const candidate = contract.candidate;
    const employer = contract.employer;

    const candidateName = [
        candidate?.candidate_first_name,
        candidate?.candidate_last_name,
    ].filter(Boolean).join(' ') || 'N/A';

    const employerName = employer?.employer_company_name || 'N/A';

    const isEmployerContract = contractType === 'EMPLOYER';
    const hasSigned = isEmployerContract
        ? !!contract.contract_employer_signature
        : !!contract.contract_candidate_signature;

    const canSign = !hasSigned
        && status !== 'COMPLETED'
        && status !== 'CANCELLED';

    return (
        <Card
            padding="sm"
            radius="md"
            withBorder
            shadow="none"
            style={{
                borderLeft: `4px solid var(--mantine-color-${color}-5)`,
                overflow: 'hidden',
            }}
        >
            <Stack gap={8}>
                {/* Title + badge row */}
                <Group justify="space-between" gap={8}>
                    <div style={{minWidth: 0, flex: 1}}>
                        <EzText fw={600} fz="sm" truncate="end">
                            {contract.contract_position_title}
                        </EzText>
                    </div>
                    <Badge size="sm" color={color} style={{flexShrink: 0}}>
                        {STATUS_LABEL[status] || status}
                    </Badge>
                </Group>

                {/* Type + contract number */}
                <EzText c="dimmed" fz="xs" truncate="end">
                    {TYPE_LABEL[contractType] || contractType}
                    {' · #'}{contract.contract_number}
                </EzText>

                {/* Details */}
                <Group gap={8}>
                    <EzText fz="xs" c="dimmed">
                        {signerType === 'employer'
                            ? candidateName
                            : employerName}
                    </EzText>
                    {contract.contract_start_date && (
                        <Group gap={4}>
                            <IconCalendar size={14} color="gray" />
                            <EzText fz="xs" c="dimmed">
                                {formatDate(contract.contract_start_date)}
                                {contract.contract_end_date
                                    && ` – ${formatDate(contract.contract_end_date)}`}
                            </EzText>
                        </Group>
                    )}
                </Group>

                <Divider />

                {/* Action row */}
                <Group justify="space-between">
                    {hasSigned
                        ? <Badge size="sm" color="teal">Signed</Badge>
                        : <span />
                    }
                    <Button
                        variant={canSign ? 'filled' : 'light'}
                        size="xs"
                        leftSection={canSign
                            ? <IconContract size={16} />
                            : <IconEye size={16} />
                        }
                        onClick={() => onAction(contract)}
                    >
                        {canSign ? 'Review & Sign' : 'View'}
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
}
