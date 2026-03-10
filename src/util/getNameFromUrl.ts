export const getNameFromUrl = (url?: string): string => {
    if (!url) return ''

    let queryIndex = url.lastIndexOf('?');
    let name = '';
    for (let i = queryIndex - 1; i >= 0; i--) {
        if (url[i] !== '/') {
            name += url[i];
        } else {
            break;
        }
    }
    let reversedName = name.split("")
        .reverse()
        .join("")
        .split(".")[0];
    return reversedName.includes('%20')
        ? reversedName.replace(/%20/g, ' ')
        : reversedName;
};