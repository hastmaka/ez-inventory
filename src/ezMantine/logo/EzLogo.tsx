import {ThemeController} from "@/theme/ThemeController.ts";
import {Image} from "@mantine/core";

type LogoType = "logo" | "full" | "full_horizontal"

function EzLogo({type, width, ...rest}: {type: LogoType, width?: string}) {
    const {getLogo} = ThemeController
    return (
        <Image
            src={getLogo(type)}
            alt='Logo'
            style={{
                width: width || '100%',
                height: "auto"
            }}
            {...rest}
        />
    );
}

export default EzLogo;