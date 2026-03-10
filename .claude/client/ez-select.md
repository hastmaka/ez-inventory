# EzSelect Pattern

## Value shape
EzSelect always stores `{label, value}`. Raw int/string = `[object Object]` bug.

## Asset selects (`select_*` prefix)
`{ name: 'select_status', type: 'select', fieldProps: { url: 'v1/asset/CANDIDATE_STATUS' } }`
`prepareForApi()` strips `select_*` prefix + extracts `.value`.

## FK selects (non-asset, real field name)
`{ name: 'pipeline_stage_stage_id', type: 'select', fieldProps: { url: 'v1/pipeline-stage', iterator: {label:'stage_name', value:'stage_id'} } }`
`prepareForApi()` extracts `.value` automatically for any `{label,value}` object.

## Model mapping (edit mode)
Use `render` to return `{label, value}` from the included relation. Never leave as `type:'int'`.
`{ name: 'pipeline_stage_stage_id', type: 'int', render: (_v, row) => row.stage?.stage_id ? {label: row.stage.stage_name, value: String(row.stage.stage_id)} : null }`
For assets: `{ name: 'select_status', type: 'object', mapping: '*_option', render: (_v,row) => row.*_option ? {label: row.*_option.asset_option_name, value: row.*} : null }`

## Controller
Don't manually map in `editMap` — the model `render` handles it.

## Inline forms (no model)
Manually build `{label, value}` when populating formData.
