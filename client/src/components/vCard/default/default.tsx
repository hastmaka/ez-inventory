import {Stack} from "@mantine/core";
import ImageProfile from "@/ezMantine/cropImageTool/ImagePreview.tsx";
import classes from "@/components/vCard/vCard.module.scss";
import ImageCompany from "@/components/vCard/_/ImageCompany.tsx";

function Default({
    className,
    formData
} : {
    className: string,
    formData: Record<string, any>,
}) {
    return (
        <Stack className={className}>
            <ImageProfile
                imgPath={(formData!['v-card']?.photo as { base64: string })?.base64 || ''}
                className={classes['img-profile-container']}
            />
            <ImageCompany
                imgPath={(formData!['v-card']?.companyLogo as { base64: string })?.base64 || ''}
                className={classes['img-company-container']}
            />
            <div className={classes['content']}>
                <span>{formData?.prefix} {formData?.firstName} {formData?.additional} {formData?.lastName}</span>
                <strong>{formData?.organization}</strong>
                <p>{formData?.notes}</p>
            </div>
        </Stack>
    );
}

export default Default;