# State Management (DeepSignal)

## Four classes
1. **SignalState** — Base class; wraps state with deep-clone reset.
2. **SignalController** — Extends SignalState for forms/modals/data fetching.
3. **SignalGridClass** — For MantineGrid: pagination, filtering, row selection. Requires `store: { model, filterFields, limit, api }`.
4. **SignalTabClass** — Tabbed navigation with session persistence. Methods: `setParentTabsList`, `setActiveTab`, `closeTab`.

## `*GetData` convention
Defining `async myGetData(this:any){...}` auto-creates `myData: []` and `myLoading: true`.

## Default props (SignalController)
`user`, `recordId`, `modal {loading, state}`, `formState`, `formData`, `dirtyFields`, `errors`

## Default methods (SignalController)
`handleInput`, `checkRequired`, `setErrors`, `modalData`, `resetState`, `populateForm`, `reloadView`, `checkFormValues`

## Component pattern
Destructure from controller → `useLayoutEffect(() => { myGetData().then(); }, [myGetData])` → `if (myLoading) return <EzLoader />`
