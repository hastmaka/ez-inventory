import {type ReactNode} from "react";

export default function Whole({
    children, fw, span
}: {
    children: ReactNode,
    fw?: boolean,
    span?: number
}) {
    return (
        <tr>
            <td colSpan={span || 10} style={{padding: 0}}>
                <span style={{fontSize: '12px', fontWeight: fw ? 400 : 900}}>{children}</span>
            </td>
        </tr>
    )
}