import {IconStarFilled} from "@tabler/icons-react";
import {Tooltip} from "@mantine/core";

function IsPrimary(props: any) {
    return (
        <Tooltip label='Is Primary'>
            <IconStarFilled
                color='var(--mantine-primary-color-7)'
                style={{position: 'absolute', right: 8}}
                {...props}
            />
        </Tooltip>
    );
}

export default IsPrimary;