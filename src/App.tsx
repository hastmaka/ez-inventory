import {useLayoutEffect} from "react";
import {useNavigate} from "react-router-dom";
import Routes from "@/routes";
// import {AppController} from "@/AppController.ts";
// import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
// import {useMediaQuery} from "@mantine/hooks";
// import MobilRoutes from "@/routes/MobilRoutes.tsx";

function App() {
    // const matches = useMediaQuery('(min-width: 600px)');
    const navigate = useNavigate();
    // const { storeGetData, storeLoading} = AppController
    // useLayoutEffect(() => {storeGetData().then()}, []);

    useLayoutEffect(() => {
        window.navigate = navigate;
    }, [navigate]);

    // if(storeLoading) return <EzLoader h='100dvh'/>

    // return matches ? <Routes/> : <MobilRoutes />;
    return <Routes/>
}

export default App;