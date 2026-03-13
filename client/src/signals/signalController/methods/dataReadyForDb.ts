// export function dataReadyForDb(
//     this: any,
//     data: Record<string, any>,
// ) {
//     const dataReady: Record<string, any> = {};
//     Object.entries(data).forEach(([key, value]) => {
//         if (key.includes("phone") && typeof value === "string") {
//             const cleaned = value.trim().replace(/\D/g, "");
//             dataReady[key] = cleaned || ""; // ensure empty instead of undefined
//             return;
//         }
//
//         if (typeof value === "string") {
//             const trimmed = value.trim();
//             const normalized = trimmed.replace(/\s+/g, " ")
//             dataReady[key] = normalized || "";
//             return;
//         }
//
//         dataReady[key] = value;
//     })
//
//     return dataReady
// }