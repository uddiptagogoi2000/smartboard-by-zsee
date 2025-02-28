import { Box, Flex, Heading } from '@chakra-ui/react';
import { useUpdateControlWidget } from '../../hooks/widgets/useWidgets';
import { SwitchWidgetData } from '../context/DashboardRefactor';
import { Switch } from '../ui/switch';
import { useEffect, useState } from 'react';

interface SwitchWidgetProps {
  widget: SwitchWidgetData;
}

const SwitchWidget = ({ widget, ...props }: SwitchWidgetProps) => {
  const {
    color,
    isTitleHidden = false,
    labelPosition = 'right',
    offLabelText = 'OFF',
    onLabelText = 'ON',
    showOnOffLabel = true,
    title = 'Switch',
  } = widget.design ?? {};

  // let isChecked = widget.data;
  const [isChecked, setIsChecked] = useState(widget.data);

  let labelText = showOnOffLabel
    ? isChecked
      ? onLabelText
      : offLabelText
    : '';

  const updateWidget = useUpdateControlWidget();

  console.log('widget in switch', widget);

  // useEffect(() => {

  // }, [isChecked]);

  return (
    <Box w={'full'} height={'full'} bgColor={'inherit'}>
      <Heading>{!isTitleHidden && widget.label}</Heading>
      <Flex gap={'2'}>
        {labelPosition === 'left' && showOnOffLabel && labelText}
        <Switch
          colorPalette={'teal'}
          checked={isChecked}
          onCheckedChange={(e) => {
            setIsChecked(e.checked);
            updateWidget.mutateAsync({
              controlCmd: e.checked!,
              dataKey: widget.dataKey,
              topicForControl: widget.controlTopic ?? '',
              widgetAssignId: widget.id,
            });
          }}
          {...props}
        />
        {showOnOffLabel && labelPosition === 'right' && labelText}
      </Flex>
    </Box>
  );
};

export default SwitchWidget;
