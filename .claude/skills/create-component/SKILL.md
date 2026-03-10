---
name: create-component
description: Create a new React component following project rules.
disable-model-invocation: true
user-invocable: true
argument-hint: <ComponentName> [description]
---

# Create Component

Create the component described in `$ARGUMENTS`.

## Before You Start

Read these reference files and follow them exactly:

1. `.claude/client/component-rules.md` — mandatory constraints
2. `.claude/client/imports.md` — import grouping order
3. `.claude/client/architecture.md` — path alias, file organization
4. `.claude/client/directory-structure.md` — where files go

## File Placement

- Mantine wrapper → `src/ezMantine/`
- Generic reusable → `src/components/`
- Feature-specific → `src/view/<feature>/`

If unclear, ask.

## Component Structure

```tsx
interface ComponentNameProps {
  // explicit typed props
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  return (
    // JSX only — no business logic
  );
}
```

## Steps

1. **Parse** — extract component name and purpose from args.
2. **Check** — look in `src/components/` and `src/ezMantine/` for similar existing components to avoid duplication.
3. **Create** — write the component file in the correct location.
4. **Verify** — re-read the file and confirm all rules from `component-rules.md` are respected.
