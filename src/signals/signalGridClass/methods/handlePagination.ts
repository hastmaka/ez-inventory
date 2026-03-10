export function handlePagination(
    this: any,
    updatedPagination: any,
) {
    this.loading = true;
    this.search = this.searchValue
    this.pagination = updatedPagination
    this.fetchData();
}