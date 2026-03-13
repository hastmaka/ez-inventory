import type {CSSProperties, ReactNode} from "react"

interface EzGridProps extends CSSProperties {
    children: ReactNode
}

export default function EzGrid({ children, ...rest }: EzGridProps) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: ".5rem",
                ...rest
            }}
        >
            {children}
        </div>
    )
}