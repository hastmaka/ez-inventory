import type {SignalType} from "@/signals/SignalClass.ts";
import {SignalController} from "@/signals/signalController/SignalController.ts";

export const LayoutController: SignalType<any, any> =
    new SignalController({

    },{

    }).signal;