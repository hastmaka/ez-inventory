import type {Filter} from "@/types/filter";

export type GridStore = {
    model: {
        main: any
    },
    filterFields: Record<string, Filter>,
    limit: number,
    api: {
        read: string,
        create: string,
        update: string,
        delete: string,
    }
}