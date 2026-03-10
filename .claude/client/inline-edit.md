# Inline Edit with Fresh Data Fetch

**Rule:** Always fetch fresh data from the API before showing the edit form (prevents stale data).

## Profile pattern (single form per section)
1. `setLoading(true)` → call `Controller.profileGetData(id)` → read `Controller.profileData`
2. Populate `setFormData(...)` from fresh data → `setLoading(false)` → `setIsEditing(true)`
3. Render: `loading ? <EzLoader /> : isEditing ? <FormGenerator /> : <ViewMode />`

## List item pattern (phones, addresses, etc.)
1. Controller method: fetch single item via `FetchApi`, then call `this.startEditPhone(response.data)`
2. Component: `loadingId` state per item → `handleStartEdit(item)` fetches → `setEditingId(item.id)`
3. Render: `loadingId === id ? <EzLoader /> : editingId === id ? <EditForm /> : <ViewMode />`
