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
import { useState } from 'react';
import { CommonDialog } from '../components/common/CommonDialog';
import {
  useDashboard,
  DashboardWidget,
} from '../components/context/DashboardRefactor';
import { WebSocketProvider } from '../components/context/WebSocketProvider';
import WidgetCard from '../components/dashboard/WidgetCard';
import { Button } from '../components/ui/button';
import { useGetWidgets, useSaveDashboard } from '../hooks/widgets/useWidgets';
import PageLayout from '../layouts/PageLayout';
import DashboardGrid from '../components/dashboard/Dashboard';
import AddWidgetForm from '../components/dashboard/AddWidgetForm';
import { useParams, useSearchParams } from 'react-router-dom';
import AddControlWidgetForm from '../components/dashboard/AddControlWidgetForm';
import { WidgetPayload } from '../services/widgetService';

const DashboardDetailsPage = () => {
  const [widgetTypeId, setWidgetTypeId] = useState<null | string>(null);
  const [isViewingWidgetTypes, setIsViewingWidgetTypes] = useState(false);
  const { data, isLoading } = useGetWidgets(isViewingWidgetTypes);
  const { state, dispatch, dashboardDataLoading } = useDashboard();
  const { id } = useParams();
  const saveDashboardMutation = useSaveDashboard(id ?? '');
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const deviceId = searchParams.get('deviceId') ?? '';

  const widgetType = data?.data.find((wt) => wt._id === widgetTypeId);
  const isEditing = !!widgetTypeId;

  function handleOpenWidget(id: string) {
    setWidgetTypeId(id);
  }

  function handleOpenChange(open: boolean) {
    if (!open) setWidgetTypeId(null);
  }

  console.log('state', state);

  return (
    <WebSocketProvider deviceId={deviceId}>
      <CommonDialog
        title={`Add widget: ${widgetType?.widget_name}`}
        open={isEditing}
        onOpenChange={handleOpenChange}
      >
        {widgetType?.widget_type === 'switch' ? (
          <AddControlWidgetForm
            onOpenChange={handleOpenChange}
            onAdd={(
              widgetInfo: Pick<
                DashboardWidget,
                'dataKey' | 'label' | 'controlTopic'
              >
            ) => {
              console.log('onadd control topic', widgetInfo);

              dispatch({
                type: 'ADD_WIDGET',
                payload: {
                  dataKey: widgetInfo.dataKey,
                  label: widgetInfo.label,
                  type: widgetType?.widget_type as any,
                  typeId: widgetTypeId!,
                  controlTopic: widgetInfo.controlTopic,
                },
              });
              handleOpenChange(false);
              setIsViewingWidgetTypes(false);
            }}
            deviceId={deviceId}
          />
        ) : (
          <AddWidgetForm
            onOpenChange={handleOpenChange}
            onAdd={(
              widgetInfo: Pick<
                DashboardWidget,
                'dataKey' | 'dataSubKey' | 'label'
              >
            ) => {
              dispatch({
                type: 'ADD_WIDGET',
                payload: {
                  dataKey: widgetInfo.dataKey,
                  dataSubKey: widgetInfo.dataSubKey,
                  label: widgetInfo.label,
                  type: widgetType?.widget_type as any,
                  typeId: widgetTypeId!,
                },
              });
              handleOpenChange(false);
              setIsViewingWidgetTypes(false);
            }}
          />
        )}
      </CommonDialog>
      <PageLayout
        isLoading={isLoading || dashboardDataLoading}
        fixedHeight
        fullWidth
      >
        <Box
          bgColor={'Background'}
          height={'100%'}
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
          transform={
            isViewingWidgetTypes ? 'translateX(0)' : 'translateX(100%)'
          }
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
                onClick={() => setIsViewingWidgetTypes(false)}
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
            {data?.data?.map((widget) => (
              <GridItem key={widget._id}>
                <WidgetCard {...widget} onClick={handleOpenWidget} />
              </GridItem>
            ))}
          </Grid>
        </Box>
        {!isViewingWidgetTypes && (
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
            position='sticky'
            top={0}
            zIndex={'sticky'}
          >
            <GridItem>{name}</GridItem>
            <GridItem>
              <HStack
                lg={{
                  justifyContent: 'flex-end',
                  gap: 3,
                }}
              >
                {state.value === 'editing' && (
                  <Button
                    size='sm'
                    variant={'outline'}
                    color={'white'}
                    _hover={{
                      bg: 'none',
                    }}
                    onClick={() => setIsViewingWidgetTypes(true)}
                  >
                    <RiAddLine /> Add widget
                  </Button>
                )}
                {state.value === 'editing' && (
                  <Separator orientation='vertical' height='4' />
                )}
                {state.value === 'editing' ? (
                  <Group>
                    <Button
                      size='sm'
                      variant='ghost'
                      colorPalette={'teal'}
                      color={'white'}
                      _hover={{
                        bg: 'colorPalette.500/20',
                      }}
                      onClick={() => {
                        dispatch({
                          type: 'TOGGLE_STATE',
                          payload: 'readonly',
                        });
                      }}
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
                      onClick={() => {
                        // console.log('state', state);

                        const newWidgetsArray = state.context.widgets.filter(
                          (widget) => state.context.newWidgets.has(widget.id)
                        );

                        console.log('heredfd');

                        console.log('new Widgets array', newWidgetsArray);

                        const updatedWidgetsArray =
                          state.context.widgets.filter((widget) =>
                            state.context.updatedWidgets.has(widget.id)
                          );

                        saveDashboardMutation.mutate({
                          dashboardId: id ?? '',
                          new_widgets: newWidgetsArray.map((widget) => ({
                            dataKey: widget.dataKey,
                            dataSubKey: widget.dataSubKey,
                            widgetInfoId: widget.typeId,
                            widgetLabel: widget.label,
                            layout: widget.layout,
                            controlTopic: widget.controlTopic,
                          })) as Omit<WidgetPayload, 'widgetAssignId'>[],
                          updated_widgets: updatedWidgetsArray.map(
                            (widget) => ({
                              dataKey: widget.dataKey,
                              dataSubKey: widget.dataSubKey,
                              widgetAssignId: widget.id,
                              widgetInfoId: widget.typeId,
                              widgetLabel: widget.label,
                              layout: widget.layout,
                              controlTopic: widget.controlTopic,
                            })
                          ) as WidgetPayload[],
                          deleted_widgets: Array.from(
                            state.context.deletedWidgets
                          ),
                        });
                      }}
                      loading={saveDashboardMutation.isPending}
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
                    onClick={() => {
                      dispatch({
                        type: 'TOGGLE_STATE',
                        payload: 'editing',
                      });
                    }}
                  >
                    <RiPencilLine /> Edit mode
                  </Button>
                )}
              </HStack>
            </GridItem>
          </Grid>
        )}

        <DashboardGrid
          isEditing={state.value === 'editing'}
          layout={state.context.widgets.map((w) => w.layout)}
          widgets={state.context.widgets.reduce(
            (acc, widget) => {
              acc[widget.id] = widget;
              return acc;
            },
            {} as Record<string, DashboardWidget>
          )}
          onLayoutChange={(layout) => console.log(layout)}
        />
      </PageLayout>
    </WebSocketProvider>
  );
};

export default DashboardDetailsPage;
