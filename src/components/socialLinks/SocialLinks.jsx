import {Icons} from "../../static/icons/Icons.jsx";
import {Anchor, Flex} from "@mantine/core";
import PropTypes from "prop-types";
import classes from './SocialLinks.module.scss'

const socialIcons = [
    {id: 1, icon: Icons.simple.faceBook, path: 'https://www.facebook.com/'},
    {id: 2, icon: Icons.simple.instagram, path: 'https://www.instagram.com/'},
    {id: 3, icon: Icons.simple.tikTok, path: 'https://www.tiktok.com/'},
    // TODO: WhatsApp - future implementation
    // {id: 4, icon: Icons.simple.whatsApp, path: 'whatsapp://send?text=Your message here'},
]

export default function SocialLinks({orientation='horizontal'}) {
    const dir = orientation === 'horizontal' ? 'row' : 'column';
    return (
        <Flex direction={dir} gap={8}>
            {socialIcons.map(({icon, id, path}) =>
                <Anchor
                    key={id}
                    href={path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes['icon-container']}
                >
                    {icon}
                </Anchor>
            )}
        </Flex>
    );
}

SocialLinks.propTypes = {
    orientation: PropTypes.string,
}