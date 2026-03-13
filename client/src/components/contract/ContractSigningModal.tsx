import {useState} from 'react';
import {Checkbox, Stack, TextInput} from '@mantine/core';
import {IconContract} from '@tabler/icons-react';
import SignaturePad from '@/components/signaturePad/SignaturePad.tsx';
import ContractTemplate from '@/components/pdfUtilities/ContractTemplate.tsx';
import {extractContractData} from '@/components/contract/extractContractData.ts';
import EzText from '@/ezMantine/text/EzText.tsx';
import EzScroll from '@/ezMantine/scroll/EzScroll.tsx';
import GenericModal from '@/components/modal/GenericModal.tsx';

interface ContractSigningModalProps {
    contract: any;
    signerType: 'employer' | 'candidate';
    onSign: (contractId: number, signatureData: string, signedName: string) => Promise<void>;
}

const closeModal = () => window.closeModal('contract-signing-modal');

export default function ContractSigningModal({
    contract,
    onSign,
}: ContractSigningModalProps) {
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const [signedName, setSignedName] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEmployerContract = contract.contract_type === 'EMPLOYER';
    const hasSigned = isEmployerContract
        ? !!contract.contract_employer_signature
        : !!contract.contract_candidate_signature;

    const isCompleted = contract.contract_status === 'COMPLETED';
    const isCancelled = contract.contract_status === 'CANCELLED';
    const canSign = !hasSigned && !isCompleted && !isCancelled;

    const templateProps = extractContractData(contract);

    const handleSubmit = async () => {
        if (!signatureData || !signedName.trim() || !isAgreed) return;
        setIsSubmitting(true);
        try {
            await onSign(contract.contract_id, signatureData, signedName.trim());
        } catch (err) {
            console.error('Sign contract failed:', err);
            window.toast.E('Failed to sign contract');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <GenericModal
            withScroll
            cancel={closeModal}
            label={{
                cancel: canSign ? 'Cancel' : 'Close',
                ...(canSign && {accept: 'Sign & Accept'}),
            }}
            {...(canSign && {
                accept: handleSubmit,
                acceptProps: {
                    disabled: !signatureData || !signedName.trim() || !isAgreed,
                    loading: isSubmitting,
                    leftSection: <IconContract size={24} />,
                },
            })}
        >
                <EzScroll h='calc(100vh - 100px)' needPaddingBottom p='0 1rem'>

                <ContractTemplate
                    {...templateProps}
                    border="1px solid var(--mantine-color-default-border)"
                />


                {canSign && (
                    <Stack gap="sm" pt={16}>
                        <EzText fw={600}>Sign this Contract</EzText>

                        <SignaturePad
                            onSignatureChange={setSignatureData}
                            height={150}
                        />

                        <TextInput
                            label="Print your full name"
                            placeholder="Enter your full legal name"
                            value={signedName}
                            onChange={(e) => setSignedName(e.currentTarget.value)}
                            required
                        />

                        <Checkbox
                            label="I have read and agree to the terms and conditions of this contract"
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.currentTarget.checked)}
                        />
                    </Stack>
                )}
                </EzScroll>
        </GenericModal>
    );
}
