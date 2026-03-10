export async function modalData(
    this: any,
    type: string,
    fields: Record<string, any>[],
    id?: string | number,
    who?: any,
    rest?: any
): Promise<void> {
    this.modal.loading = true;
    if (id !== undefined && id !== null) {
        const map = this.editMap;
        if (!map || typeof map !== 'object' || typeof map[type] !== 'function') {
            throw new Error('editMap is required and must contain a handler for the given type');
        }

        await map[type](fields.map((field) => field.name), id, who, rest);
    }

    this.modal = {
        ...this.modal,
        loading: false,
        state: id ? 'editing' : 'creating',
    };
}