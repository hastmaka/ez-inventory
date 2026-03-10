# Modal Pattern

- Always lazy-load components inside `window.openModal` and wrap in `<Suspense>`.
- Always use `SaveCancelDeleteBtns` for action buttons (never manual button pairs).
- If the lazy component exports static data (constants, fields), move those to a separate `.ts` file.

## Opening a modal
```typescript jsx
const MyForm = lazy(() => import('./MyForm.tsx'));
window.openModal({ modalId: 'my-modal', title: 'Edit',
    children: <Suspense fallback={<EzLoader h={'number'}/>}><MyForm /></Suspense>, onClose: () => {} });
```

## SaveCancelDeleteBtns
`<SaveCancelDeleteBtns cancel={onCancel} accept={onSave} label={{accept:'Save'}} acceptProps={{loading: saving}} />`

## modalData pattern (edit mode)
In `useLayoutEffect`: call `modalData('entity', FIELDS, entityId)`. Check `if (modal.loading) return <EzLoader />`.
Requires a Model with select field mappings (see `ez-select.md` §4).
