import { Center, Stack, Table } from "@mantine/core";
import table from "./EzTable.module.scss";
import ActionIconsToolTip from "@/ezMantine/actionIconTooltip/ActionIconsToolTip";
import { IconDatabaseOff } from "@tabler/icons-react";
import EzText from "@/ezMantine/text/EzText";
import React from "react";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";

// Types
interface HeadItem {
	name?: string;
	render?: (row: any) => React.ReactNode;
	style?: React.CSSProperties;
}

interface TdMapItem {
	name?: string;
	render?: (row: any, rowIndex: number) => React.ReactNode;
	style?: React.CSSProperties;
	w?: string | number;
}

interface Action {
	tooltip: string;
	icon: React.ReactNode;
	onClick: (row: any) => void;
}

interface Toolbar {
	component: React.ComponentType;
}

interface EzTableProps {
	height?: number | string;
	tableProps?: React.ComponentProps<typeof Table>;
	containerProps?: React.ComponentProps<typeof Stack>;
	toolbar?: Toolbar;
	head: (string | HeadItem)[];
	data: any[];
	tdMap: (string | TdMapItem)[];
	actions?: Action[];
	rowClick?: (row: any) => void;
	dataKey: string;
}

export default function EzTable({
	height = 300,
	tableProps,
	containerProps,
	toolbar,
	head,
	data,
	tdMap,
	actions,
	dataKey,
	rowClick,
}: EzTableProps) {
	const ToolBar = toolbar ? toolbar.component : undefined;

	const thead = head.map((item, index) => {
		const isObject = typeof item === "object";
		return (
			<Table.Th
				key={index}
				{...(typeof tdMap[index] === "object" && {
					w: (tdMap[index] as TdMapItem).w,
				})}
				{...(item === "Actions" && {
					w: "10%",
				})}
				style={{
					textAlign: "center",
					alignContent: "center",
					...(isObject ? item.style : {}),
				}}
			>
				{isObject && "render" in (item as HeadItem)
					? (item as HeadItem).render?.(data[index])
					: (
						<EzText fw="sm" style={{ textWrap: "nowrap" }}>
							{isObject ? (item as HeadItem).name : (item as string)}
						</EzText>
					)}
			</Table.Th>
		);
	});

	const rows =
		data &&
		data.length > 0 &&
		data.map((row, index2) => (
			<Table.Tr
				key={`${row[dataKey]}`}
				onClick={() => {
					if(rowClick)rowClick(row)
				}}
				{...(rowClick && {
					style: {
						cursor: "pointer",
					}
				})}
			>
				{tdMap.map((item, index) => {
					const isObject = typeof item === "object";
					return (
						<Table.Td
							key={index}
							style={{ textAlign: "center", ...(isObject ? item.style : {}) }}
						>
							{isObject && (item as TdMapItem).render
								? (item as TdMapItem).render?.(row, index2)
								: row[isObject ? (item as TdMapItem).name! : (item as string)]?.toString()}
						</Table.Td>
					);
				})}

				{actions && actions?.length > 0 ? (
					<Table.Td
						className={table.action}
						style={{
							width: `${actions.length * 40 + 112}px`,
							minWidth: `${actions.length * 40 + 112}px`,
						}}
					>
						<ActionIconsToolTip
							className="actions"
							justify="center"
							ITEMS={actions.map((action) => ({
								...action,
								onClick: () => action.onClick(row),
							}))}
						/>
					</Table.Td>
				) : null}
			</Table.Tr>
		));

	return (
		<Stack gap={0} className={table.container} {...containerProps}>
			{toolbar && ToolBar && <ToolBar />}
			{data && data.length > 0 ? (
				<EzScroll h={height} scrollbars='y'>
					<Table
						stickyHeader
						highlightOnHover
						className={table.table}
						style={{ "--is--action": actions?.length ? "center" : "left" } as React.CSSProperties}
						{...tableProps}
					>
						<Table.Thead>
							<Table.Tr>{thead}</Table.Tr>
						</Table.Thead>
						<Table.Tbody>{rows}</Table.Tbody>
					</Table>
				</EzScroll>
			) : (
				<Center h={height}>
					<Stack align="center">
						<IconDatabaseOff
							style={{
								width: "clamp(3.5rem, 3vw, 3.5rem)",
								height: "clamp(3.5rem, 3vw, 3.5rem)",
							}}
							color="gray"
							stroke={1}
						/>
						<EzText c="gray">No Data</EzText>
					</Stack>
				</Center>
			)}
		</Stack>
	);
}