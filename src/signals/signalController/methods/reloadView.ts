export async function reloadView(this: any) {debugger
    const promises: Promise<any>[] = [];

    for (const key in this.func) {
        if (key.includes("GetData")) {
            const loadingKey = key.replace("GetData", "Loading");
            if (this.signal && this.signal.hasOwnProperty(loadingKey)) {
                this.signal[loadingKey] = true;
            }
            if (typeof this.func[key] === "function") {
                promises.push(this.func[key]());
            }
        }
    }

    return Promise.all(promises);
}