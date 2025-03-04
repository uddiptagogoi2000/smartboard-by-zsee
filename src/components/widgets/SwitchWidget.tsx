import { Box, Flex, Heading } from '@chakra-ui/react';
import { useUpdateControlWidget } from '../../hooks/widgets/useWidgets';
import { SwitchWidgetData, useDashboard } from '../context/DashboardRefactor';
import { Switch } from '../ui/switch';
import { PropsWithChildren, useState } from 'react';

interface SwitchWidgetProps {
  widget: SwitchWidgetData;
}

const SwitchWidget = ({ widget, ...props }: SwitchWidgetProps) => {
  const {
    isTitleHidden = false,
    labelPosition = 'right',
    offLabelText = 'OFF',
    onLabelText = 'ON',
    showOnOffLabel = true,
  } = widget.design ?? {};

  const [isChecked, setIsChecked] = useState(widget.data);

  let labelText = showOnOffLabel
    ? isChecked
      ? onLabelText
      : offLabelText
    : '';

  const updateWidget = useUpdateControlWidget();

  console.log('control', widget.controlTopic);

  return (
    <Box w={'full'} height={'full'} bgColor={'inherit'}>
      <Heading>{!isTitleHidden && widget.label}</Heading>
      <ActionElementWrapper>
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
      </ActionElementWrapper>
    </Box>
  );
};

export default SwitchWidget;

interface ActionElementWrapperProps {
  isEditable?: boolean;
}

const ActionElementWrapper = ({
  children,
}: PropsWithChildren & ActionElementWrapperProps) => {
  const { state } = useDashboard();

  return state.value === 'editing' ? (
    <Box pos='relative' w='full'>
      <>
        <Box
          pos='absolute'
          top={0}
          left={0}
          w={'full'}
          h={'full'}
          zIndex={'overlay'}
        ></Box>
        {children}
      </>
    </Box>
  ) : (
    children
  );
};
