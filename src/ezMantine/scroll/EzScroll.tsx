import React, {forwardRef} from "react"
import {ScrollArea, type ScrollAreaProps} from "@mantine/core"

const SCROLL_PADDING = 10;

type EzScrollProps = ScrollAreaProps & {
    children: React.ReactNode,
    h?: string | number,
    needPaddingBottom?: boolean,
    [key: string]: any
}

interface EzScrollComponent extends React.ForwardRefExoticComponent<EzScrollProps & React.RefAttributes<HTMLDivElement>> {
    NeedContainer: React.FC<Omit<EzScrollProps, "h">>
}

const EzScroll = forwardRef<HTMLDivElement, EzScrollProps>(
    function EzScroll({children, h, needPaddingBottom=false, ...rest}, ref) {

        return (
            <ScrollArea.Autosize
                ref={ref}
                h={h}
                scrollbarSize={SCROLL_PADDING}
                type='always'
                scrollbars='y'
                pb={needPaddingBottom ? 54 : 0}
                {...rest}
                styles={{
                    root: {
                        flexGrow: 1,
                    },
                    viewport: {
                        padding: SCROLL_PADDING,
                    },
                    scrollbar: {
                        right: 0,
                        top: SCROLL_PADDING,
                        bottom: SCROLL_PADDING,
                    },
                }}
            >
                {children}
            </ScrollArea.Autosize>
        )
    }
) as unknown as EzScrollComponent

EzScroll.NeedContainer = ({
                              children,
                              ...props
                          }: Omit<EzScrollProps, "h">) => {
    return (
        <div
            style={{
                display: "flex",
                flex: 1,
                // border: '1px solid gray'
            }}
        >
            <EzScroll h="100%" {...props}>
                {children}
            </EzScroll>
        </div>
    );
};

export default EzScroll