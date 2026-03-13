import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactDOM from "react-dom/client";
import {type ComponentType} from "react";
import {FetchApi} from "@/api/FetchApi.ts";

/**
 * Generates a PDF from a React component template.
 * Can either open in a modal viewer or download directly.
 *
 * @param url - API endpoint to fetch data (e.g., 'v1/reservation/123')
 * @param template - React component to render as PDF template
 * @param extractor - Function to transform API response into template props
 * @param wantToDownloadIt - If true, downloads PDF directly; if false/undefined, opens in modal
 * @param fileName - Required when wantToDownloadIt is true. The name for the downloaded file
 *
 * @example
 * // Preview in modal
 * await pdfGenerator('v1/reservation/123', MyTemplate, extractData);
 *
 * @example
 * // Direct download with filename
 * await pdfGenerator('v1/reservation/123', MyTemplate, extractData, true, 'Report.pdf');
 */
export const pdfGenerator = async (
    url: string,
    template: ComponentType<any>,
    extractor: (row: any) => Record<string, any>,
    wantToDownloadIt?: boolean,
    fileName?: string
) => {
    if (wantToDownloadIt && !fileName) {
        throw Error(`Not download it: ${fileName}`);
    }

    const response = await FetchApi(url)
    const row = response.data

    // ---- 3) CREATE HIDDEN CONTAINER ----
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "0px";
    container.style.left = "-9999px";
    container.style.width = "900px";
    container.style.minHeight = "auto";
    container.style.display = "block";
    container.style.zIndex = "-1";

    document.body.appendChild(container);

    // ---- 4) PREPARE PROPS FOR TEMPLATE ----
    const border = '1px solid black'
    const _props = extractor(row)
    const props = {..._props, border}

    // ---- 5) RENDER SELECTED TEMPLATE DYNAMICALLY ----
    const TemplateComponent = template;
    const root = ReactDOM.createRoot(container);
    root.render(<TemplateComponent {...props} />);

    await new Promise(res => setTimeout(res, 400));

    // ---- 6) RENDER TO PDF ----
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ unit: "px", format: "letter" });
    const pageWidth = pdf.internal.pageSize.getWidth();

    const margin = 20;
    const topMargin = margin / 2;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = topMargin;

    pdf.addImage(imgData, "PNG", margin, topMargin, imgWidth, imgHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight + margin;
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
    }

    if(wantToDownloadIt) {
        pdf.save(fileName);
    } else {
        // ---- 7) OPEN PDF VIEWER MODAL ----
        const pdfBlobUrl = pdf.output('bloburl').toString();

        const modalId = 'pdf-viewer-modal';
        window.openModal({
            modalId,
            title: 'PDF Preview',
            fullScreen: true,
            children: (
                <iframe
                    src={pdfBlobUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', minHeight: 'calc(100vh - 100px)' }}
                />
            ),
            onClose: () => {
                URL.revokeObjectURL(pdfBlobUrl);
            },
            styles: {
                body: {
                    padding: 0,
                }
            }
        });
    }

    // ---- 8) CLEANUP ----
    root.unmount();
    container.remove();
};