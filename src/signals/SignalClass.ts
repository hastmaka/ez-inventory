import { type DeepSignalObject, deepSignal } from "deepsignal/react";

export type SignalType<P extends Record<string, any>, M extends Record<string, (...args: any[]) => any>> = DeepSignalObject<P & M>;

export class SignalState<
	Props extends Record<string, any>,
	Methods extends Record<string, (...args: any[]) => any>
> {
	props: Props;
	func: Methods;
	signal: DeepSignalObject<Props & Methods>;
	reset: { [key: string]: { [key: string]: any }}

	constructor(props: Props, func: Methods) {
		this.props = props;
		this.func = func;
		this.signal = deepSignal({}) as any;
		this.reset = {};
		this.init();
		// this.subscribe = subscribe
		// this.initSubscribe()
	}

	init() {
		for (const key in this.props) {
			try {
				// if it doesn't exist, create a reset object
				if (!this['reset']) this['reset'] = {};
				// check if key is an object before copying

				const manualResetKeys = Array.isArray(this.props.manualReset) ? this.props.manualReset : [];

				// manualReset: skip adding to reset if key is in manualResetKeys
				if (!manualResetKeys.includes(key) && key !== 'store') {
					// Avoid cloning if the object contains functions (e.g., editMap)
					const avoid = Array.isArray(this.props.avoidDeepClone) ? this.props.avoidDeepClone : [];

                    const needDeepClone = !(
                        avoid.includes(key) ||
                        (
                            this.props[key] &&
                            typeof this.props[key] === 'object' &&
                            Object.values(this.props[key]).some(v => typeof v === 'function')
                        )
                    );

					if (!needDeepClone) {
						this.reset[key] = this.props[key]; // reference directly
					} else {
						this.reset[key] = Object.freeze(structuredClone(this.props[key]));
					}
				}
				if (Object.prototype.hasOwnProperty.call(this.props, key)) {
					(this.signal as Record<string, unknown>)[key] = this.props[key];
				}
			} catch (error) {debugger
				if (error instanceof Error) {
					throw new Error(`Error in SignalState: ${error.message}`);
				}
				throw error;
			}
		}

		(this.signal as any).reset = this.reset;

		for (const key in this.func) {
			if (Object.prototype.hasOwnProperty.call(this.func, key)) {
				(this.signal as Record<string, unknown>)[key] = this.func[key].bind(this.signal);
			}
		}

		return this.signal;
	}

	// initSubscribe() {
	//   let me = this;
	//   for (const key in this.signal) {
	//     if (Object.prototype.hasOwnProperty.call(this.signal, key)) {
	//       if (typeof this.signal[key] !== 'function') {
	//         this.signal[`$${key}`].subscribe(() => {
	//           if (me.subscribe?.[key]) {
	//             me.subscribe[key](me.signal[key], me.signal);
	//           }
	//         })
	//       }
	//     }
	//   }
	// }
}