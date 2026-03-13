// import Con from './Con.tsx'
// import {
//     mailIcon,
//     phoneIcon,
//     webIcon,
//     facebookIcon,
//     instagramIcon,
//     youtubeIcon
// } from '../../../theme/Icons.tsx'
// import SocialContainer from "./SocialContainer.tsx";
// import classes from '../vCard.module.scss'
// import {DashboardController} from "@/controller/DashboardController.ts";
//
// function Content({
//     className
// }: {
//     className: string
// }) {
//     let {formData} = DashboardController
//     formData = formData!['v-card']
//
//     return (
//         <div className={className}>
//             <span>{formData?.prefix} {formData?.firstName} {formData?.additional} {formData?.lastName}</span>
//             <strong>{formData?.organization}</strong>
//             <p>{formData?.notes}</p>
//             <Con
//                 icon={mailIcon}
//                 text={formData?.workEmail}
//                 href={`mailto:${formData?.personalEmail}`}
//                 className={classes.con}
//             />
//             <Con
//                 icon={phoneIcon}
//                 text={formData?.cellPhone}
//                 href={`tel:+${formData?.phoneNumber}`}
//                 className={classes.con}
//             />
//             <Con
//                 icon={webIcon}
//                 text={formData?.workUrl}
//                 href={formData?.workUrl}
//                 className={classes.con}
//             />
//             <SocialContainer
//                 social={[
//                     {icon: facebookIcon, href: formData?.facebook},
//                     {icon: instagramIcon, href: formData?.instagram},
//                     {icon: youtubeIcon, href: formData?.youtube},
//                     // {icon: tiktokIcon, href: formData.youtube},
//                 ]}
//             />
//         </div>
//     );
// }
//
// export default Content;