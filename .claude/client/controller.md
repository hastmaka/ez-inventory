# Controller

Base: `SignalController` (forms/CRUD), `SignalGridClass` (grid), `SignalState` (auth), `deepSignal` (minimal).
Files: `view/<Feature>/<Feature>Controller.ts`, `<Feature>GridController.ts`, `<Feature>View.tsx`.

## Inline Structure

```typescript
import type { SignalType } from '@anthropic/signals';
import { SignalController } from '@/signals/signalController/SignalController';
import { FetchApi } from '@/api/FetchApi';

export const XController: SignalType<any, any> = new SignalController(
  { formData: {} as Record<string, unknown>, formDataCopy: {} as Record<string, unknown>, isLoading: false, readyToCheck: false, demoMode: false },
  {
    resetForm(this: any) { this.formData = { ...this.formDataCopy }; },
    async fetchRecord(this: any, id: string) {
      this.isLoading = true;
      const res = await FetchApi(`entity/${id}`, 'GET', undefined, { businessId: this.user.business_business_id });
      if (res.data) { this.formData = { ...res.data }; this.formDataCopy = { ...res.data }; this.readyToCheck = true; }
      this.isLoading = false;
    },
  },
).signal;
```

Injected defaults: `user`, `recordId`, `modal{loading,state}`, `formState`, `formData`, `dirtyFields`, `errors`, `reloadViewValues`.
`*GetData` method → auto-creates `*Data:[]` + `*Loading:true`.

## Rules

- `function(this:any)` always, never arrows. See [method-signature.md](method-signature.md).
- Spread every write: `this.x = {...this.x, ...update}`.
- `FetchApi` for HTTP, `getDataReadyForDb()` before send. See [architecture.md](architecture.md).
- `window.toast.S()/W()/E()` for feedback.
- CUD flow: validate→demoCheck→FetchApi→`GridController.updateGrid(res)`→toast.
- PUT: check `formStatus.isFormDirty` first. DELETE: id in URL.

## Grid

```typescript
import { SignalGridClass } from '@/signals/signalGridClass/SignalGridClass';
import type { GridStore } from '@/types/grid-store';
const gridStore: GridStore = { model:{main:class M{[k:string]:unknown;constructor(d:Record<string,unknown>){Object.assign(this,d)}}}, api:{read:'x',create:'x',update:'x',delete:'x'}, filterFields:{}, filterBy:['field1','field2'], limit:10 };
export const XGridController: any = new SignalGridClass({store:gridStore},{/*custom methods*/}).signal;
```

Auto-injected: `fetchData`, `handlePagination`, `getPages`, `updateGrid`, `manageFilters`, `onRowSelectionChange`, `onRowClick`.

## Dirty Tracking

```typescript
import { effect, untracked } from '@preact/signals-react';
effect(() => {
  if (XController.readyToCheck) {
    const d = findDifferences(XController.formDataCopy as Record<string,unknown>, XController.formData as Record<string,unknown>, ['exclude']);
    XController.formStatus = untracked(() => ({...XController.formStatus, isFormDirty:!!Object.keys(d).length, fields:d}));
    if (Object.keys(d).length) XController.cancelButtonState = false;
  }
});
```

`untracked()` prevents infinite loop. Place `effect()` after export, never inside methods.

## Do/Don't

Do: `function(this:any)`, spread updates, demoMode check, `GridController.updateGrid()`, `getDataReadyForDb()`, `effect()` after export, `untracked()` in effects, one controller per feature, `toast.S/W/E()`.
Don't: arrows in methods, mutate state, API in demo, rebuild grid manually, raw formData to API, effects inside methods, write tracked signals in own effect, merge features into one controller.
