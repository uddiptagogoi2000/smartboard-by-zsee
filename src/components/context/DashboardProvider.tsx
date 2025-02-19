// import {
//   createContext,
//   useContext,
//   useEffect,
//   useReducer,
//   useState,
// } from 'react';
// import {
//   WidgetProps,
//   widgetReducer,
//   WidgetState,
// } from '../widgets/WidgetRenderer';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import WidgetApiService from '../../services/widgetService';
// import { useParams } from 'react-router-dom';
// import { useGetWidgetsByDashboardId } from '../../hooks/widgets/useWidgets';

// type DashboardContextType = {
//   widgets: WidgetState;
//   onAddWidget: (widget: Omit<WidgetProps, 'id'>) => void;
//   onUpdateLayout: (
//     layout: { i: string; x: number; y: number; w: number; h: number }[]
//   ) => void;
//   onSaveDashboard: () => void;
//   isEditing: boolean;
//   onEdit: () => void;
//   onCancel: () => void;
//   isSaving: boolean;
// };

// const dashboardContext = createContext<DashboardContextType | null>(null);

// const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
//   const initialWidgetData: WidgetState = {
//     data: {
//       widget1: {
//         id: 'widget1',
//         infoId: 'widget11',
//         name: 'Widget 1',
//         type: 'value-card',
//         dashboardId: 'dashboard1',
//         dataKey: 'payload',
//         dataSubkey: 'battery_level',
//         data: '50',
//       },
//     },
//     layout: [{ i: 'widget1', x: 0, y: 0, w: 2, h: 4 }],
//   };

//   const [widgetData, dispatch] = useReducer(widgetReducer, initialWidgetData);
//   const { id: dashboardId } = useParams();
//   const [isEditing, setIsEditing] = useState(false);
//   const { data, isFetched, isSuccess, refetch } = useGetWidgetsByDashboardId(
//     isEditing,
//     dashboardId
//   );
//   const queryClient = useQueryClient();

//   const saveDashboardMutation = useMutation({
//     mutationFn: WidgetApiService.saveDashboard,
//     onSuccess: () => {
//       console.log('Dashboard saved successfully');
//       setIsEditing(false);
//       queryClient.invalidateQueries({ queryKey: ['widgets', dashboardId] });
//     },
//     onError: (error) => {
//       console.error('Failed to save dashboard', error);
//     },
//   });

//   console.log(widgetData);

//   useEffect(() => {
//     if (isSuccess && isFetched && data?.data) {
//       const layout = data?.data?.data?.map((widget) => ({
//         i: widget._id,
//         x: widget.layout.x,
//         y: widget.layout.y,
//         w: widget.layout.w,
//         h: widget.layout.h,
//       }));

//       const widgetData = data?.data?.data?.reduce(
//         (acc, widget) => {
//           acc[widget._id] = {
//             id: widget._id,
//             infoId: widget.widget_infoId,
//             name: widget.widget_label,
//             dataKey: widget.data_key,
//             dataSubkey: widget.data_sub_key,
//             type: 'value-card',
//             dashboardId: dashboardId ?? '',
//           };

//           return acc;
//         },
//         {} as WidgetState['data']
//       );

//       dispatch({
//         type: 'SET_WIDGETS',
//         payload: {
//           layout,
//           widgets: widgetData,
//         },
//       });
//     }
//   }, [data]);

//   return (
//     <dashboardContext.Provider
//       value={{
//         isEditing: isEditing,
//         widgets: {
//           layout: widgetData.layout,
//           data: widgetData.data,
//         },
//         onAddWidget: handleAddWidget,
//         onUpdateLayout: handleUpldateLayout,
//         onSaveDashboard: handleSaveDashboard,
//         onEdit: handleEdit,
//         onCancel: handleCancel,
//         isSaving: saveDashboardMutation.isPending,
//       }}
//     >
//       {children}
//     </dashboardContext.Provider>
//   );

//   function handleAddWidget(widget: Omit<WidgetProps, 'id'>) {
//     dispatch({
//       type: 'ADD_WIDGET',
//       payload: {
//         widget,
//       },
//     });
//   }

//   function handleUpldateLayout(layout: typeof widgetData.layout) {
//     dispatch({
//       type: 'UPDATE_LAYOUT',
//       payload: {
//         layout,
//       },
//     });
//   }

//   function handleEdit() {
//     setIsEditing(true);
//   }

//   function handleCancel() {
//     setIsEditing(false);
//     refetch();
//   }

//   function handleSaveDashboard() {
//     const newlyAddedWidgets = Object.values(widgetData.data).filter(
//       (widget) => typeof widget.id === 'number'
//     );

//     // TODO
//     const updatedWidgets = Object.values(widgetData.data).filter(
//       (widget) => typeof widget.id === 'string'
//     );

//     saveDashboardMutation.mutate({
//       dashboardId: dashboardId ?? '',
//       updated_widgets: updatedWidgets.map((widget) => {
//         let layout = widgetData.layout.find(
//           (layout) => layout.i === widget.id
//         ) as any;

//         return {
//           widgetAssignId: widget.id as string,
//           widgetInfoId: widget.infoId as string,
//           widgetLabel: widget.name,
//           dataKey: widget.dataKey,
//           dataSubKey: widget.dataSubkey,
//           layout: {
//             h: layout.h,
//             i: layout.i,
//             w: layout.w,
//             x: layout.x,
//             y: layout.y,
//           },
//         };
//       }),
//       new_widgets: newlyAddedWidgets.map((widget) => {
//         let layout = widgetData.layout.find(
//           (layout) => layout.i === widget.id.toString()
//         ) as any;

//         console.log('new widgets layout', layout);

//         return {
//           widgetInfoId: widget.infoId as string,
//           widgetLabel: widget.name as string,
//           dataKey: widget.dataKey,
//           dataSubKey: widget.dataSubkey,
//           layout,
//         };
//       }),
//     });
//   }
// };

// export const useDashboardContext = () => {
//   const context = useContext(dashboardContext);
//   if (context === null) {
//     throw new Error(
//       'useDashboardContext must be used within a DashboardProvider'
//     );
//   }
//   return context;
// };

// export default DashboardProvider;
