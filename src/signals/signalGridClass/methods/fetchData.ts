import {FetchApi} from "@/api/FetchApi.ts";

export async function fetchData(
    this: any
) {
    try {
        const query: Record<string, string | number> = {};

        query.offset = this.pagination.pageIndex * this.pagination.pageSize;
        query.limit = this.pagination.pageSize;

        // Apply filters if there's a search
        if (Object.keys(this.store.filterFields).length > 0) {
            query.filters = JSON.stringify(Object.values(this.store.filterFields))
        }

        const res = await FetchApi(this.store.api.read, undefined, null, query);
        this.updateGrid(res);
    } catch (error) {
        console.log(error);
    }
}