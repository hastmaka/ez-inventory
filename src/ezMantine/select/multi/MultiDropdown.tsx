import {Combobox, ScrollArea} from "@mantine/core";
import type {JSX} from "react";

function MultiDropdown({signal, options, freeMode}: {signal: any, options: () => JSX.Element, freeMode: boolean}) {

    return (
        <ScrollArea.Autosize mah={200} type="scroll">
            {signal.loading ? (
                <Combobox.Empty>Loading....</Combobox.Empty>
            ) : (
                <>
                    {options()}
                    {!signal.exactOptionMatch && signal.search.trim().length > 0 && freeMode && (
                        <Combobox.Option value="$create">+ Create {signal.search}</Combobox.Option>
                    )}
                </>
            )}
        </ScrollArea.Autosize>
    );
}

export default MultiDropdown;