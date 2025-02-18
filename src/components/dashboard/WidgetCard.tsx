import { Card } from '@chakra-ui/react';
import { Widget } from '../../services/widgetService';

type WidgetCardProps = Widget & {
  onClick: (id: string) => void;
};

const WidgetCard = ({
  _id,
  description,
  widget_name,
  onClick,
}: WidgetCardProps) => {
  return (
    <Card.Root
      variant='outline'
      color='teal'
      size='lg'
      height={'100%'}
      cursor={'pointer'}
      onClick={() => onClick(_id)}
    >
      <Card.Body>
        <Card.Title>{widget_name}</Card.Title>
        <Card.Description>{description}</Card.Description>
      </Card.Body>
    </Card.Root>
  );
};

export default WidgetCard;
