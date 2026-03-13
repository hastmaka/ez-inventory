export function onRowClick(
    this: any,
    row: any,
){
    const id = row.id;
    if (this.rowSelection[id]) {
        delete this.rowSelection[id];
    } else {
        this.rowSelection[id] = true;
    }
}

