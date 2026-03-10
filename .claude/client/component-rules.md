# VERY IMPORTANT Component Rules

## Component Priority

1. `src/ezMantine/` — always check here first for an existing wrapper
2. Mantine native component — fallback if no ezMantine wrapper exists
3. `src/components/` — last resort, only if neither of the above applies

## Prop Restrictions

- **EzText** — use as-is, never pass `size` or `variant` props or in the last scenario **ask**
- **Badge, Icons** — never pass `size` or `variant` props
- **Card** — always use `shadow="none"`
- **IconSize** 24

## Separation of Concerns

- **No Logic inside components**
- **No Components inside Controllers**

## Controller Access

- **Destructure** all reads and methods at the top of the component
  `const { prop, method } = SomeController;`
- **Never** create an alias: ~~`const state = SomeController;`~~
- **Never** read directly: ~~`SomeController.prop`~~ or ~~`SomeController.method()`~~
- **Mutations** must use the controller name: `SomeController.prop = value;`
  (destructured primitives are local copies, not signal refs)
- **Spreading for grids** (`{...GridController}`) is acceptable

## Required Wrappers

- **For Modal use GenericModal**
- **For Scroll sections EzScroll**
