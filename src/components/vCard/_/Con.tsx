import type {ReactElement} from 'react';
import A from './A.tsx'

function Con({
    icon,
    text,
    href,
    className
}: {
    icon: () => ReactElement;
    text: string;
    href: string;
    className?: string
}) {
    return (
        <div className={className}>
            {icon()}
            <A href={href}>{text}</A>
        </div>
    );
}

export default Con;