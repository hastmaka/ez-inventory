import {type ComponentType, type ReactElement} from 'react';
import {
    Checkbox,
    Flex,
    Group,
    LoadingOverlay,
    Pagination,
    Paper,
    Pill,
    ScrollArea,
    Select,
    Table,
    Text,
} from '@mantine/core';

interface DataTableColumn {
    accessorKey: string;
    header: string;
    cell?: (info: unknown) => unknown;
    size?: number;
}

interface DataTableState {
    loading: boolean;
    data: { list: unknown[]; total: number };
    pagination: { pageIndex: number; pageSize: number; page?: number };
    rowSelection: Record<string, boolean>;
    columns: DataTableColumn[];
    handlePagination: (p: { pageIndex: number; pageSize: number }) => void;
    onRowClick: (row: { id: string; original: unknown }) => void;
    onRowSelectionChange: (sel: Record<string, boolean>) => void;
    getPages: (p: unknown) => number;
    onDoubleClick?: (row: unknown) => void;
}

interface DataTableNewProps {
    state: DataTableState;
    rowId: string;
    toolbar?: ReactElement;
    actions?: { comp: ComponentType<{ state: DataTableState; row: unknown }>; itemCount: number };
    withRowSelection?: boolean;
    fromTab?: boolean;
}

const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];

export function DataTable({
    state,
    rowId,
    toolbar,
    actions,
    withRowSelection,
    fromTab,
}: DataTableNewProps) {
    const {
        loading,
        data,
        pagination,
        rowSelection,
        columns,
        handlePagination,
        onRowClick,
        onDoubleClick,
    } = state;

    const ActionsComp = actions?.comp;
    const list = data.list as Record<string, unknown>[];
    const totalPages = state.getPages(pagination) || 1;
    const scrollHeight = `calc(100dvh - ${fromTab ? '180px' : '220px'})`;

    const isAllSelected = list.length > 0
        && list.every((row) => rowSelection[String(row[rowId])]);

    const handleSelectAll = () => {
        if (isAllSelected) {
            state.onRowSelectionChange({});
        } else {
            const next: Record<string, boolean> = {};
            for (const row of list) {
                next[String(row[rowId])] = true;
            }
            state.onRowSelectionChange(next);
        }
    };

    const handleRowCheck = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const next = {...rowSelection};
        if (next[id]) {
            delete next[id];
        } else {
            next[id] = true;
        }
        state.onRowSelectionChange(next);
    };

    const renderCell = (col: DataTableColumn, rowData: Record<string, unknown>) => {
        if (!col.cell) {
            return String(rowData[col.accessorKey] ?? '');
        }

        const cellInfo = {
            row: {original: rowData, id: String(rowData[rowId])},
            getValue: () => rowData[col.accessorKey],
        };

        return col.cell(cellInfo) as React.ReactNode;
    };

    return (
        <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
            {toolbar}
            <Paper
                radius="md"
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    overflow: 'hidden',
                    border: '0.0625rem solid var(--mantine-color-default-border)',
                }}
            >
                <LoadingOverlay
                    visible={loading}
                    overlayProps={{
                        backgroundOpacity: 0.15,
                    }}
                />
                <ScrollArea h={scrollHeight} type="auto">
                    <Table
                        striped
                        highlightOnHover
                        horizontalSpacing="md"
                        verticalSpacing="md"
                        stickyHeader
                    >
                        <Table.Thead
                            style={{backgroundColor: 'var(--mantine-color-body)'}}
                        >
                            <Table.Tr>
                                {withRowSelection && (
                                    <Table.Th style={{width: 40}}>
                                        <Checkbox
                                            checked={isAllSelected}
                                            indeterminate={
                                                !isAllSelected
                                                && Object.keys(rowSelection).length > 0
                                            }
                                            onChange={handleSelectAll}
                                            style={{cursor: 'pointer'}}
                                        />
                                    </Table.Th>
                                )}
                                {columns.map((col) => (
                                    <Table.Th
                                        key={col.accessorKey}
                                        style={col.size ? {width: col.size} : undefined}
                                    >
                                        {col.header}
                                    </Table.Th>
                                ))}
                                {ActionsComp && (
                                    <Table.Th
                                        style={{width: (actions?.itemCount ?? 1) * 20 + 40}}
                                    >
                                        Actions
                                    </Table.Th>
                                )}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {list.length === 0 && !loading ? (
                                <Table.Tr>
                                    <Table.Td
                                        colSpan={
                                            columns.length
                                            + (withRowSelection ? 1 : 0)
                                            + (ActionsComp ? 1 : 0)
                                        }
                                    >
                                        <Text ta="center" c="dimmed" py="lg">
                                            No data found.
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                list.map((rowData) => {
                                    const id = String(rowData[rowId]);
                                    return (
                                        <Table.Tr
                                            key={id}
                                            style={{cursor: 'pointer'}}
                                            onClick={() => onRowClick({id, original: rowData})}
                                            onDoubleClick={
                                                onDoubleClick
                                                    ? () => onDoubleClick(rowData)
                                                    : undefined
                                            }
                                            bg={
                                                rowSelection[id]
                                                    ? 'var(--mantine-color-default-hover)'
                                                    : undefined
                                            }
                                        >
                                            {withRowSelection && (
                                                <Table.Td>
                                                    <Checkbox
                                                        checked={!!rowSelection[id]}
                                                        onChange={() => {
                                                        }}
                                                        onClick={(e) => handleRowCheck(e, id)}
                                                        style={{cursor: 'pointer'}}
                                                    />
                                                </Table.Td>
                                            )}
                                            {columns.map((col) => (
                                                <Table.Td key={col.accessorKey}>
                                                    {renderCell(col, rowData)}
                                                </Table.Td>
                                            ))}
                                            {ActionsComp && (
                                                <Table.Td>
                                                    <ActionsComp state={state} row={rowData}/>
                                                </Table.Td>
                                            )}
                                        </Table.Tr>
                                    );
                                })
                            )}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>

                <Flex
                    justify="space-between"
                    align="center"
                    p="1rem"
                    gap={8}
                    style={{
                        borderTop: '1px solid var(--mantine-color-default-border)',
                        borderBottomLeftRadius: 'var(--mantine-radius-md)',
                        borderBottomRightRadius: 'var(--mantine-radius-md)',
                    }}
                >
                    <Group>
                        <Pill
                            size="lg"
                            style={{
                                border: '0.0625rem solid #00000010',
                                backgroundColor: 'var(--mantine-color-default-hover)',
                            }}
                        >
                            Total: {data.total}
                        </Pill>
                        <Pill
                            size="lg"
                            style={{
                                border: '0.0625rem solid #00000010',
                                backgroundColor: 'var(--mantine-color-default-hover)',
                            }}
                        >
                            Showing: {list.length}
                        </Pill>
                    </Group>

                    <Group>
                        <Flex direction="row" align="center" gap={8}>
                            <Text>Page Size</Text>
                            <Select
                                value={String(pagination.pageSize)}
                                data={PAGE_SIZE_OPTIONS}
                                w={80}
                                onChange={(pageSize) =>
                                    handlePagination({
                                        pageSize: pageSize ? +pageSize : 10,
                                        pageIndex: 0,
                                    })
                                }
                            />
                        </Flex>
                        <Pagination
                            size="md"
                            total={totalPages}
                            value={pagination.pageIndex + 1}
                            onChange={(pageIndex) =>
                                handlePagination({
                                    ...pagination,
                                    pageIndex: pageIndex - 1,
                                })
                            }
                        />
                    </Group>
                </Flex>
            </Paper>
        </div>
    );
}
