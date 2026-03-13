import {JewelryModalController} from "@/view/jewelry/_modal/JewelryModalController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {LoginController} from "@/view/login/LoginController.ts";
import {QRCodeCanvas} from "qrcode.react";
import {useEffect} from "react";

export default function GenerateQr() {
    const {codeGetData, codeData, codeLoading} = JewelryModalController
    const {user} = LoginController
    const url = import.meta.env.VITE_REACT_APP_URL

    useEffect(() => {
        codeGetData().then()
        return () => {
            JewelryModalController.codeData = []
            JewelryModalController.codeLoading = true
        }
    }, [codeGetData])

    if(codeLoading) return <EzLoader h={300}/>

    return (
        <div style={{padding:'.5rem'}}>
            <QRCodeCanvas
                value={`${url}en-router?user_id=${user.user_id}&code=${codeData.user_code}&url=/add-product-from-phone`}
                // value={`${url}work-force`}
                size={360}
            />
            <a
                href={`${url}en-router?user_id=${user.user_id}&code=${codeData.user_code}&url=/add-product-from-phone`}
                target='_blank'
                rel='noopener noreferrer'
                // target="_blank"
            >Go</a>
            {/*<a*/}
            {/*    href={`${url}test`}*/}
            {/*    // target="_blank"*/}
            {/*>Test</a>*/}
            {/*<button*/}
            {/*    onClick={() => window.navigate(`en-router?user_id=${user.user_id}&code=${code.data.user_code}&url=/add-product-from-phone`)}*/}
            {/*>Go</button>*/}
        </div>
    );
}
