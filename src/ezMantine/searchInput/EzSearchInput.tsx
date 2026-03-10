import {IconSearch} from "@tabler/icons-react";
import {CloseButton, TextInput} from "@mantine/core";
import React, {type ChangeEvent, forwardRef, useImperativeHandle} from "react";
import {useEnterKeySubmit} from "@/util/hook";
// import {useClickOutside} from "@mantine/hooks";

interface EzSearchInputProps {
    state: {
        handleSearch: (value?: string) => Promise<void>;
    };
    [key: string]: any;
}

export interface EzSearchInputHandle {
    reset: () => void;
}

const EzSearchInput = forwardRef<EzSearchInputHandle, EzSearchInputProps>(
    ({ state, handleInput, value, ...rest }, ref) => {
        const inputRef:  React.RefObject<HTMLInputElement | null> = React.useRef(null);
        // const [value, setValue] = React.useState<string>('');
        const filterBy = state.store?.filterBy || []

        useImperativeHandle(ref, () => ({
            reset: () => {
                if (inputRef.current) {
                    inputRef.current.value = "";
                    inputRef.current.placeholder = "Search...";
                }
            }
        }));

        const handleSearch = async ({
                                        e,
                                        ref
                                    }: {
            e: KeyboardEvent | React.MouseEvent<SVGSVGElement>;
            ref?: React.RefObject<HTMLInputElement>
        }): Promise<any> => {
            const effectiveRef = ref ?? inputRef;
            const keyEvent = e as KeyboardEvent;
            const value =
                (keyEvent as KeyboardEvent).key === "Enter"
                    ? ref?.current?.value ?? ""
                    : inputRef.current?.value ?? "";

            // Normalize spaces: trim and collapse multiple spaces into one
            const normalizedValue = value.trim().replace(/\s+/g, " ");

            if (!normalizedValue) {
                if (effectiveRef.current) {
                    effectiveRef.current.placeholder = "Enter some value first";
                }
                return;
            }

            if (!/^[a-zA-Z0-9 ]+$/.test(normalizedValue)) {
                if (effectiveRef.current) {
                    effectiveRef.current.value = "";
                    effectiveRef.current.placeholder = "Only letters, numbers, and spaces allowed";
                }
                return;
            }

            if (normalizedValue.length <= 3) {
                if (effectiveRef.current) {
                    effectiveRef.current.value = "";
                    effectiveRef.current.placeholder = "Min 3 characters to start a search";
                }
                return;
            }

            const _filterBy = filterBy.map((f: string) => ({
                fieldName: f,
                value: normalizedValue,
                operator: 'contains',
                logic: 'or'
            }))

            if (effectiveRef.current) {
                effectiveRef.current.value = normalizedValue;
            }

            state.manageFilters(_filterBy)
        };

        const handleInputChange = async (e: ChangeEvent<HTMLInputElement>): Promise<any> => {
            const val = e.target.value;
            handleInput('search', val);

            if (!val) {
                if (inputRef.current) inputRef.current.placeholder = "Search...";
                state.manageFilters(filterBy.map((f: string) => ({fieldName: f})), 'remove')
            }
        };

        function handleCloseButton() {
            handleInput('search', '');
            state.manageFilters(filterBy.map((f: string) => ({fieldName: f})), 'remove')
        }

        useEnterKeySubmit(inputRef, handleSearch);

        return (
            <TextInput
                ref={inputRef}
                className="input"
                w={300}
                size="md"
                radius="4px"
                leftSection={
                    <IconSearch width="18px" onClick={(e) => handleSearch({ e })} />
                }
                placeholder="Search ..."
                onChange={handleInputChange}
                value={value}
                {...(value && {
                    rightSection: <CloseButton onClick={handleCloseButton} />
                })}
                {...rest}
            />
        );
    });

export default EzSearchInput
