import { DashboardWidget } from '../context/DashboardRefactor';
import { useWebSocketData } from '../context/WebSocketProvider';
import SwitchWidget from './SwitchWidget';

const WidgetRenderer: React.FC<{ widget: DashboardWidget }> = ({ widget }) => {
  const webSocketData = useWebSocketData();

  switch (widget.type) {
    case 'value-card':
      const data: typeof widget.data =
        widget.dataSubKey !== undefined
          ? webSocketData?.[widget.dataKey]?.[widget.dataSubKey]
          : 'NO data';

      // console.log('data', data);
      return (
        <div>
          {widget.label}'s value is{' '}
          {JSON.stringify(data, null, 2) ?? 'Loading...'}
        </div>
      );

    case 'switch':
      const switchData: typeof widget.data =
        widget.dataSubKey !== undefined
          ? webSocketData?.[widget.dataKey]
          : widget.data;

      // console.log('switchData', switchData);
      console.log('widget', widget);
      return (
        <SwitchWidget
          widget={{
            ...widget,
            data: switchData,
          }}
        />
      );

    default:
      return <div>Unknown widget type</div>;
  }
};

export default WidgetRenderer;
