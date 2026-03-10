import {useEffect, useRef} from 'react';
import {
    CheckIcon,
    CloseButton,
    Combobox,
    Divider,
    Group,
    Pill,
    PillsInput,
    useCombobox
} from "@mantine/core";
import {deepSignal} from "deepsignal/react";
import EzText from "@/ezMantine/text/EzText.tsx";

interface EzSearchAdvancedInputProps {
    state?: any,
    name?: string,
    w?: number
}

function EzSearchAdvancedInput({state, /*name,*/ w=300 /*, ...rest*/}: EzSearchAdvancedInputProps) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const modelInstance = new state.store.model.main({})

    const signal = useRef(deepSignal({
        fields: modelInstance.getFields(),
        value: [] as string[],
        search: ''
    })).current;

    useEffect(() => {
        // handle the search every time value length change
        console.log(signal.value)
    }, [signal.value.length]);

    const exactOptionMatch = signal.value.some((item: string) => item === signal.search);

    const handleValueSelect = (val: string) => {
        const f = val.split('-')[1]
        if (val.startsWith('$create')) {
            signal.value = [...signal.value, `${signal.search} as ${f}`]
        } else {
            signal.value = signal.value.includes(val)
                ? signal.value.filter((v) => v !== val)
                : [...signal.value, val]
        }
        signal.search = ''
    };

    const handleValueRemove = (val: string) =>
        signal.value = signal.value.filter((v) => v !== val)

    const values = signal.value.map((item) => (
        <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
            {item}
        </Pill>
    ));

    const options = signal.value
        .filter((item) => item.toLowerCase().includes(signal.search.trim().toLowerCase()))
        .map((item) => (
            <Combobox.Option value={item} key={item} active={signal.value.includes(item)}>
                <Group gap="sm">
                    {signal.value.includes(item) ? <CheckIcon size={12} /> : null}
                    <span>{item}</span>
                </Group>
            </Combobox.Option>
        ));

    return (
        <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal>
            <Combobox.DropdownTarget>
                <PillsInput
                    onClick={() => combobox.openDropdown()}
                    rightSection={
                        signal.value.length > 0 && (
                            <CloseButton
                                size="sm"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => signal.value = []}
                                aria-label="Clear value"
                            />
                        )
                    }
                >
                    <Pill.Group>
                        {values}

                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                w={w}
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}
                                value={signal.search}
                                placeholder="Advanced Search"
                                onChange={(event) => {
                                    combobox.updateSelectedOptionIndex();
                                    signal.search = event.currentTarget.value
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Backspace' && signal.search.length === 0) {
                                        event.preventDefault();
                                        handleValueRemove(signal.value[signal.value.length - 1]);
                                    }
                                }}
                            />
                        </Combobox.EventsTarget>
                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown>
                <Combobox.Options>
                    {options}

                    {!exactOptionMatch && signal.search.trim().length > 0 && (
                        signal.fields.map((field: string, index: number) =>
                            <Combobox.Option value={`$create-${field}`} key={index}>
                                {signal.search} as {field}
                            </Combobox.Option>
                        )
                    )}

                    <Divider/>
                    <EzText p={8}>custom search</EzText>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}

export default EzSearchAdvancedInput;