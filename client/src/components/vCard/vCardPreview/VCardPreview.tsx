import ImageProfile from "../../../ezMantine/cropImageTool/ImagePreview.tsx";
import ImageCompany from "../_/ImageCompany.tsx";
import {Stack} from "@mantine/core";
import classes from "../vCard.module.scss";
import {DashboardController} from "@/controller/DashboardController.ts";
import type {VCard} from "@/types";
import ContentPreview from "./ContentPreview.tsx";

function VCardPreview({vcard}: {vcard: VCard}) {
    const {styleSelected, dashboardVCardHeight, vCardByIdGetData} = DashboardController

    const handleEdit = () => {
        vCardByIdGetData(vcard.id).then()
        window.navigate(`/app/vcard-edit/${vcard.id}`);
    }

    return (
        <Stack
            className={classes[styleSelected]}
            h={dashboardVCardHeight}
            style={{
                ['--preview-content-padding' as string]: '2rem 0',
                overflow: 'hidden'
            }}
            onClick={handleEdit}
        >
            <ImageProfile
                imgPath={vcard.photo.base64}
                className={classes['img-profile-container']}
            />
            <ImageCompany
                imgPath={vcard.companyLogo.base64}
                className={classes['img-company-container']}
            />
            <ContentPreview
                className={classes['content']}
                prefix={vcard.prefix}
                firstName={vcard.firstName}
                lastName={vcard.lastName}
                additional={vcard.additional}
                organization={vcard.organization}
            />

            {/*<Button*/}
            {/*    style={{*/}
            {/*        position: "absolute",*/}
            {/*        bottom: '1rem',*/}
            {/*        right: '1rem',*/}
            {/*    }}*/}
            {/*    onClick={handleEdit}*/}
            {/*>*/}
            {/*    EDIT*/}
            {/*</Button>*/}
        </Stack>
    );
}

export default VCardPreview;