export const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters from the phone number
    const cleaned = ('' + value).replace(/\D/g, '');

    // Format the phone number as (xxx)-xxx-xxxx
    let formattedPhoneNumber = cleaned.length ? '(' : '';
    for (let i = 0; i < cleaned.length && i < 10; i++) {
        formattedPhoneNumber += cleaned[i];
        if (i === 2 && cleaned.length - 1 > i) {
            formattedPhoneNumber += ') ';
        }
        if (i === 5 && cleaned.length - 1 > i) {
            formattedPhoneNumber += '-';
        }
    }
    return formattedPhoneNumber;
}


export const removePhoneMask = (value: string | undefined): string | undefined => {
    return value ? value.replace(/\D/g, '') : value;
}