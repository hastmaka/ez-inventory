import _ from 'lodash';
import { useLayoutEffect, useRef } from 'react';
import {
    Combobox,
    useCombobox,
    Group, CheckIcon,
} from '@mantine/core';
import MultiInput from './multi/MultiInput.tsx';
import MultiDropdown from "./multi/MultiDropdown.tsx";
import RegularInput from './regular/RegularInput.tsx';
import RegularDropdown from "./regular/RegularDropdown.tsx";
import { useDebouncedCallback } from '@mantine/hooks';
import { deepSignal } from 'deepsignal/react';
import { FetchApi } from '@/api/FetchApi.ts';
import {normalizedData} from "@/util/normalizedData.ts";
import {AppController} from "@/AppController.ts";
import {hasRequiredKeys} from "@/util";

/**
 * This component can work as remote or local or as a hybrid:
 * If you want to work local or need to manage the states outside for any reason, need to pass
 * data,loading and value.
 *
 * To work remote just pass the url and the iterator, like an obj {value: 'specify value',label:
 * 'specify label'}, just in case the data does not come with that format. In case of working with
 * static assets, pass just url, in case of working with db, pass url and fromDb as true and id to
 * get the data when in edit mode.
 *
 * ex: fromDb
 * {
 *         name: "caregiver_sex",
 *         label: "Sex",
 *         type: "select",
 *         fieldProps: {
 *             url: "v1/asset/address_type",
 *             iterator: {label: 'asset_option_name', value: 'asset_option_code'},
 *             autoClose: true,
 *             multiselect: true,
 *         },
 *     },
 *
 * ex: local
 * {
 *         name: "caregiver_sex1",
 *         label: "Sex",
 *         type: "select",
 *         fieldProps: {
 *             autoClose: true,
 *             fromDb: false,
 *             data: [{value: '1', label: '1'},{value: '2', label: '2'}]
 *         },
 *     },
 */

type Props = {
    /** this is the value return when an option is selected*/
    onOptionSubmit: (val: any) => void;
    /** initial value (if any)*/
    value: any;
    /** this is the field we are going to use to filter on server*/
    filterField?: string;
    /** local filter strategy*/
    filterLocal?: boolean;
    /** by default, we fetch from the server every time*/
    fetchEveryTime?: boolean;
    /** url where the component is going to load the data in case of fromDb*/
    url?: string;
    /** when need to filter on the server*/
    queryParams?: Record<string, any>;
    /** in case you need the data from db outside the component*/
    callback?: (data: any) => void;
    /** this is the static data in case of working locally*/
    data?: any[];
    /** to pass props to the Combobox (root component)*/
    comboProps?: Record<string, any>;
    /** self*/
    searchable?: boolean;
    clearable?: boolean;
    label?: string;
    placeholder?: string;
    loading?: boolean;
    required?: boolean;
    error?: string | boolean;
    /** this tells you where to look when the data is nested*/
    path?: string;
    /** in case the data comes from server with different format
     * {whereverKey: 'value', whereverKey: 'value'}
     * we need to specified what these keys are to normalize the data to
     * {
     *   label: what the dropdown it's going to show
     *   value: value we need to send to the server
     * }
     * */
    iterator?: { label: string; value: string };
    /** define the mode of the select*/
    fromDb?: boolean;
    /** */
    variant?: string;
    /** to work as multiple*/
    multiselect?: boolean;
    /** multiple letting you add custom values*/
    freeMode?: boolean;
    min?: number;
    max?: number;
    autoClose?: boolean;
    /** in case of need the info icon with a tooltip*/
    info?: string;
    /** callback when close button is pressed*/
    closeBtnCallBack?: () => void;

    [key: string]: any;
}

async function getAsyncData(url: string): Promise<any> {
    return await FetchApi(url, 'GET' );
}

async function filterFn(
    url: string,
    queryParams: Record<string, any>
): Promise<any> {
    return await FetchApi(url, 'GET', null, queryParams);
}

export default function EzSelect({
    onOptionSubmit,
    value,
    // filterField,
    filterLocal = true,
    fetchEveryTime = true,
    fromDb = true,
    searchable = true,
    clearable = true,
    multiselect = false,
    autoClose = true,
    freeMode = false,
    iterator = {label: 'asset_option_name', value: 'asset_option_code'},
    ...props
}: Props) {
    // local fromDb: false
    // like a simple local select need data:[1,2,3]
    // multiselect local data have to have values data: [1,2,3]
    // multiselect + freeMode data can have values or not, doesn't matter
    // DON'T TOUCH ANY VALIDATION
    if (!fromDb && multiselect) {
        if (!freeMode && !_.isArray(props.data) && !props.data?.length) throw new Error('If freeMode is false, data must be provided');
        // throw new Error('EzSelect: To work local need to provide data []');
    }
    if (fromDb && !props.url) {
        throw new Error('EzSelect: To work as remote select, it must provide url and must be a string or fromDB: false');
    }
    if (multiselect) {
        if (!_.isArray(value)) throw new Error('EzSelect: To work as multiselect, value must be an array');
    } else {
        // Single select accepts object {label, value} or null/undefined
        if (value && !_.isObject(value) && !_.isString(value)) {
            throw new Error('EzSelect: To work as single select, value must be an object {label, value} or string');
        }
    }
    // DON'T TOUCH ANY VALIDATION

    const signal = useRef(deepSignal({
        data: [] as any[],
        search: '',
        setSearch: (value: any) => signal.search = value,
        loading: true,
        isSearching: false,
        // storeName: fromDb && props.url,
        lastUrlUsed: '',
        exactOptionMatch: false
    })).current;

    useLayoutEffect(() => {
        signal.data = freeMode ? [] : props.data || [];
        signal.loading = props.loading || false;
    }, [props.data, props.loading]);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: async () => {
            if (!fromDb && props.data?.length) {
                return signal.data = props.data
            }
            if (!fetchEveryTime) {
                if (signal.data && signal.data.length > 0) {
                    signal.loading = false;
                    return combobox.resetSelectedOption();
                } else {
                    if (fromDb && (props.url !== signal.lastUrlUsed || signal.data.length === 0) && !signal.loading) {
                        await getData();
                    }
                }
            }
            await getData();
        }
    });

    const handleSearch =
        useDebouncedCallback(async () => {
            signal.loading = true;
            const response = await filterFn(props.url!, {queryParams: signal.search});
            signal.data = response.data;
            signal.loading = false;
        }, 500);

    const getData = async () => {
        signal.loading = true;
        const response = await getAsyncData(props.url!);
        if(props.callback) props.callback(response.data)
        if (!hasRequiredKeys(response.data)) {
            if (iterator) {
                signal.data = response.data.map((item: any) => ({
                    label: item[iterator?.label],
                    value: String(item[iterator?.value])
                }));
            } else {
                signal.data = normalizedData(response.data);
            }
        } else {
            signal.data = response.data;
        }

        //update stores and add the new one if is not there
        AppController.checkIfStoreExist(props.url, signal.data)

        signal.loading = false;
        signal.lastUrlUsed = props.url!;
        combobox.resetSelectedOption();
    };

    const options = () => {
        const data = normalizedData(signal.data)
        const filtered = data.filter((item: {value: string, label: string}) => {
                return item.label.toLowerCase().includes(signal.search.trim().toLowerCase())
            });

        // this is used to conditionally render the create option in case of freeMode active
        signal.exactOptionMatch = filtered.length > 0;

        if (filtered.length > 0) {
            return filtered.map(({ value: val, label }: {value: string, label: string}) => {
                // Handle object value {label, value} or string/array
                const currentValue = _.isObject(value) && !_.isArray(value) ? value.value : value;
                const isSelected = _.isArray(currentValue)
                    ? currentValue.includes(val) || currentValue.includes(label)
                    : String(currentValue) === String(val) || label === currentValue;
                return (
                    <Combobox.Option key={val} value={val}>
                        <Group gap="sm">
                            {isSelected ? <CheckIcon size={12} /> : null}
                            <span>{label}</span>
                        </Group>
                    </Combobox.Option>
                );
            });
        }

        return !freeMode ? <Combobox.Empty>Nothing found</Combobox.Empty> : null

    }

    const handleValueSelect = (val: string) => {
        let temp: string[] = [];
        if (val === "$create") {
            if (multiselect) {
                if (signal.data.some(({value}: {value: string}) =>
                    value.toLowerCase() === signal.search.toLowerCase())) return;
                if (signal.search.trim().length === 0) return;
                if (props.min && signal.search.trim().length < props.min) return
                signal.data = [...signal.data, {value: signal.search, label: signal.search}];
                temp = [...value, signal.search];
                onOptionSubmit(temp);
            } else {
                onOptionSubmit({label: signal.search, value: signal.search});
            }
        } else {
            if (multiselect) {
                temp = value.includes(val)
                    ? value.filter((v: string) => v !== val)
                    : [...value, val];
                onOptionSubmit(temp);
            } else {
                // Find the selected option to get both label and value
                const selectedOption = signal.data.find((opt: any) => String(opt.value) === String(val));
                onOptionSubmit(selectedOption ? {label: selectedOption.label, value: selectedOption.value} : {label: val, value: val});
            }
        }

        signal.search = "";
    };

    return (
        <Combobox
            store={combobox}
            offset={4}
            {...props.comboProps}
            onOptionSubmit={(val) => {
                signal.isSearching = false;
                if (autoClose) combobox.closeDropdown()
                handleValueSelect(val)
            }}
        >
            {multiselect
                ? (
                    <MultiInput
                        signal={signal}
                        onOptionSubmit={onOptionSubmit}
                        value={value}
                        props={props}
                        combobox={combobox}
                        fromDb={fromDb}
                        searchable={searchable}
                        clearable={clearable}
                        getData={getData}
                        handleValueSelect={handleValueSelect}
                    />
                )
                : (
                    <RegularInput
                        signal={signal}
                        props={props}
                        combobox={combobox}
                        onOptionSubmit={onOptionSubmit}
                        value={signal.search || value}
                        fromDb={fromDb}
                        searchable={searchable}
                        clearable={clearable}
                        filterLocal={filterLocal}
                        handleSearch={handleSearch}
                        getData={getData}
                        isObjectValue={!multiselect}
                    />
                )
            }

            {(signal.search.length > 0 || signal.data.length > 0) && <Combobox.Dropdown>
                <Combobox.Options>
                    {multiselect
                        ? <MultiDropdown options={options} signal={signal} freeMode={freeMode}/>
                        : <RegularDropdown options={options} signal={signal} freeMode={freeMode}/>
                    }
                </Combobox.Options>
            </Combobox.Dropdown>}
        </Combobox>
    );
}


// {searchable && /*!multiselect &&*/ (
//     <Combobox.Search
//         value={signal.search}
//         onChange={async (event) => {
//             signal.search = event.currentTarget.value;
//             if (!event.currentTarget?.value) {
//                 if (fromDb) await getData();
//             } else {
//                 if (!filterLocal) {
//                     if (event.currentTarget.value.length >= 3 && fromDb) {
//                         signal.isSearching = true;
//                         handleSearch();
//                     }
//                 }
//             }
//         }}
//         placeholder="Filter or Search (min 3 characters)"
//     />
// )}