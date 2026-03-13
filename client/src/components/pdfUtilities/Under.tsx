import React, {type ReactNode} from "react";

export default function Under({children, style, ...rest}: { children: ReactNode, style?: React.CSSProperties }) {
    return <span style={{textDecoration: 'underline', ...style}} {...rest}>{children}</span>
}