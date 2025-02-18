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
import { useDashboard, Widget } from '../components/context/DashboardRefactor';
import { WebSocketProvider } from '../components/context/WebSocketProvider';
import WidgetCard from '../components/dashboard/WidgetCard';
import { Button } from '../components/ui/button';
import { useGetWidgets, useSaveDashboard } from '../hooks/widgets/useWidgets';
import PageLayout from '../layouts/PageLayout';
import DashboardGrid from '../components/dashboard/Dashboard';
import AddWidgetForm from '../components/dashboard/AddWidgetForm';
import { useParams, useSearchParams } from 'react-router-dom';

const DashboardDetailsPage = () => {
  const [widgetTypeId, setWidgetTypeId] = useState<null | string>(null);
  const [isViewingWidgetTypes, setIsViewingWidgetTypes] = useState(false);
  const { data, isLoading } = useGetWidgets(isViewingWidgetTypes);
  const { state, dispatch } = useDashboard();
  const { id } = useParams();
  const saveDashboardMutation = useSaveDashboard(id ?? '');
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const deviceId = searchParams.get('deviceId') ?? '';

  const widgetType = data?.data.find((wt) => wt._id === widgetTypeId);
  const isEditing = !!widgetTypeId;

  function handleOpenWidget(id: string) {
    setWidgetTypeId(id);
    // setIsAddingWidget(false);
  }

  function handleOpenChange(open: boolean) {
    if (!open) setWidgetTypeId(null);
  }

  return (
    <WebSocketProvider deviceId={'1002'}>
      <CommonDialog
        title={`Add widget: ${widgetType?.widget_name}`}
        open={isEditing}
        onOpenChange={handleOpenChange}
      >
        <AddWidgetForm
          onOpenChange={handleOpenChange}
          onAdd={(
            widgetInfo: Pick<Widget, 'dataKey' | 'dataSubkey' | 'label'>
          ) => {
            dispatch({
              type: 'ADD_WIDGET',
              payload: {
                dataKey: widgetInfo.dataKey,
                dataSubkey: widgetInfo.dataSubkey,
                label: widgetInfo.label,
                type: 'value-card',
                typeId: widgetTypeId!,
              },
            });
            handleOpenChange(false);
            setIsViewingWidgetTypes(false);
          }}
        />
      </CommonDialog>
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
                        const newWidgetsArray = state.context.widgets.filter(
                          (widget) => state.context.newWidgets.has(widget.id)
                        );

                        const updatedWidgetsArray =
                          state.context.widgets.filter((widget) =>
                            state.context.updatedWidgets.has(widget.id)
                          );

                        saveDashboardMutation.mutate({
                          dashboardId: id ?? '',
                          new_widgets: newWidgetsArray.map((widget) => ({
                            dataKey: widget.dataKey,
                            dataSubkey: widget.dataSubkey,
                            widgetInfoId: widget.typeId,
                            widgetLabel: widget.label,
                            layout: widget.layout,
                          })),
                          updated_widgets: updatedWidgetsArray.map(
                            (widget) => ({
                              dataKey: widget.dataKey,
                              dataSubkey: widget.dataSubkey,
                              widgetAssignId: widget.id,
                              widgetInfoId: widget.typeId,
                              widgetLabel: widget.label,
                              layout: widget.layout,
                            })
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
            {} as Record<string, Widget>
          )}
          onLayoutChange={(layout) => console.log(layout)}
        />
      </PageLayout>
    </WebSocketProvider>
  );
};

export default DashboardDetailsPage;
