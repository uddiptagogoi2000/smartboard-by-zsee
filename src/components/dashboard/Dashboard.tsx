import { Box, Card, Group, IconButton } from '@chakra-ui/react';
import { RiDeleteBin2Line, RiPencilLine } from '@remixicon/react';
import { useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../../App.css';
import {
  DashboardWidget,
  LayoutItem,
  useDashboard,
} from '../context/DashboardRefactor';
import { Button } from '../ui/button';
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '../ui/dialog';
import WidgetRenderer from '../widgets/WidgetRenderer';

type DashboardGridProps = {
  isEditing: boolean;
  layout: { i: string; x: number; y: number; w: number; h: number }[];
  widgets: Record<string, DashboardWidget>;
  onLayoutChange?: (
    newLayout: { i: string; x: number; y: number; w: number; h: number }[]
  ) => void;
};

const DashboardGrid = ({ isEditing, layout, widgets }: DashboardGridProps) => {
  const { state, dispatch } = useDashboard();
  const [removingItem, setRemovingItem] = useState<DashboardWidget | null>(
    null
  );

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
  };

  const handleResizeStop = (
    _layout: LayoutItem[],
    oldItem: LayoutItem,
    newItem: LayoutItem
  ) => {
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
  };

  return (
    <>
      <DialogRoot
        role='alertdialog'
        placement={'center'}
        open={Boolean(removingItem)}
        onOpenChange={(details) => {
          if (!details.open) {
            setRemovingItem(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to remove the widget "{removingItem?.label}"
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p>
              This action cannot be undone. After the confirmation the widget
              and all related data will become unrecoverable.
            </p>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogActionTrigger>
            <Button
              colorPalette='red'
              onClick={() => {
                if (removingItem) {
                  dispatch({
                    type: 'DELETE_WIDGET',
                    payload: removingItem.id,
                  });
                  setRemovingItem(null);
                }
              }}
            >
              Remove
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
      <GridLayout
        isDraggable={isEditing}
        isResizable={isEditing}
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        allowOverlap={false}
        // onDragStart={(_, _oldItem, newItem) => setHoveredWidget(newItem.i)}
        onDragStop={handleDragStop}
        // onResizeStart={(_, _oldItem, newItem) => setHoveredWidget(newItem.i)}
        onResizeStop={handleResizeStop}
        preventCollision={true}
        compactType={null}
        autoSize={true}
        useCSSTransforms={false}
      >
        {layout.map((item) => (
          <Card.Root
            key={item.i}
            colorPalette={'gray'}
            bg={'gray.emphasized'}
            pos='relative'
            className={`widget-card`}
          >
            <Card.Body>
              {/* Add `editing` class dynamically to enable hover effect */}
              <Box
                className={`widget-overlay-container ${state.value === 'editing' ? 'editing' : ''}`}
              >
                {/* Overlay */}
                <Box className='widget-overlay' />

                {/* Controls */}
                {state.value === 'editing' && (
                  <Group className='widget-controls'>
                    <IconButton
                      aria-label='Edit Widget'
                      size='xs'
                      rounded='full'
                      boxShadow='lg'
                    >
                      <RiPencilLine />
                    </IconButton>
                    <IconButton
                      aria-label='Delete Widget'
                      size='xs'
                      rounded='full'
                      boxShadow='lg'
                      onMouseDown={(e) =>
                        e.stopPropagation()
                      } /* Prevents drag */
                      onClick={() => {
                        setRemovingItem(widgets[item.i]);
                      }}
                    >
                      <RiDeleteBin2Line />
                    </IconButton>
                  </Group>
                )}
              </Box>

              {/* Widget Content */}
              <WidgetRenderer widget={widgets[item.i]} />
            </Card.Body>
          </Card.Root>
        ))}
      </GridLayout>
    </>
  );
};

export default DashboardGrid;
