import _ from 'lodash';

export function resetState(
    this: any,
    keys?: string[],
    delay: number = 200
) {
    // this is to let the animation finish
    setTimeout(() => {
        if (keys && keys.length > 0) {
            // Partial reset: only clear specified keys from formData and errors
            keys.forEach((key) => {
                if (this.formData && key in this.formData) {
                    delete this.formData[key]
                }
                if (this.errors && key in this.errors) {
                    delete this.errors[key]
                }
            })
        } else {
            // Full reset: restore all properties from reset object
            if (this.reset) {
                Object.keys(this.reset).forEach((key) => {
                    if (Object.prototype.hasOwnProperty.call(this, key)) {
                        const original = this.reset[key];
                        this[key] = _.cloneDeep(original);
                    }
                });
            }
            this.modal = {loading: false, state: 'create'}
            this.dirtyFields = {}
        }
    }, delay);
}