import { Card } from '@chakra-ui/react';
import { Widget } from '../../services/widgetService';
import { CommonDialog } from '../common/CommonDialog';
import AddWidgetForm from './AddWidgetForm';
import { useParams } from 'react-router-dom';
import { WidgetProps } from '../widgets/WidgetRenderer';

type WidgetCardProps = Widget & {
  isEditing: boolean;
  onClick: (id: string) => void;
  onAddWidget: (widget: Omit<WidgetProps, 'id'>) => void;
};

const WidgetCard = ({
  _id,
  description,
  widget_name,
  widget_type,
  onAddWidget,
  ...props
}: WidgetCardProps) => {
  const { id } = useParams();

  const handleOpenChange = () => {
    if (props.isEditing) {
      props.onClick('');
    }
  };
  return (
    <>
      <CommonDialog
        title={`Add widget: ${widget_name}`}
        open={props.isEditing}
        onOpenChange={handleOpenChange}
      >
        <AddWidgetForm
          onOpenChange={handleOpenChange}
          onAdd={onAddWidget}
          widgetDetails={{
            name: widget_name,
            type: widget_type,
            dashboardId: id ?? '',
          }}
        />
      </CommonDialog>
      <Card.Root
        variant='outline'
        color='teal'
        size='lg'
        height={'100%'}
        cursor={'pointer'}
        onClick={() => props.onClick(_id)}
      >
        <Card.Body>
          <Card.Title>{widget_name}</Card.Title>
          <Card.Description>{description}</Card.Description>
        </Card.Body>
      </Card.Root>
    </>
  );
};

export default WidgetCard;
