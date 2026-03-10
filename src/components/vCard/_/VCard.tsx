import ImageProfile from "../../../ezMantine/cropImageTool/ImagePreview.tsx";
// import ImageCompany from "./ImageCompany.tsx";
// import Content from "./Content.tsx";
import AddToContact from "./AddToContact.tsx";
import {Stack} from "@mantine/core";
import classes from "../vCard.module.scss";
import {DashboardController} from "@/controller/DashboardController.ts";

function VCard() {
    const {styleSelected, formData} = DashboardController
    return (
        <Stack className={classes[styleSelected]}>
            <ImageProfile
                imgPath={(formData!.photo as { base64: string })?.base64}
                className={classes['img-profile-container']}
            />
            {/*<ImageCompany
                imgPath={(formData.companyLogo as { base64: string })?.base64}
                className={classes['img-company-container']}
            />*/}
            {/*<Content className={classes['content']}/>*/}
            <AddToContact
                className={classes['add-to-contact']}
                data-tooltip="Add to your contacts"
            />
        </Stack>
    );
}

export default VCard;