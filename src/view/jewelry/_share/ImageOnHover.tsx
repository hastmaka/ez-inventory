import {Image, Menu} from "@mantine/core";

export default function ImageOnHover({ image }: { image: any }) {

    return (
        <Menu trigger='hover' withArrow withinPortal={false}>
            <Menu.Target>
                <Image
                    src={image.document_url}
                    width={30}
                    height={60}
                    fit="cover"
                    style={{ cursor: "zoom-in", display: "block" }}
                />
            </Menu.Target>

            <Menu.Dropdown>
                <Image
                    src={image.document_url}
                    maw={400}
                    width={400}
                    height="auto"
                    style={{ cursor: "zoom-in" }}
                />
            </Menu.Dropdown>
        </Menu>
    );
}