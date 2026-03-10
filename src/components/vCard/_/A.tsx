import type {ReactNode} from "react";

function A({
    href,
    children,
    ...rest
}: {
    href?: string | '#',
    children: ReactNode | string,
    download?: string,
    ['data-tooltip']?: string,
    className?: string,
    onClick?: () => void,
}) {
    return (
        <a
            target="_blank"
            rel="noopener noreferrer"
            href={href}
            {...rest}
        >
            {/*info@theboyssilver.com*/}
            {/*iglesiassilver@gmail.com*/}
            {children}
        </a>
    );
}

export default A;