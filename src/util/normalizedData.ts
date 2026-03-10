import _ from "lodash";
import type {ComboboxStringData} from "@mantine/core";

export const normalizedData =
    (data: ComboboxStringData) =>
        _.map(data, (item: any) => {
            if (_.isString(item) || _.isNumber(item)) {
                const str = String(item);
                return { value: str, label: str };
            }
            return item;
        }
    );