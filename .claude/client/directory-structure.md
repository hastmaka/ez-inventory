# Feature Directory Structure

```
view/[feature]/
├── [Feature].tsx              # Main page component
├── [Feature]Controller.ts     # Tab/nav state (SignalTabClass)
├── [Feature]Grid.tsx / GridController.ts / GridToolbar.tsx / GridActions.tsx
├── [feature]View/             # Detail view
│   ├── [Feature]View.tsx / ViewController.ts / *Section.tsx
└── _modal/                    # AddEdit[Feature]Modal.tsx / ModalController.ts
```

## Where to Add New Code
- **CRUD feature:** model in `src/api/models/[Feature]Model.ts`, register in `models/index.ts`, view dir `src/view/[feature]/`, route in `routes/moduleDefinitions.ts`
- **Component:** Mantine-based → `src/ezMantine/`, generic → `src/components/`
- **Modal:** `src/view/[feature]/_modal/`
- **Utility:** `src/util/[utilityName].ts`
- **Signal method:** `src/signals/signal[Type]/methods/[methodName].ts`, register in `methods/index.ts`
