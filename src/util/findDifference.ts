export const findDifferences = (
    obj1: Record<string, any>,
    obj2: Record<string, any>,
    exclude: string[] = []
) => {
    const differences: Record<string, any> = {};

    for (const key in obj1) {
        if (!exclude.includes(key) && Object.prototype.hasOwnProperty.call(obj1, key)
            && Object.prototype.hasOwnProperty.call(obj2, key)) {
            if (obj1[key] !== obj2[key]) {
                differences[key] = obj2[key];
            }
        }
    }

    // Check for keys in obj2 that are not in obj1 and not excluded
    for (const key in obj2) {
        if (!exclude.includes(key) && Object.prototype.hasOwnProperty.call(obj2, key)
            && !Object.prototype.hasOwnProperty.call(obj1, key)) {
            differences[key] = obj2[key];
        }
    }

    return { differences, isDifferent: Object.keys(differences).length > 0 };
};