import {
    ActionIcon,
    Autocomplete, Checkbox, FileInput, Flex, Input,
    NumberInput, rem, Select,
    Stack, Textarea,
    TextInput
} from "@mantine/core";
import {DateInput, DatePickerInput, DateTimePicker, TimeInput, YearPickerInput} from "@mantine/dates";
import {formatPhoneNumber} from "@/util/formatPhoneNumber.ts";
import EzSelect from "@/ezMantine/select/EzSelect.tsx";
import {Fragment, useRef} from "react";
import {IconCalendarMonth, IconClock} from "@tabler/icons-react";
import type {FormField} from "@/types";
import EzLabel from "@/ezMantine/select/EzLabel.tsx";
import {EzMultiselectLocal} from "@/ezMantine/selectMultiLocal/EzMultiselectLocal.tsx";
import {EzMultiselectFreeLocal} from "@/ezMantine/selectMultiFreeLocal/EzMultiselectFreeLocal.tsx";
// import {capitalizeWords} from "@/util";

const splitArray = (arr: FormField[], lengths: number[]) => {
    const result = [];
    let index = 0;
    for (const length of lengths) {
        if (index + length <= arr.length) {
            result.push(arr.slice(index, index + length));
            index += length;
        } else {
            throw new Error(`FormGenerator - Structure doesn't match Fields, cannot split the array.`);
        }
    }
    return result;
}

// const getPlaceholderFromName = (str) => {
//     return str.split('_')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
// }

const variant = 'default';

export default function FormGenerator({
  field, handleInput, structure, formData, errors, ...rest
}: {
    field: FormField[];
    handleInput: (name: string, value: any, api?: boolean) => void;
    structure: number[],
    formData: Record<string, any>,
    errors: Record<string, any>,
    rest?: {
        inputContainer?: object,
        inputWrapper?: object,
        size?: string,
        setError?: (error: any) => void,
        required?: boolean
    }
} & {
    [key: string]: any;
}) {
    // to store the ref of the time picker
    const timeRef = useRef<Record<string, { showPicker?: () => void }>>({});

    const renderFieldsWithStyles = () => {
        const updateFields = splitArray(field, structure as number[]);
        return (
            <Stack flex={1} gap={8} {...(rest.inputContainer as object || {})}>
                {updateFields.map((item, index) => {
                    return (
                        <Flex
                            key={`group-${index}`}
                            align='flex-start'
                            // justify='space-between'
                            gap={8}
                            {...(rest.inputWrapper as object || {})}
                        >
                            {GenerateFields(item)}
                        </Flex>
                    )
                })}
            </Stack>
        )
    }

    const GenerateFields = (fieldData: FormField[]) => {
        return fieldData.map(({
            type='string',
            name,
            label,
            placeholder,
            options,
            fieldProps,
            component,
            ...inputRest
        }: FormField) => {
            const props = {label, ...inputRest}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {required, ...restT} = inputRest
            switch (type) {
                case 'component':
                    // Support function components that receive form props
                    if (typeof component === 'function') {
                        return (
                            <Fragment key={name}>
                                {component({
                                    name,
                                    value: formData?.[name],
                                    onChange: (val: any) => handleInput(name, val),
                                    error: errors?.[name],
                                    label,
                                    ...fieldProps
                                })}
                            </Fragment>
                        )
                    }
                    return <Fragment key={name}>{component}</Fragment>
                case 'string':
                { const stringProps = {...props, ...fieldProps}
                    return (
                        <TextInput
                            key={name}
                            variant={variant}
                            size={rest?.size || 'sm'}
                            {...fieldProps?.w ? {w: fieldProps.w} : {flex: 1}}
                            name={name}
                            label={<EzLabel {...stringProps}/>}
                            placeholder={placeholder || label}
                            // value={formData?.[name] ? capitalizeWords(formData?.[name], 'first') : ''}
                            value={formData?.[name] ?? ''}
                            onChange={(e) =>
                                handleInput(name, e.target.value as any)}
                            error={!!errors?.[name] || ''}
                            style={{...fieldProps?.style}}
                            {...restT}
                            {...fieldProps}
                        />
                    ) }
                case 'number':
                { const numberProps = {...props, ...fieldProps}
                    return (
                        <NumberInput
                            key={name}
                            label={<EzLabel {...numberProps}/>}
                            variant={variant}
                            size={rest?.size || 'sm'}
                            {...fieldProps?.w ? {w: fieldProps.w} : {flex: 1}}
                            placeholder={placeholder || label}
                            hideControls
                            value={formData?.[name] || ''}
                            onChange={(v) => handleInput(name, v as any)}
                            error={!!errors?.[name] || ''}
                            style={{...fieldProps?.style}}
                            {...restT}
                            {...fieldProps}
                        />
                    ) }
                case 'phone':
                { const phoneProps = {...props, ...fieldProps}
                    return (
                        <TextInput
                            key={name}
                            variant={variant}
                            size={rest?.size || 'sm'}
                            {...fieldProps?.w ? {w: fieldProps.w} : {flex: 1}}
                            name={name}
                            label={<EzLabel {...phoneProps}/>}
                            placeholder={placeholder || label}
                            value={formatPhoneNumber(formData?.[name]) || ''}
                            onChange={(e) => handleInput(name, formatPhoneNumber(e.target.value) as any)}
                            error={!!errors?.[name] || ''}
                            style={{...fieldProps?.style}}
                            {...restT}
                        />
                    ) }
                case 'textarea':
                { const textareaProps = {...props, ...fieldProps}
                    return (
                        <Textarea
                            key={name}
                            variant={variant}
                            label={<EzLabel {...textareaProps}/>}
                            size={rest?.size || 'md'}
                            {...fieldProps?.w ? {w: fieldProps.w} : {flex: 1}}
                            placeholder={placeholder || label}
                            value={formData?.[name] || ''}
                            onChange={(e) => handleInput(name, e.target.value as any)}
                            error={!!errors?.[name] || ''}
                            style={{...fieldProps?.style}}
                            {...restT}
                        />
                    ) }
                case 'select':
                { const selectProps = {...props, ...fieldProps}
                    return (
                        <EzSelect
                            key={name}
                            variant={variant}
                            size={rest?.size || 'sm'}
                            placeholder={placeholder || label}
                            data={options as any[]}
                            onOptionSubmit={(v: any) =>
                                handleInput(name, v as any)}
                            clearable
                            value={formData?.[name] || (fieldProps?.multiselect ? [] : '')}
                            error={!!errors?.[name] || ''}
                            //we have to send the flex property to the combobox
                            comboProps={{flex: fieldProps?.flex}}
                            {...selectProps}
                        />
                    ) }
                case 'select-local':
                { const selectPropsLocal = {...props, ...fieldProps}
                    return (
                        <Select
                            key={name}
                            {...fieldProps?.w ? {w: fieldProps.w} : {flex: 1}}
                            variant={variant}
                            size={rest?.size || 'sm'}
                            placeholder={placeholder || label}
                            data={options as any[]}
                            clearable
                            onChange={(v: any) =>
                                handleInput(name, v as any)}
                            value={formData?.[name] || null}
                            error={!!errors?.[name] || ''}
                            {...selectPropsLocal}
                        />
                    ) }
                case 'multi-select-local':
                { const multiSelectProps = {...props, ...fieldProps}
                    return (
                        <EzMultiselectLocal
                            key={name}
                            variant={variant}
                            size={rest?.size || 'sm'}
                            placeholder={placeholder || label}
                            data={options as any[]}
                            onOptionSubmit={(v: any) =>
                                handleInput(name, v as any)}
                            value={formData?.[name] || (fieldProps?.multiselect ? [] : null)}
                            error={!!errors?.[name] || ''}
                            {...multiSelectProps}
                        />
                    ) }
                case 'multi-select-free-local':
                { const multiSelectFreeProps = {...props, ...fieldProps}
                    return (
                        <EzMultiselectFreeLocal
                            key={name}
                            variant={variant}
                            size={rest?.size || 'sm'}
                            placeholder={placeholder || label}
                            data={options as any[]}
                            onOptionSubmit={(v: any) =>
                                handleInput(name, v as any)}
                            value={formData?.[name] || []}
                            error={!!errors?.[name] || ''}
                            {...multiSelectFreeProps}
                        />
                    ) }
                case 'checkbox':
                { const checkboxProps = {...props, ...fieldProps}
                    return (
                        <Checkbox
                            key={name}
                            variant={variant}
                            size={rest?.size || 'sm'}
                            {...fieldProps?.w ? {w: fieldProps.w} : {flex: 1}}
                            label={<EzLabel {...checkboxProps}/>}
                            placeholder={placeholder || label}
                            onChange={(e) => handleInput(name, e.target.checked as any)}
                            checked={formData?.[name] || false}
                            error={!!errors?.[name] || ''}
                            style={{...fieldProps?.style}}
                            {...restT}
                            {...fieldProps}
                        />
                    ) }
                case 'autocomplete':
                { const autocompleteProps = {...props, ...fieldProps}
                    return (
                        <Autocomplete
                            key={name}
                            variant={variant}
                            label={<EzLabel {...autocompleteProps}/>}
                            size={rest?.size || 'sm'}
                            {...fieldProps?.w ? {w: fieldProps.w} : {flex: 1}}
                            placeholder={placeholder || label}
                            data={options as any[]}
                            value={formData?.[name] || ''}
                            onChange={(v) => handleInput(name, v)}
                            error={!!errors?.[name] || ''}
                            style={{...fieldProps?.style}}
                            {...restT}
                        />
                    ) }
                case 'dateTimePicker':
                { const dateTimePickerProps = {...props, ...fieldProps}
                    return (
                        <DateTimePicker
                            key={name}
                            clearable
                            label={<EzLabel {...dateTimePickerProps}/>}
                            variant={variant}
                            size={rest?.size || 'sm'}
                            {...fieldProps?.w ? {w: fieldProps.w} : {flex: 1}}
                            rightSection={<IconCalendarMonth/>}
                            rightSectionPointerEvents='none'
                            placeholder={placeholder || label}
                            valueFormat="MMM DD YYYY hh:mm A"
                            value={formData?.[name] || null}
                            onChange={(v) => handleInput(name, v as any)}
                            error={!!errors?.[name] || ''}
                            style={{...fieldProps?.style}}
                            timePickerProps={{
                                withDropdown: true,
                                popoverProps: { withinPortal: false },
                                format: '12h',
                            }}
                            {...restT}
                        />
                    ) }
                case 'datePickerInput':
                { const datePickerInputProps = {...props, ...fieldProps}
                    return (
                        <DatePickerInput
                            key={name}
                            clearable
                            label={<EzLabel {...datePickerInputProps}/>}
                            rightSection={<IconCalendarMonth/>}
                            variant={variant}
                            size={rest?.size || 'sm'}
                            {...fieldProps?.w ? {w: fieldProps.w} : {flex: 1}}
                            placeholder={placeholder || label}
                            valueFormat="MMM DD YYYY"
                            rightSectionPointerEvents='none'
                            value={formData?.[name] || null}
                            onChange={(v) => handleInput(name, v)}
                            error={!!errors?.[name] || ''}
                            style={{...fieldProps?.style}}
                            {...restT}
                        />
                    ) }
                case 'date':
                { const dateProps = {...props, ...fieldProps}
                    return (
                        <DateInput
                            key={name}
                            clearable
                            label={<EzLabel {...dateProps}/>}
                            variant={variant}
                            size={rest?.size || 'sm'}
                            {...fieldProps?.w ? {w: fieldProps.w} : {flex: 1}}
                            rightSection={<IconCalendarMonth/>}
                            rightSectionPointerEvents='none'
                            placeholder={placeholder || label}
                            valueFormat="MMM DD YYYY"
                            value={formData?.[name] || null}
                            onChange={(v) => handleInput(name, v)}
                            error={!!errors?.[name] || ''}
                            style={{...fieldProps?.style}}
                            {...restT}
                        />
                    ) }
                case 'time': {
                    const timeProps = {...props, ...fieldProps}
                    const pickerControl = (
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            disabled={fieldProps?.disabled}
                            onClick={() => {
                                if (timeRef.current[name]?.showPicker) {
                                    timeRef.current[name].showPicker();
                                }
                            }}
                        >
                            <IconClock style={{width: rem(16), height: rem(16)}} stroke={1.5}/>
                        </ActionIcon>
                    );
                    return (
                        <TimeInput
                            key={name}
                            ref={(el) => {
                                if (el) { timeRef.current[name] = el }
                            }}
                            rightSection={pickerControl}
                            label={<EzLabel {...timeProps}/>}
                            variant={variant}
                            size={rest?.size || 'sm'}
                            {...fieldProps?.w ? {w: fieldProps.w} : {flex: 1}}
                            placeholder={placeholder || label}
                            value={formData?.[name] || ''}
                            onChange={(e) =>
                                handleInput(name, e.target.value)}
                            error={!!errors?.[name] || ''}
                            style={{...fieldProps?.style}}
                            {...restT}
                        />
                    )
                }
                case 'year': {
                    const yearProps = {...props, ...fieldProps}
                    return (
                        <YearPickerInput
                            key={name}
                            label={<EzLabel {...yearProps}/>}
                            variant={variant}
                            size={rest?.size || 'sm'}
                            {...fieldProps?.w ? {w: fieldProps.w} : {flex: 1}}
                            clearable
                            rightSection={<IconCalendarMonth/>}
                            placeholder={placeholder || label}
                            value={formData?.[name] || null}
                            onChange={(value) =>
                                handleInput(name, value)
                            }
                            error={!!errors?.[name] || ''}
                            {...restT}
                        />
                    )
                }
                case 'file': {
                    const fileProps = {...props, ...fieldProps}
                    return (
                        <FileInput
                            key={formData?.[name]?.file
                                ? formData[name].file.name + formData[name].file.lastModified
                                : `empty-${name}`}
                            accept="image/*"
                            label={<EzLabel {...fileProps}/>}
                            placeholder={placeholder || label}
                            // multiple={fieldProps?.multiple}
                            //this is the ref to the function that reset the file input
                            resetRef={fieldProps?.resetRef}
                            {...fieldProps?.w ? {w: fieldProps.w} : {flex: 1}}
                            value={(formData[name] as { file: File })?.file ?? null}
                            rightSection={formData[name] ? (
                                <Input.ClearButton onClick={fieldProps?.clearFileInput}/>
                            ) : null}
                            onChange={async file => fieldProps?.fileValidator?.(file)}
                            error={errors?.[name] || ''}
                            style={{...fieldProps?.style}}
                            {...restT}
                        />
                    )
                }
                default:
                    return null
            }
        })
    }

    if (structure && structure.length) {
        return renderFieldsWithStyles()
    } else {
        return GenerateFields(field)
    }
}


// <FormGenerator
//     field={FIELDS}
//     structure={[1]}
//     handleInput={(name: any, value: any) =>
//         handleInput('asset_option', name, value)}
//     formData={formData?.['asset_option']}
//     errors={errors?.['asset_option']}
// />