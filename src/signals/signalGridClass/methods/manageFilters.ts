/**
 * manageFilters()
 * ----------------
 * Centralized filter handler used across all JMC data-table controllers.
 *
 * PURPOSE:
 * - Add or remove one or many filters.
 * - Maintain an internal active-filter map: this.store.filterFields.
 * - Automatically reset pagination and trigger data reload.
 *
 * PARAMETERS:
 * @param filters  A filter object or an array of filter objects.
 *                 Each filter must follow the structure:
 *                 {
 *                   fieldName: string;   // field used by backend to filter
 *                   value: any;          // filter value
 *                   operator?: string;   // optional ("=", "like", ">", "<", etc.)
 *                 }
 *
 * @param action   "add" | "remove"
 *                 - add: inserts/overwrites filter(s) into this.store.filterFields
 *                 - remove: deletes filter(s) by name
 *
 * INTERNAL BEHAVIOR:
 * 1. Normalizes argument to an array.
 * 2. Adds or removes filters depending on the `action`.
 * 3. Resets pagination to the first page.
 * 4. Sets loading = true.
 * 5. Calls fetchData() to reload table results using updated filters.
 *
 * EXAMPLES:
 *
 * // Add one filter
 * manageFilters.call({
 *   fieldName: "period",
 *   value: "2025-12-01",
 *   operator: '=' | '==' | 'like' | 'LIKE' | 'contains' | 'notLike' | 'NOTLIKE'
 *     | '<' | '<=' | '>=' | '>' | '!=' | 'in' | 'notin' | 'between' | '[]'
 * });
 *
 * // Add multiple filters
 * manageFilters.call([
 *   { fieldName: "period", value: "2025-12-01" },
 *   { fieldName: "reservation_status", value: 6 }
 * ]);
 *
 * // Remove one filter
 * manageFilters.call(this, { fieldName: "period" }, "remove");
 *
 * // Remove multiple filters
 * manageFilters.call([
 *   { fieldName: "period" },
 *   { fieldName: "status" }
 * ], "remove");
 */

type FilterFields = { fieldName: string; value: any; operator?: string }
export async function manageFilters(
    this: any,
    filters: FilterFields | FilterFields[],
    action: "add" | "remove" = "add"
) {
    const list = Array.isArray(filters) ? filters : [filters];

    if (action === "add") {
        list.forEach(f => {
            this.store.filterFields[f.fieldName] = f;
        });
    }

    if (action === "remove") {
        list.forEach(f => {
            delete this.store.filterFields[f.fieldName];
        });
    }

    this.loading = true;
    this.pagination.pageIndex = 0
    await this.fetchData();
}