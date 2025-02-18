import { useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { LayoutItem, useDashboard, Widget } from '../context/DashboardRefactor';
import WidgetRenderer from '../widgets/WidgetRenderer';
import { Card } from '@chakra-ui/react';

type DashboardGridProps = {
  isEditing: boolean;
  layout: { i: string; x: number; y: number; w: number; h: number }[];
  widgets: Record<string, Widget>;
  onLayoutChange?: (
    newLayout: { i: string; x: number; y: number; w: number; h: number }[]
  ) => void;
};

const DashboardGrid = ({
  isEditing,
  layout,
  widgets,
  // onLayoutChange,
}: DashboardGridProps) => {
  // console.log({
  //   layout,
  //   widgets,
  // });

  const { dispatch } = useDashboard();
  const [activeWidget, setActiveWidget] = useState<string | null>(null);

  const handleInteractionStart = (widgetId: string) => {
    setActiveWidget(widgetId);
  };

  const handleInteractionStop = () => {
    setActiveWidget(null);
  };

  const handleDragStop = (
    _layout: LayoutItem[],
    oldItem: LayoutItem,
    newItem: LayoutItem
  ) => {
    console.log({
      oldItem,
      newItem,
    });

    dispatch({
      type: 'UPDATE_WIDGET',
      payload: {
        id: oldItem.i,
        layout: {
          ...oldItem,
          x: newItem.x,
          y: newItem.y,
          w: newItem.w,
          h: newItem.h,
        },
      },
    });
    // handleInteractionStop();
  };

  const handleResizeStop = (
    _layout: LayoutItem[],
    oldItem: LayoutItem,
    newItem: LayoutItem
  ) => {
    // console.log({
    //   oldItem,
    //   newItem,
    // });
    dispatch({
      type: 'UPDATE_WIDGET',
      payload: {
        id: oldItem.i,
        layout: {
          ...oldItem,
          x: newItem.x,
          y: newItem.y,
          w: newItem.w,
          h: newItem.h,
        },
      },
    });
    handleInteractionStop();
  };

  return (
    <GridLayout
      className='dashboard-layout'
      isDraggable={isEditing}
      isResizable={isEditing}
      layout={layout.map((item) => ({
        ...item,
        static: isEditing && activeWidget !== item.i, // Lock others
      }))}
      cols={12}
      rowHeight={30}
      width={1200}
      allowOverlap={false}
      onDrag={handleDragStop}
      autoSize={true}
      compactType={null} // Prevent auto-compactiosn
      onDragStart={(_, _oldItem, newItem) => handleInteractionStart(newItem.i)}
      onDragStop={handleDragStop}
      onResizeStart={(_, _oldItem, newItem) =>
        handleInteractionStart(newItem.i)
      }
      onResizeStop={handleResizeStop}
      useCSSTransforms={false} // Fix jumping issues
      preventCollision={true} // Prevent
    >
      {layout.map((item) => (
        <Card.Root
          key={item.i}
          colorPalette={'gray'}
          bg={'gray.emphasized'}
          onMouseEnter={() => handleInteractionStart(item.i)} // Detect hover
          onMouseLeave={() => handleInteractionStop()} // Reset when mouse leaves
        >
          <Card.Body>
            <WidgetRenderer widget={widgets[item.i]} />
          </Card.Body>
        </Card.Root>
      ))}
    </GridLayout>
  );
};

export default DashboardGrid;
