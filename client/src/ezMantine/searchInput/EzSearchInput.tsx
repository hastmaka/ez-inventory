import {IconSearch} from "@tabler/icons-react";
import {CloseButton, TextInput} from "@mantine/core";
import React, {forwardRef, useImperativeHandle, useState} from "react";
import {useEnterKeySubmit} from "@/util/hook";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ state, handleInput: _hi, value: _v, ...rest }, ref) => {
        const inputRef: React.RefObject<HTMLInputElement | null> = React.useRef(null);
        const filterBy = state.store?.filterBy || [];
        const [hasValue, setHasValue] = useState(false);

        useImperativeHandle(ref, () => ({
            reset: () => {
                if (inputRef.current) {
                    inputRef.current.value = "";
                    inputRef.current.placeholder = "Search...";
                }
                setHasValue(false);
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
                setHasValue(false);
                return;
            }

            if (normalizedValue.length <= 3) {
                if (effectiveRef.current) {
                    effectiveRef.current.value = "";
                    effectiveRef.current.placeholder = "Min 3 characters to start a search";
                }
                setHasValue(false);
                return;
            }

            const _filterBy = filterBy.map((f: string) => ({
                fieldName: f,
                value: normalizedValue,
                operator: 'contains',
                logic: 'or'
            }));

            if (effectiveRef.current) {
                effectiveRef.current.value = normalizedValue;
            }

            state.manageFilters(_filterBy);
        };

        function handleClear() {
            if (inputRef.current) {
                inputRef.current.value = '';
                inputRef.current.placeholder = 'Search...';
            }
            setHasValue(false);
            state.manageFilters(filterBy.map((f: string) => ({fieldName: f})), 'remove');
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
                onChange={(e) => setHasValue(!!e.target.value)}
                {...(hasValue && {
                    rightSection: <CloseButton onClick={handleClear} />
                })}
                {...rest}
            />
        );
    });

export default EzSearchInput
