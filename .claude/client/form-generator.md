# FormGenerator

Renders forms from field definitions with layout control:
```typescript
<FormGenerator field={FIELDS} structure={[2, 1, 3]}
    handleInput={(name, value) => handleInput('formType', name, value)}
    formData={formData?.['formType']} errors={errors?.['formType']} />
```

## Supported Field Types
`string`, `number`, `phone`, `textarea`, `select` (remote via EzSelect), `select-local`, `multi-select-local`, `multi-select-free-local`, `checkbox`, `autocomplete`, `date`, `datePickerInput`, `dateTimePicker`, `time`, `year`, `file`, `component`.

## Remote Selects
Use `type: 'select'` with `fieldProps.url`:
```typescript
{ name: 'select_status', label: 'Status', type: 'select', fieldProps: { url: 'v1/asset/ENTITY_STATUS' } }
```
