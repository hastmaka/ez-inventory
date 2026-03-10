import {ScrollArea, Combobox} from "@mantine/core";
import type {JSX} from "react";

function RegularDropdown({
    signal, options, freeMode
}: {
    signal: any,
    options: () => JSX.Element,
    freeMode?: boolean
}) {

    return (
        <ScrollArea.Autosize mah={200} type="always" scrollbars="y">
            {signal.loading ? (
                <Combobox.Empty>Loading....</Combobox.Empty>
            ) : options()}
            {!signal.exactOptionMatch && signal.search.trim().length > 0 && freeMode && (
                <Combobox.Option value="$create">+ Create {signal.search}</Combobox.Option>
            )}
        </ScrollArea.Autosize>
    )
}

export default RegularDropdown;