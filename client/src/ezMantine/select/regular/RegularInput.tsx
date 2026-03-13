import _ from "lodash";
import {forwardRef} from "react";
import {CloseButton, Combobox, InputBase, Loader} from "@mantine/core";
import {valueToLabel} from "@/util/convertData";
import EzLabel from "@/ezMantine/select/EzLabel.tsx";

interface RegularInputProps {
    signal: any;
    props: any;
    combobox: any;
    value: any;
    clearable: boolean;
    searchable: boolean;
    fromDb: boolean;
    getData: () => Promise<void>;
    onOptionSubmit: (value: any) => void;
    filterLocal?: boolean;
    handleSearch: () => void;
    isObjectValue?: boolean;
}

const RegularInput =
    forwardRef<HTMLButtonElement, RegularInputProps>(({
        signal,
        props,
        combobox,
        value,
        clearable,
        searchable,
        fromDb,
        getData,
        filterLocal,
        handleSearch,
        onOptionSubmit,
        isObjectValue,
    }, ref
        ) => {
            // Get display value: if object use label, if string use valueToLabel or raw value
            const getDisplayValue = () => {
                if (!value) return '';
                // If it's a search string (user typing), show it
                if (_.isString(value)) return value;
                // If it's an object {label, value}, use the label
                if (_.isObject(value) && value.label) return value.label;
                // Fallback to valueToLabel for legacy string IDs
                if (!isNaN(value)) return valueToLabel(props.url, _.toNumber(value));
                return value;
            };

            return (
                <Combobox.Target>
                    <InputBase
                        {...props.inputProps}
                        {...props?.inputProps?.w ? {
                            w: props.inputProps.w
                        } : {
                            flex: 1
                        }}
                        ref={ref}
                        placeholder={props.placeholder || "Pick value"}
                        disabled={props.disabled}
                        error={props.error}
                        variant={props.variant}
                        {...(props.label && {
                            label: <EzLabel {...props}/>
                        })}
                        value={getDisplayValue()}
                        onClick={() => combobox.openDropdown()}
                        onFocus={() => combobox.openDropdown()}
                        onBlur={() => combobox.closeDropdown()}
                        onChange={async (event) => {
                            signal.search = event.currentTarget.value;
                            if (!event.currentTarget?.value) {
                                if (fromDb) await getData();
                            } else {
                                if (!filterLocal) {
                                    if (event.currentTarget.value.length >= 3 && fromDb) {
                                        signal.isSearching = true;
                                        handleSearch();
                                    }
                                }
                            }
                        }}
                        rightSectionPointerEvents={(clearable && !value) ? "none" : 'all'}
                        rightSection={
                            signal.loading ? (
                                <Loader size={18}/>
                            ) : clearable && value ? (
                                <CloseButton
                                    size="sm"
                                    onMouseDown={(event) =>
                                        event.preventDefault()}
                                    onClick={async () => {
                                        onOptionSubmit(isObjectValue ? null : "");
                                        signal.isSearching = false;
                                        signal.search = "";
                                        if (!combobox.dropdownOpened) combobox.openDropdown();
                                        if (searchable && fromDb) await getData();
                                        if (props.closeBtnCallBack) props.closeBtnCallBack()
                                    }}
                                    aria-label="Clear value"
                                />
                            ) : (
                                <Combobox.Chevron style={{cursor: "pointer"}}/>
                            )
                        }
                        style={{...props?.style}}
                    />
                </Combobox.Target>
            );
        }
    );

RegularInput.displayName = "RegularInput";

export default RegularInput;