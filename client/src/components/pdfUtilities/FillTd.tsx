import _ from "lodash";

export default function FillTd(amount: number) {
    return _.times(amount, (i: any) => <td key={i}></td>);
}