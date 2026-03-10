// import SimpleCrypto from "simple-crypto-js";
//
// let secret: string = import.meta.env.VITE_REACT_APP_ENCRYPT_KEY,
//     sC = new SimpleCrypto(secret);

export const updateSessionStore = (key: string | string[], data: any): void => {
    if (Array.isArray(key)) {
        key.forEach((key, value) => sessionStorage.setItem(key, JSON.stringify(value)));
    } else {
        sessionStorage.setItem(key, JSON.stringify(data));
    }
};

export const getFromSessionStore = (key: string) => {
    const val = sessionStorage.getItem(key);
    let temp = null;
    if (val) {
        // temp = sC.decrypt(val);
        temp = JSON.parse(val);
    }
    return val ? temp : null;
};