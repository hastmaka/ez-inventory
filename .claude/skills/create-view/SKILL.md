---
name: create-view
description: Create a full CRUD view (grid + modal) from a feature spec. Use when the user provides a feature name, fields, and API endpoints.
disable-model-invocation: true
user-invocable: true
argument-hint: <spec>
---

# Create View — CRUD Feature Generator

You will create a complete CRUD feature from the spec provided in `$ARGUMENTS`.

## Before You Start

Read these reference files in order — they define every pattern you must follow:

1. `.claude/client/directory-structure.md` — where files go
2. `.claude/client/state-management.md` — SignalGridClass, SignalController
3. `.claude/client/ez-model.md` — model definition
4. `.claude/client/form-generator.md` — FormGenerator + field definitions
5. `.claude/client/ez-select.md` — select field naming, mapping, prepareForApi
6. `.claude/client/modal.md` — modal pattern, lazy loading, SaveCancelDeleteBtns
7. `.claude/client/ez-delete.md` — delete pattern
8. `.claude/client/component-rules.md` — EzText, Card, Icon rules
9. `.claude/client/inline-edit.md` — if spec includes inline-edit
10. `.claude/client/firebase-storage.md` — if spec includes file fields
11. `.claude/client/imports.md` — import grouping order
12. `.claude/client/routing.md` — route registration

## Spec Format Expected

The user provides a spec like:

```
Feature: <name>
Type: CRUD (grid + modal)
Fields:
  - field_name (type, required?, notes)
  - select_field (select, required, url: v1/asset/ASSET_NAME)
  - date_field (date)
  - file_field (file, firebase)
API:
  - read: v1/<feature>
  - create: v1/<feature> (POST)
  - update: v1/<feature> (PUT)
  - delete: v1/<feature> (DELETE)
Special: any special behaviors
```

## Files to Create

For a feature called `certification`, create:

```
src/api/models/CertificationModel.ts          # EzModel with field types + select mappings
src/view/certification/Certification.tsx       # Main page (tab wrapper)
src/view/certification/CertificationController.ts  # SignalTabClass
src/view/certification/CertificationGrid.tsx   # MantineGrid with columns
src/view/certification/GridController.ts       # SignalGridClass with store config
src/view/certification/GridToolbar.tsx         # Toolbar with search
src/view/certification/GridActions.tsx         # Row action buttons (edit/delete)
src/view/certification/_modal/AddEditCertificationModal.tsx  # FormGenerator modal
src/view/certification/_modal/ModalController.ts             # SignalController for modal
```

## Steps

1. **Parse the spec** — extract feature name, fields, API urls, special behaviors.
2. **Find an existing CRUD feature** in `src/view/` to use as reference. Read its files to match patterns exactly.
3. **Create the Model** — in `src/api/models/`. Register it in `models/index.ts`.
4. **Create Grid + Controllers** — SignalGridClass with `store: { model, filterFields, limit, api }`.
5. **Create Modal + Controller** — FormGenerator fields, `modalData()`, `prepareForApi()`.
6. **Create Main page + Tab controller**.
7. **Register the route** in `routes/moduleDefinitions.ts`.
8. **Verify** — re-read each created file to ensure consistency with the reference patterns.

## Rules

- Follow every pattern in the `.claude/client/` docs exactly. No improvisation.
- Always find an existing CRUD feature in `src/view/` and use it as the implementation reference.
