// import A from "./A.tsx";
// import {contactIcon} from "@/theme/Icons.tsx";
// import {Loader} from "@mantine/core";
// import {createVCard} from "@/util/createVCard.ts";
// import {downloadToFile} from "@/util/downloadFile.ts";
// import {deepSignal} from "deepsignal/react";
//
// const signal = deepSignal({
//     _c: false
// })
//
// function AddToContact({
//     className,
//     href,
//     download,
//     ['data-tooltip']: dataTooltip,
//     ...rest
// } : {
//     className: string,
//     href?: string,
//     download?: string,
//     ['data-tooltip']?: string,
// }) {
//     const {formData} = DashboardController;
//     return (
//         <A
//             href={href}
//             download={download}
//             data-tooltip={dataTooltip}
//             className={className}
//             {...rest}
//             onClick={async () => {
//                 signal._c = true
//                 const _vCard = await createVCard({formData})
//                 downloadToFile(_vCard.toString(), 'vcard.vcf', 'text/vcard')
//                 signal._c = false
//             }}
//         >
//             {signal._c ? <Loader color="white" size="sm"/> : contactIcon()}
//         </A>
//     );
// }
//
// export default AddToContact;