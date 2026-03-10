import {Flex, Group, Pagination, Pill, Select, Text} from "@mantine/core";
import {DataGrid} from "mantine-data-grid";
import classes from "./MantineGrid.module.scss";
import {type ComponentType, type ReactElement} from "react";

type MantineGridProps = {
	/** State object controlling data, columns, loading, etc. */
	state: any,
	/** Unique row ID accessor */
	rowId: string,
	/** Optional React element (toolbar) rendered above the grid */
	toolbar?: ReactElement,
	/** Optional row-level actions column */
	actions?: {
		/** React component to render in the Actions column */
		comp: ComponentType<any>,
		/** Number of items in the action component (affects column width) */
		itemCount: number,
	},
	/** when using the mantine grid on EzTabs, this control the grid height*/
	fromTab?: boolean,

	[key: string]: any
}

export default function MantineGrid({
	state,
	rowId,
	toolbar,
	actions,
	...rest
}: MantineGridProps) {
	const Actions = actions?.comp;
	const {fromTab, ...tRest} = rest
	const wrapperHeight = fromTab ? '180px' : '220px';
	// console.log(wrapperHeight)
	return (
		<div style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
			{/*<ToolBar state={state}/>*/}
			{toolbar}
			<DataGrid
				columns={[...state.columns, ...(actions?.comp ? [{
					header: 'Actions',
					size: actions.itemCount * 20 + 40,
					cell: (row: any) =>
						Actions ? <Actions state={state} row={row.row.original} /> : null,
				}] : [])]}
				data={state.data.list}
				total={state.data.total}
				// onPageChange={state.fetchData}
				// onSearch={handleSearch}
				highlightOnHover
				// withColumnResizing
				// withSorting
				verticalSpacing='md'
				withColumnFilters
				// withRowSelection
				onRowSelectionChange={state.onRowSelectionChange}
				withFixedHeader
				loading={state.loading}
				withPagination
				// pageSizes={["1", "5", "10", "15"]}
				// paginationMode
				state={{...state, rowId}}
				onRow={(row: any) => ({
					onClick: () => state.onRowClick(row),
					onDoubleClick(){
						if (!state.onDoubleClick) return
						state.onDoubleClick(row.original);
					}
				})}
				//this is the initial state in case of add some state that never change
				// initialState={{...state, rowId}}
				// debug //see debug
				components={{
					pagination: ({table}: {table: any}) => {
						const {pagination, handlePagination /*data*/} = table.getState()
						return (
							<Flex
								justify='space-between'
								align='center'
								p='1rem'
								gap={8}
								style={{
									borderTop: `1px solid var(--mantine-color-default-border)`,
									borderBottomLeftRadius: 'var(--mantine-radius-md)',
									borderBottomRightRadius: 'var(--mantine-radius-md)',
								}}
							>
								<Group>
									<Pill
										size="lg"
										style={{
											border: '0.0625rem solid #00000010',
											backgroundColor: 'var(--mantine-color-default-hover)'
										}}
									>Total: {state.data.total}</Pill>
									<Pill
										size="lg"
										style={{
											border: '0.0625rem solid #00000010',
											backgroundColor: 'var(--mantine-color-default-hover)'
										}}
									>Showing: {state.data.list.length}</Pill>
								</Group>

								<Group>
									<Flex direction='row' align='center' gap={8}>
										<Text>Page Size</Text>
										<Select
											// size='md'
											value={pagination.pageSize.toString()}
											data={['10', '20', '50', '100']}
											className={classes.select}
											onChange={(pageSize) => handlePagination({
												pageSize: pageSize ? +pageSize : 10,
												pageIndex: 0
											})}
										/>
									</Flex>
									<Pagination
										p={0}
										size="md"
										total={pagination?.page || table.getPageCount()}
										value={pagination?.pageIndex + 1}
										onChange={(pageIndex) => handlePagination({
											...pagination,
											pageIndex: pageIndex - 1
										})}
										className={classes.pagination}
										// withControls={false}
									/>
								</Group>
							</Flex>
						)
					}
				}}
				styles={{
					wrapper: {
						flex: 1,
						gap: 0,
						justifyContent: 'space-between',
						// border: `0.0625rem solid var(--mantine-color-default-border)`,
						borderBottomLeftRadius: 'var(--mantine-radius-sm)',
						borderBottomRightRadius: 'var(--mantine-radius-sm)',
						backgroundColor: 'var(--mantine-color-body)',
						// padding: '1rem'
						// borderRadius: 'var(--mantine-radius-sm)'
					},
					scrollArea: {
						paddingBottom: 0,
						// flex: 1,
						height: `calc(100dvh - ${wrapperHeight})`,
						'.mantine-LoadingOverlay-root': {
							div: {
								backgroundColor: 'light-dark(var(--mantine-color-overlay-1), var(--mantine-color-overlay-0))',
							}
						}
					},
					resizer: {
						borderRight: '0.0625rem solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
					},
					thead: {
						backgroundColor: 'var(--mantine-color-body)',
						'&:after': {
							backgroundColor: 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))',
						},
					},
					tbody: {
                        // tr: {
                        //     maxHeight: '40px !important', // this fix the flickering of the rows
                        // },
						td: {
							borderTop: 'transparent !important',
							borderBottom: '0.0625rem solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-6)) !important',
						}
					},
					th: {
						div: {
							color: 'var(--mantine-color-text)',
							fontSize: 'var(--mantine-font-size-sm)',
						},
						'.mantine-Checkbox-input:not(:checked)': {
							backgroundColor: 'var(--mantine-color-body)',
						}
					},
					td: {
						alignItems: 'center',
						backgroundColor: 'var(--mantine-color-body)',
						// borderTop: '0.0625rem solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4)) !important',
						color: 'var(--mantine-color-text)',
						'.mantine-Checkbox-input:not(:checked)': {
							backgroundColor: 'var(--mantine-color-body)',
						}
					},
					tr: {
						'&:hover': {
							td: {
								backgroundColor: 'var(--mantine-color-default-hover)',
							}
						},
					},
				}}
				{...tRest}
			/>
		</div>
	);
}