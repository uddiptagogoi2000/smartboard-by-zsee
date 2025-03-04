import { useRef, useState } from 'react';
import { DashboardWidget, LayoutItem } from '../context/DashboardRefactor';
import WidgetRenderer from '../widgets/WidgetRenderer';
import { Box, Card, Group, IconButton } from '@chakra-ui/react';
import { RiDeleteBin2Line, RiPencilLine } from '@remixicon/react';

interface GridLayoutItemProps {
  item: LayoutItem;
  widget: DashboardWidget;
  isEditing: boolean;
}

const GridLayoutItem = ({ item, widget, isEditing }: GridLayoutItemProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hoveredWidget, setHoveredWidget] = useState<string | null>(null);

  const handleMouseEnter = () => setHoveredWidget(item.i);

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (cardRef.current && !cardRef.current.contains(e.relatedTarget as Node)) {
      setHoveredWidget(null);
    }
  };

  return (
    <Card.Root
      colorPalette={'gray'}
      bg={'gray.emphasized'}
      pos='relative'
      ref={cardRef} // Attach ref to the card
      className={`widget-card ${hoveredWidget === item.i ? 'glowing' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave} // Use the new function
      boxShadow={'none'}
    >
      <Card.Body>
        {/* Controls & Overlay Container */}
        <Box
          className={`widget-overlay-container ${
            hoveredWidget === item.i ? 'visible' : ''
          }`}
        >
          {/* Overlay */}
          <Box className='widget-overlay' />

          {/* Buttons */}
          {isEditing && (
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
              >
                <RiDeleteBin2Line />
              </IconButton>
            </Group>
          )}
        </Box>

        {/* Widget Content */}
        <WidgetRenderer widget={widget} />
      </Card.Body>
    </Card.Root>
  );
};

export default GridLayoutItem;
