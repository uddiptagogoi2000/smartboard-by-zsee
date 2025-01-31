import {
  Box,
  Flex,
  Grid,
  GridItem,
  Group,
  Heading,
  HStack,
  IconButton,
  Separator,
} from '@chakra-ui/react';
import {
  RiAddLine,
  RiCheckLine,
  RiCloseLine,
  RiPencilLine,
  RiSearchLine,
} from '@remixicon/react';
import { useReducer, useState } from 'react';
import DashboardGrid from '../components/dashboard/Dashboard';
import WidgetCard from '../components/dashboard/WidgetCard';
import { Button } from '../components/ui/button';
import {
  WidgetProps,
  widgetReducer,
  WidgetState,
} from '../components/widgets/WidgetRenderer';
import { useGetWidgets } from '../hooks/widgets/useWidgets';
import PageLayout from '../layouts/PageLayout';

const DashboardDetailsPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [widgetId, setWidgetId] = useState('');
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const { data, isLoading } = useGetWidgets();

  const initialWidgetData: WidgetState = {
    data: {
      widget1: {
        id: 'widget1',
        name: 'Widget 1',
        type: 'value-card',
        dashboardId: 'dashboard1',
        dataKey: 'datakey1',
        data: {
          value: '100',
        },
      },
    },
    layout: [{ i: 'widget1', x: 0, y: 0, w: 2, h: 4 }],
  };

  const [widgetData, dispatch] = useReducer(widgetReducer, initialWidgetData);

  console.log(widgetData);

  // const [layout, setLayout] = useState([
  //   { i: 'widget1', x: 0, y: 0, w: 2, h: 4 },
  // ]);

  // const [widgets, setWidgets] = useState<Record<string, WidgetProps>>({
  //   widget1: {
  //     id: 'widget1',
  //     name: 'Widget 1',
  //     type: 'value-card',
  //     dashboardId: 'dashboard1',
  //     data: {
  //       value: '100',
  //     },
  //   },
  // });

  function handleOpenWidget(id: string) {
    setWidgetId(id);
    setIsAddingWidget(false);
  }

  function handleAddWidget(widget: Omit<WidgetProps, 'id'>) {
    dispatch({
      type: 'ADD_WIDGET',
      payload: {
        widget,
      },
    });
  }

  return (
    <PageLayout isLoading={isLoading} fixedHeight fullWidth>
      <Box
        bgColor={'Background'}
        width={{
          base: '100%',
          lg: '70%',
        }}
        zIndex={1}
        position={'absolute'}
        right={0}
        bottom={0}
        top={0}
        transition={'transform 0.3s'}
        transform={isAddingWidget ? 'translateX(0)' : 'translateX(100%)'}
        boxShadow={'lg'}
      >
        <Flex justifyContent='space-between' alignItems='center' p={4}>
          <Heading>Select widgets bundle</Heading>
          <HStack>
            <IconButton variant={'ghost'} rounded={'full'}>
              <RiSearchLine />
            </IconButton>
            <IconButton
              variant={'ghost'}
              rounded={'full'}
              onClick={() => setIsAddingWidget(false)}
            >
              <RiCloseLine />
            </IconButton>
          </HStack>
        </Flex>
        <Grid
          templateColumns='repeat(4, 1fr)'
          templateRows={'1fr'}
          gap={2}
          p={4}
        >
          {data?.data?.data?.map((widget) => (
            <GridItem key={widget._id}>
              <WidgetCard
                {...widget}
                isEditing={widgetId === widget._id}
                onClick={handleOpenWidget}
                onAddWidget={handleAddWidget}
              />
            </GridItem>
          ))}
        </Grid>
      </Box>
      {!isAddingWidget && (
        <Grid
          templateColumns={{
            base: '1fr',
            lg: 'repeat(2, 1fr)',
          }}
          bgColor={'teal'}
          color={'white'}
          p={2}
          alignItems={'center'}
          gap={{
            base: '2',
            lg: '0',
          }}
        >
          <GridItem>Demo</GridItem>
          <GridItem>
            <HStack
              lg={{
                justifyContent: 'flex-end',
                gap: 3,
              }}
            >
              {isEditing && (
                <Button
                  size='sm'
                  variant={'outline'}
                  color={'white'}
                  _hover={{
                    bg: 'none',
                  }}
                  onClick={() => setIsAddingWidget(true)}
                >
                  <RiAddLine /> Add widget
                </Button>
              )}
              {isEditing && <Separator orientation='vertical' height='4' />}
              {isEditing ? (
                <Group>
                  <Button
                    size='sm'
                    variant='ghost'
                    colorPalette={'teal'}
                    color={'white'}
                    _hover={{
                      bg: 'colorPalette.500/20',
                    }}
                    onClick={() => setIsEditing(false)}
                  >
                    <RiCloseLine /> Cancel
                  </Button>
                  <Button
                    size='sm'
                    variant={'outline'}
                    color={'white'}
                    _hover={{
                      bg: 'none',
                    }}
                    onClick={() => setIsEditing(false)}
                  >
                    <RiCheckLine /> Save
                  </Button>
                </Group>
              ) : (
                <Button
                  size='sm'
                  color={'white'}
                  variant='outline'
                  _hover={{
                    bg: 'none',
                  }}
                  onClick={() => setIsEditing(true)}
                >
                  <RiPencilLine /> Edit mode
                </Button>
              )}
            </HStack>
          </GridItem>
        </Grid>
      )}

      <DashboardGrid
        isEditing={isEditing}
        layout={widgetData.layout}
        widgets={widgetData.data}
        onLayoutChange={(layout) => {
          console.log({ layout });
          dispatch({
            type: 'UPDATE_LAYOUT',
            payload: {
              layout,
            },
          });
        }}
      />
    </PageLayout>
  );
};

export default DashboardDetailsPage;
