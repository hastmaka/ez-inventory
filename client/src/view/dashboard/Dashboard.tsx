import _ from "lodash";
import {Card} from "@mantine/core";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./CustomReactGridLayout.css";
import {useEffect, useState} from "react";
import {LoginController} from "@/view/login/LoginController.ts";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// interface Props {
//     domElements: any[];
//     className?: string;
//     rowHeight?: number;
//     onLayoutChange?: (layout: any, layouts: any) => void;
//     cols?: any;
//     breakpoints?: any;
//     containerPadding?: number[];
// }

const defaultLayout = {
    "lg": [
        {
            "w": 3,
            "h": 2,
            "x": 0,
            "y": 0,
            "i": "new_costumers",
            "moved": false,
            "static": true
        },
        {
            "w": 3,
            "h": 2,
            "x": 3,
            "y": 0,
            "i": "projects",
            "moved": false,
            "static": false
        },
        {
            "w": 6,
            "h": 2,
            "x": 6,
            "y": 0,
            "i": "estimates_converted_to_projects",
            "moved": false,
            "static": false
        },
        {
            "w": 3,
            "h": 2,
            "x": 0,
            "y": 2,
            "i": "invoice",
            "moved": false,
            "static": false
        },
        {
            "w": 3,
            "h": 2,
            "x": 3,
            "y": 2,
            "i": "payments",
            "moved": false,
            "static": false
        },
        {
            "w": 6,
            "h": 2,
            "x": 6,
            "y": 2,
            "i": "average_revenue_per_project",
            "moved": false,
            "static": false
        }
    ]
}

function Dashboard(props: any) {
    const {user} = LoginController
    const [layouts, setLayouts] = useState<{ [index: string]: any[] }>(user?.user_preferences?.dashboard_layout || defaultLayout);
    const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("lg");
    const [compactType, /*setCompactType*/] = useState<string | null>("vertical");
    const [mounted, setMounted] = useState(false);
    const [toolbox, setToolbox] = useState<{ [index: string]: any[] }>({
        lg: []
    });

    useEffect(() => {setMounted(true)}, []);

    const onBreakpointChange = (breakpoint: any) => {
        setCurrentBreakpoint(breakpoint);
        setToolbox({
            ...toolbox,
            [breakpoint]: toolbox[breakpoint] || toolbox[currentBreakpoint] || []
        });
    };

    // const onCompactTypeChange = () => {
    //     let oldCompactType = "";
    //
    //     const compactType =
    //         oldCompactType === "horizontal"
    //             ? "vertical"
    //             : oldCompactType === "vertical"
    //                 ? null
    //                 : "horizontal";
    //     setCompactType(compactType);
    // };

    const onLayoutChange = (_layout: any, layouts: any) => {
        // console.log('layout: ', layout, 'layouts: ', layouts)
        setLayouts({ ...layouts });
    };

    const generateDOM = () => {
        return _.map(layouts.lg, function (l: any) {
            return (
                <Card
                    key={l.i}
                    shadow="xs"
                    // style={{ background: "#ccc" }}
                    className={l.static ? 'static' : ""}
                >
                    {l.static ? (
                        <span
                            className="text"
                            title="This item is static and cannot be removed or resized."
                        >
              Static - {l.i}
            </span>
                    ) : (
                        <span className="text">{l.i}</span>
                    )}
                </Card>
            );
        });
    };

    return (
        <div style={{width: "100%", height: "100%", maxWidth: "1600px", margin: "0 auto"}}>
            <ResponsiveReactGridLayout
                {...props}
                style={{ background: "#f0f0f0" }}
                layouts={layouts}
                containerPadding={[0, 0]}
                measureBeforeMount={false}
                useCSSTransforms={mounted}
                compactType={compactType}
                preventCollision={!compactType}
                onLayoutChange={onLayoutChange}
                onBreakpointChange={onBreakpointChange}
                isDroppable
            >
                {generateDOM()}
            </ResponsiveReactGridLayout>
        </div>
    );
}

export default Dashboard;