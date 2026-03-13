import React, {useLayoutEffect, useState} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {FetchApi} from "@/api/FetchApi.ts";
import {Stack} from "@mantine/core";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";

/**
 * Preview component for testing multiple PDF templates side by side.
 * Fetches data from API and renders each template with extracted props.
 *
 * @param url - API endpoint to fetch data (e.g., 'v1/reservation/123')
 * @param extractor - Function to transform API response into template props
 * @param template - Array of React components to render as PDF templates
 *
 * @example
 * import { extractDataFromRow } from './pdfUtil/extractDataFromRow';
 * import JMC from './JMC';
 * import ClientFull from './ClientFull';
 * import ClientSimple from './ClientSimple';
 *
 * <TestPdf
 *   url={`v1/reservation/${reservationId}`}
 *   extractor={extractDataFromRow}
 *   template={[JMC, ClientFull, ClientSimple]}
 * />
 */
export default function TestPdf({
    url, extractor, template
}: {
    url: string,
    extractor: (row: any) => Record<string, any>,
    template?: React.ComponentType<any>[]
}) {
    const [l, setL] = useState<boolean>(true);
    const [row, setRow] = useState<any>({});

    useLayoutEffect(() => {
        const getData = async () => {
            const response = await FetchApi(url)
            setRow(response.data)
            setL(false)
        }

        getData().then()
    }, [url]);

    if (l) return <EzLoader h='100vh'/>

    // ---- 4) PREPARE PROPS FOR TEMPLATE ----
    const border = '2px solid black'
    const _props = extractor(row)
    const props= {..._props, border}

    return (
        <Stack w='100%' align='center'>
            <EzScroll h='calc(100vh - 120px)'>
                <Stack gap="xl">
                    {template?.map((T, index) => (
                        <T key={index} {...props} />
                    ))}
                </Stack>
            </EzScroll>
        </Stack>
    );
}