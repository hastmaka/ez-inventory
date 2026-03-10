# Delete with Confirmation Pattern

Always use `EzDelete` for delete actions (never `window.toast.confirm`):
```typescript
import {EzDelete} from "@/components/form/EzDelete.tsx";

EzDelete({
    modalId: 'delete-item-modal',
    text: 'Delete Item: ' + item.item_name,
    handleDelete: async () => {
        await window.toast.U({
            id: { title: 'Deleting...', message: 'Please wait...' },
            update: { success: 'Item deleted.', error: 'Failed to delete.' },
            cb: async () => { await Controller.deleteItem(item.item_id); },
        });
    },
});
```
