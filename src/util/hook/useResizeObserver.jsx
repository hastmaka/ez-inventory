import { useEffect, useState } from 'react';
import PropTypes from "prop-types";

/**
 *
 * @param ref - reference of the element you want to keep track in this case its height
 * but can be any other attribute
 * @returns {{heightObserver: number}} -
 */
export default function useResizeObserver (ref) {
    const [heightObserver, setHeightObserver] = useState(0);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const newWidth = entry.contentRect.width;
                setHeightObserver(newWidth);
            }
        });

        if (ref.current) resizeObserver.observe(ref.current);
        return () => resizeObserver.disconnect();
    }, [ref]);

    return { heightObserver };
}

useResizeObserver.propTypes = {
    ref: PropTypes.shape({current: PropTypes.instanceOf(Element)}),
}