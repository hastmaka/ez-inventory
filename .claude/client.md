# Client Rules

Detailed guides live in `.claude/client/`. Each file is a self-contained reference.

**When working on a client-side task, read the relevant sub-file(s) below using their absolute path before making changes.**

| #  | File                                    | Description                                                                     |
|----|-----------------------------------------|---------------------------------------------------------------------------------|
| 1  | `.claude/client/stack.md`               | Tech stack, versions, and key dependencies                                      |
| 2  | `.claude/client/commands.md`            | Dev/build/lint npm scripts                                                      |
| 3  | `.claude/client/architecture.md`        | Path alias, API layer (FetchApi), component organization                        |
| 4  | `.claude/client/component-rules.md`     | EzText, Badge, Icons, Card, IconSize, GenericModal, EzScroll rules              |
| 5  | `.claude/client/method-signature.md`    | `function(this: any)` syntax, anti-patterns                                     |
| 6  | `.claude/client/modal.md`               | `window.openModal`, lazy loading, `SaveCancelDeleteBtns`, `modalData`           |
| 7  | `.claude/client/ez-select.md`           | Field naming (`select_*`), stored value shape, `prepareForApi()`, model mapping |
| 8  | `.claude/client/form-generator.md`      | Field definitions, `structure` layout, supported field types, remote selects    |
| 9  | `.claude/client/inline-edit.md`         | Profile section pattern, list item pattern, loading states                      |
| 10 | `.claude/client/ez-model.md`            | EzModel field types, type conversions, model template                           |
| 11 | `.claude/client/ez-delete.md`           | `EzDelete` usage with `window.toast.U`                                          |
| 12 | `.claude/client/state-management.md`    | SignalState, SignalController, SignalGridClass, SignalTabClass                  |
| 13 | `.claude/client/routing.md`             | `moduleDefinitions`, permissions, base paths, layout                            |
| 14 | `.claude/client/directory-structure.md` | Feature folder layout, where to add new code, naming conventions                |
| 15 | `.claude/client/firebase-storage.md`    | `uploadToFirebaseStorage`, `deleteFromFirebaseStorage`                          |
| 16 | `.claude/client/socket-io.md`           | Socket setup, handshake                                                         |
| 17 | `.claude/client/imports.md`             | Import grouping order                                                           |
| 18 | `.claude/client/environment.md`         | Env vars, `.env.{mode}` files, ESLint config, sessionStorage keys               |
