import {useRoutes} from "react-router-dom";
import Login from "@/view/login/Login.tsx";
import CheckSession from "@/routes/CheckSession.tsx";
import {lazy, Suspense} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {LoginController} from "@/view/login/LoginController.ts";
import {moduleDefinitions} from "@/routes/moduleDefinitions.ts";
import _ from "lodash";
import type {ModuleDefinition} from "@/types";
import EnRouter from "@/ezMantine/enRouter/EnRouter.tsx";
// dynamic imports
const Layout = lazy(() =>
    import("@/view/layout/mainLayout/Layout.tsx"));
const Dashboard = lazy(() =>
    import("@/view/dashboard/Dashboard.tsx"));
const AddProductFromPhone =
    lazy(() => import('@/view/jewelry/_fromPhone/FromPhone'))

function filterAccessibleModules(
    modules: ModuleDefinition[],
    userModules: number[]
):
    ModuleDefinition[]
{
    return _.chain(modules)
        .filter((m: ModuleDefinition) => userModules.includes(m.permission))
        .map((m: ModuleDefinition) => {
            const children = m.children
                ? filterAccessibleModules(m.children, userModules) : undefined;
            return { ...m, children };
        })
        .value();
}

function transformRoute(module: ModuleDefinition) {
    const route: any = { path: module.path };

    if (module.component) {
        const Component = module.component;
        route.element = (
            <Suspense fallback={<EzLoader h="100vh" />}>
                <Component />
            </Suspense>
        );
    }

    if (module.children && module.children.length > 0) {
        route.children = _.map(module.children, transformRoute);
    }

    return route;
}

export default function Routes() {
    const accessibleModules = filterAccessibleModules(moduleDefinitions, LoginController.userModules);
    const childrenRoutes = _.map(accessibleModules, transformRoute);
    return useRoutes([{
        path: '/login',
        element: <Login/>,
    }, {
        path: '/app',
        element: (
            <CheckSession>
                <Suspense fallback={<EzLoader h='100vh'/>}>
                    <Layout/>
                </Suspense>
            </CheckSession>
        ),
        children: [{
            index: true,
            path: '/app/dashboard',
            element: (
                <Suspense fallback={<EzLoader h='100vh'/>}>
                    <Dashboard/>
                </Suspense>
            ),
        }, ...childrenRoutes]
    }, {
        path: '/mobile-view',
        element: (
            <CheckSession>
                <Suspense fallback={<EzLoader h="100vh" />}>
                    <AddProductFromPhone />
                </Suspense>
            </CheckSession>
        ),
    }, {
        path: '/en-router',
        element: <EnRouter/>,
    }, {
        path: '/add-product-from-phone',
        element: (
            <Suspense fallback={<EzLoader h='100vh'/>}>
                <AddProductFromPhone/>
            </Suspense>
        )
    }, {
        path: '*',
        // element: <Navigate to="/app" replace />
        element: <CheckSession/>
        // element: <span>Route no found</span>
    }])
}