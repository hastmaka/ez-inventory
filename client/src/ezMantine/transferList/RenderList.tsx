import {
    ActionIcon, Center,
    Checkbox,
    Combobox,
    Group,
    ScrollArea,
    Stack,
    TextInput,
    Tooltip,
    useCombobox,
} from "@mantine/core";
import { useRef } from "react";
import classes from "./EzTransferList.module.scss";
import { deepSignal } from "deepsignal/react";
import EzText from "@/ezMantine/text/EzText.tsx";
import type {RenderListProps} from "@/types";
import { IconChevronRight, IconChevronsRight } from "@tabler/icons-react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";

function RenderList({
    options,
    active,
    onTransfer,
    onChange,
    type,
    placeholder,
    title,
    singleSelect,
    loading,
    ...rest
}: RenderListProps) {
    const combobox = useCombobox();
    const signal = useRef(
        deepSignal({
            active: active as string[],
            search: "",
            nothingFound: false,
        })
    ).current;

    const handleValueSelect = (val: string) => {
        if (singleSelect) {
            signal.active = [val];
        } else {
            if (signal.active.includes(val)) {
                signal.active = signal.active.filter((v) => v !== val);
            } else {
                signal.active = [...signal.active, val];
            }
        }
    };

    function items() {
        if (options.length === 0) return [];

        function filteredOptions(){
            if (signal.search) {
                const result = options.filter((item: any) =>
                    item.label.toLowerCase().includes(signal.search.toLowerCase().trim())
                );

                signal.nothingFound = result.length === 0;
                return result;
            }

            signal.nothingFound = false;
            return options;
        }

        return filteredOptions().map((item: any, index) => {
            return (
                <Combobox.Option
                    className={classes.option}
                    value={item.value}
                    key={index}
                    onClick={() => {
                        onChange!(item);
                    }}
                    {...(singleSelect
                        ? {
                            selected: active?.includes(item.label),
                        }
                        : {
                            active: active.includes(item.value),
                            onMouseOver: () => combobox.resetSelectedOption(),
                        })}
                >
                    {singleSelect ? (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <EzText style={{ fontWeight: 600 }}>{item.label} {`(${item.count})`}</EzText>
                            {item.description && (
                                <EzText style={{ fontSize: "0.85em" }}>{item.description}</EzText>
                            )}
                        </div>
                    ) : (
                        <Group gap="sm" align="flex-start">
                            <Checkbox
                                checked={active.includes(item.value)}
                                aria-hidden
                                onChange={() => {
                                    onChange!(item);
                                }}
                                tabIndex={-1}
                                style={{ pointerEvents: "none", marginTop: 4 }}
                            />
                            <div style={{ minWidth: "300px" }}>
                                <EzText style={{ fontWeight: 600 }}>{item.label}</EzText>
                                {item.description && (
                                    <EzText style={{ fontSize: "0.95em" }}>{item.description}</EzText>
                                )}
                            </div>
                        </Group>
                    )}
                </Combobox.Option>
            );
        });
    }

    return (
        <Stack data-type={type} gap={0} {...rest}>
            <EzText mb={8}>{title}</EzText>
            <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
                <Combobox.EventsTarget>
                    <Group wrap="nowrap" gap={0} className={classes.controls}>
                        <TextInput
                            placeholder={placeholder || "Search..."}
                            classNames={{ input: classes.input }}
                            flex={1}
                            value={signal.search}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (!value) {
                                    signal.nothingFound = false;
                                }

                                signal.search = event.target.value;
                                combobox.updateSelectedOptionIndex();
                            }}
                        />
                        {type && !singleSelect && (
                            <>
                                <Tooltip label="Transfer Selected">
                                    <ActionIcon
                                        radius={0}
                                        variant="default"
                                        size={36}
                                        className={classes.control}
                                        onClick={() => {
                                            if (onTransfer) onTransfer(signal.active);
                                        }}
                                        style={{
                                            borderTopLeftRadius: 0,
                                            borderTopRightRadius: 0,
                                        }}
                                    >
                                        <IconChevronRight className={classes.icon} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Transfer All">
                                    <ActionIcon
                                        radius={0}
                                        variant="default"
                                        size={36}
                                        className={classes.control}
                                        onClick={() => {
                                            if (onTransfer) onTransfer(signal.active);
                                        }}
                                        style={{
                                            borderTopLeftRadius: 0,
                                            borderTopRightRadius: 0,
                                        }}
                                    >
                                        <IconChevronsRight className={classes.icon} />
                                    </ActionIcon>
                                </Tooltip>
                            </>
                        )}
                        {type && (
                            <ActionIcon
                                radius={0}
                                disabled
                                variant="default"
                                size={36}
                                className={classes.control}
                                style={{
                                    border:
                                        "var(--ai-bd, calc(0.0625rem * var(--mantine-scale)) solid transparent)",
                                }}
                            >
                                <span>{options.length}</span>
                            </ActionIcon>
                        )}
                    </Group>
                </Combobox.EventsTarget>

                <div className={classes.list}>
                    <ScrollArea.Autosize mah={600} type="auto">
                        {loading ? <EzLoader h={600}/> : (
                            <Combobox.Options>
                                {signal.nothingFound
                                    ? <Center h={600}><Combobox.Empty>Nothing found....</Combobox.Empty></Center>
                                    : options.length > 0
                                    ?  items()
                                    : <Center h={600}><Combobox.Empty>Nothing selected....</Combobox.Empty></Center>
                                }
                            </Combobox.Options>
                        )}
                    </ScrollArea.Autosize>
                </div>
            </Combobox>
        </Stack>
    );
}

export default RenderList;