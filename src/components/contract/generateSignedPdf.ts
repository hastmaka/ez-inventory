import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactDOM from 'react-dom/client';
import {createElement} from 'react';
import ContractTemplate from '@/components/pdfUtilities/ContractTemplate.tsx';
import {extractContractData} from '@/components/contract/extractContractData.ts';
import {uploadToFirebaseStorage} from '@/api/firebase/FirebaseStore';

/**
 * Generates a signed PDF from a completed contract and uploads to Firebase Storage.
 * Returns the download URL of the uploaded PDF.
 */
export async function generateSignedPdf(contract: any): Promise<string | null> {
    const templateProps = extractContractData(contract);

    // Create hidden container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0px';
    container.style.left = '-9999px';
    container.style.width = '900px';
    container.style.minHeight = 'auto';
    container.style.display = 'block';
    container.style.zIndex = '-1';
    document.body.appendChild(container);

    // Render template
    const root = ReactDOM.createRoot(container);
    root.render(createElement(ContractTemplate, {
        ...templateProps,
        border: '1px solid black',
    }));

    await new Promise(res => setTimeout(res, 500));

    // Capture to canvas
    const canvas = await html2canvas(container, {scale: 2});
    const imgData = canvas.toDataURL('image/png');

    // Generate PDF
    const pdf = new jsPDF({unit: 'px', format: 'letter'});
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const topMargin = margin / 2;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, 'PNG', margin, topMargin, imgWidth, imgHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
        pdf.addPage();
        const position = heightLeft - imgHeight + margin;
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
    }

    // Cleanup DOM
    root.unmount();
    container.remove();

    // Upload to Firebase Storage using project helper
    try {
        const pdfBlob = pdf.output('blob');
        const pdfFile = new File(
            [pdfBlob],
            `${contract.contract_number}_signed.pdf`,
            {type: 'application/pdf'},
        );
        const results = await uploadToFirebaseStorage(pdfFile, 'contracts');
        return results[0]?.url || null;
    } catch (err) {
        console.error('Firebase upload failed:', err);
        return null;
    }
}
