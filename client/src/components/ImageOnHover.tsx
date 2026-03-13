import {Image, Menu} from "@mantine/core";

export default function ImageOnHover({ imageUrl }: { imageUrl: string }) {
    if (!imageUrl) return null;
    return (
        <Menu trigger='hover' withArrow>
            <Menu.Target>
                <Image
                    src={imageUrl}
                    maw={80}
                    width={30}
                    height="auto"
                    style={{ cursor: "zoom-in" }}
                />
            </Menu.Target>

            <Menu.Dropdown>
                <Image
                    src={imageUrl}
                    maw={400}
                    width={400}
                    height="auto"
                    style={{ cursor: "zoom-in" }}
                />
            </Menu.Dropdown>
        </Menu>
    );
}