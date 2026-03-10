import { forwardRef } from "react";
import {CloseButton, Combobox, Loader, Pill, PillsInput, Stack} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import {valueToLabel} from "@/util/convertData.ts";
import EzLabel from "../EzLabel.tsx";
import _ from "lodash";

interface MultiInputProps {
    signal: any;
    onOptionSubmit: (value: string[]) => void;
    value: string[];
    props: any;
    combobox: any;
    clearable: boolean;
    searchable: boolean;
    fromDb: boolean;
    getData: () => Promise<void>;
    handleValueSelect: (val: string) => void;
}

const MultiInput =
    forwardRef<HTMLInputElement, MultiInputProps>(({
        signal,
        onOptionSubmit,
        value,
        props,
        combobox,
        clearable,
        searchable,
        fromDb,
        getData,
        /*handleValueSelect*/
    },ref
        ) => {
            const handleValueRemove = (val: string) =>
                onOptionSubmit(value.filter((v: string) => v !== val));

            const values = value.map((item: any) => (
                <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
                    {!isNaN(item) ? valueToLabel(props.url, _.toNumber(item)) : item}
                </Pill>
            ));

            return (
                <Stack flex={1} gap={2} style={{...props?.style}}>
                    {props.label && <EzLabel {...props}/>}
                    <Combobox.Target>
                        <PillsInput
                            ref={ref}
                            onClick={() => combobox.openDropdown()}
                            {...props?.inputProps?.w ? {
                                w: props.inputProps.w
                            } : {
                                flex: 1
                            }}
                            error={!!props.error}
                            rightSectionPointerEvents={(clearable && !value.length) ? 'none' : 'all'}
                            rightSection={
                                signal.loading ? (
                                    <Loader size={18}/>
                                ) : clearable && value.length ? (
                                    <CloseButton
                                        size="sm"
                                        onMouseDown={(event) =>
                                            event.preventDefault()}
                                        onClick={async () => {
                                            onOptionSubmit([]);
                                            signal.isSearching = false;
                                            signal.search = "";
                                            if (!combobox.dropdownOpened) combobox.openDropdown();
                                            if (searchable && fromDb) await getData();
                                            if (props.closeBtnCallBack) props.closeBtnCallBack()
                                        }}
                                        aria-label="Clear value"
                                    />
                                ) : (
                                    <Combobox.Chevron/>
                                )
                            }
                        >
                            <Pill.Group>
                                {values}

                                {/*free mode*/}

                                <Combobox.EventsTarget>
                                    <PillsInput.Field
                                        {...props.inputProps}
                                        onFocus={() => combobox.openDropdown()}
                                        onBlur={() => combobox.closeDropdown()}
                                        value={signal.search}
                                        placeholder={props.placeholder || "Pick value"}
                                        onChange={(event) => {
                                            combobox.updateSelectedOptionIndex();
                                            signal.search = event.currentTarget.value;
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Backspace' && signal.search.length === 0 && value.length > 0) {
                                                event.preventDefault();
                                                handleValueRemove(value[value.length - 1]);
                                            }
                                        }}
                                        variant={props.variant}



                                    />
                                </Combobox.EventsTarget>
                            </Pill.Group>
                        </PillsInput>
                    </Combobox.Target>
                    {props.error && <EzText size='xs' style={{color: 'var(--mantine-color-error)'}}>{props.error}</EzText>}
                </Stack>
            );
        }
);

MultiInput.displayName = "MultiInput";

export default MultiInput;