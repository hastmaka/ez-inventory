export function getPages(
    this: any,
    updatedPagination: any
) {
    const {pageSize} = updatedPagination;
    const total = this.data.total;
    const a = total % pageSize;
    let page = total / pageSize;
    if(a !== 0) page = Math.ceil(page)
    return page
}