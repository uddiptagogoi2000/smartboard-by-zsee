import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WidgetRenderer, { WidgetProps } from '../widgets/WidgetRenderer';

type DashboardGridProps = {
  isEditing: boolean;
  layout: { i: string; x: number; y: number; w: number; h: number }[];
  widgets: Record<string, WidgetProps>;
  onLayoutChange: (
    newLayout: { i: string; x: number; y: number; w: number; h: number }[]
  ) => void;
};

/**
 * widget added - in the client side dashboard - not sent to the server
 * addWidget - update the react grid layout
 * on saving sent to the server
 *
 *
 */

const DashboardGrid = ({
  isEditing,
  layout,
  widgets,
  onLayoutChange,
}: DashboardGridProps) => {
  return (
    <GridLayout
      className='dashboard-layout'
      isDraggable={isEditing}
      isResizable={isEditing}
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
      onLayoutChange={onLayoutChange}
    >
      {layout.map((item) => (
        <div key={item.i} style={{ background: '#009688' }}>
          <WidgetRenderer {...widgets[item.i]} />
        </div>
      ))}
    </GridLayout>
  );
};

export default DashboardGrid;
