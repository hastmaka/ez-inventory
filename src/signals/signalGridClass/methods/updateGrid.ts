export function updateGrid(
    this: any,
    res: {
        data: any[],
        dataCount: number,
    }
) {
    const {data, dataCount} = res;
    try {
        const transformedData = data.length ? data.map((item) => {
            return new this.store.model.main(item)
        }) : []
        this.data = {list: transformedData, total: dataCount}

        // Pagination always have to be updated after get the data from the server to work with the
        // latest data
        this.pagination = {
            ...this.pagination,
            page: this.getPages(this.pagination)
        };

        this.loading = false;
    } catch (e) {
        console.log(e)
    }
}