import {Card, type CardProps} from "@mantine/core";
import classes from './CardItem.module.scss';

type ItemCardProps = CardProps & {
    index?: number,
    onDoubleClick?: () => void,
}

function CardItem({
    children,
    index,
    onDoubleClick,
    ...rest
}: ItemCardProps) {
    const onClickHandler = (event: any) => {
        if (event.detail === 2) {
            if (onDoubleClick) onDoubleClick()
        }
    }
    return (
        <Card
            mt={index? 16: 0}
            shadow='none'
            pos='relative'
            onClick={onClickHandler}
            className={classes.card}
            {...rest}
        >{children}</Card>
    );
}

export default CardItem;