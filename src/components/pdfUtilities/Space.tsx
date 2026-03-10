import FillTd from "./FillTd.tsx";

export default function Space({n = 10}: {n?: number}) {
    return <tr style={{height: '20px'}}>{FillTd(n)}</tr>
}