import { ScrollArea, Table } from '@mantine/core';
import classes from './EzTableInfo.module.scss';
import u from "@/util";

/**
 * simple table only to show info
 * @type {{head: string[], caption: string, body: string[][]}}
 *
 * @example
 *
 */

interface HeaderMap {
	[key: string]: string;
}

interface EzTableInfoProps {
	height: number;
	tableData: Record<string, any>[];
	header: HeaderMap;
}

function convertToArrayOfArrays(
	data: Record<string, any>[],
	header: HeaderMap
): { head: string[]; body: string[][] } {
	let body: string[][] = [];
	let head: string[] = [];
	data.forEach((item, index) => {
		let row: string[] = [];
		Object.entries(header).forEach(([key, value]) => {
			if (index === 0) head.push(u.capitalizeWords(key));
			row.push(String(item[value]));
		});
		body.push(row);
	});
	return { head, body };
}

export default function EzTableInfo({ height, tableData, header }: EzTableInfoProps) {
	return (
		<ScrollArea h={height} type="always">
			<Table
				stickyHeader
				data={convertToArrayOfArrays(tableData, header)}
				highlightOnHover
				className={classes.table}
			/>
		</ScrollArea>
	);
}

/**
 * @typedef {Object} TableData
 * const tableData = {
 *     // caption: 'Some elements from periodic table',
 *     head: ['Name', 'Status', 'Reason'],
 *     body: [
 *         ['John Doe', 'Pending', 'Authorization Expired'],
 *         ['sarah Johnson', 'Active', 'Pending document approval'],
 *         ['Michael Smith', 'Pending', 'Task pending for this week'],
 *         ['Emely White', 'Active', 'Task overdue by 2 weeks'],
 *         ['Emely White', 'Pending', ''],
 *         ['John Doe', 'Active', ''],
 *         ['sarah Johnson', 'Pending', ''],
 *         ['Michael Smith', 'Active', ''],
 *         ['Emely White', 'Pending', ''],
 *         ['Emely White', 'Active', ''],
 *     ]
 * };
 */