export function setActiveTab(
    this: any,
    section: string,
    index: number,
) {
    const parentTab = this.activeParentTab;
    this.data[parentTab][section].activeTab = index.toString();
}