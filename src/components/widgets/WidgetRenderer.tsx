import { Widget } from '../context/DashboardRefactor';
import { useWebSocketData } from '../context/WebSocketProvider';

// interface BaseWidgetProps {
//   id: string;
//   infoId: string;
//   name: string;
//   type: string;
//   dashboardId: string;
//   dataKey: string;
//   dataSubKey?: string;
// }

// interface ValueCardWidgetProps extends BaseWidgetProps {
//   type: 'value-card';
//   data?: string | number;
// }

// interface LineChartWidgetProps extends BaseWidgetProps {
//   type: 'line-chart';
//   data: {
//     labels: string[];
//     datasets: {
//       label: string;
//       data: number[];
//     }[];
//   };
// }

// export type WidgetProps = ValueCardWidgetProps | LineChartWidgetProps;

// export type WidgetAction =
//   | {
//       type: 'ADD_WIDGET';
//       payload: {
//         widget: Omit<WidgetProps, 'id'>;
//       };
//     }
//   | {
//       type: 'UPDATE_WIDGET';
//       payload: {
//         id: string;
//         updates: Partial<WidgetProps>;
//       };
//     }
//   | {
//       type: 'DELETE_WIDGET';
//       payload: {
//         id: string;
//       };
//     }
//   | {
//       type: 'SET_WIDGETS';
//       payload: {
//         widgets: Record<string, WidgetProps>;
//         layout: WidgetLayout[];
//       };
//     }
//   | {
//       type: 'UPDATE_LAYOUT';
//       payload: {
//         layout: WidgetLayout[];
//       };
//     }
//   | {
//       type: 'EDIT_MODE';
//     }
//   | {
//       type: 'VIEW_MODE';
//     };

// export type WidgetState = {
//   layout: WidgetLayout[];
//   data: Record<string, WidgetProps>;
// };

// export const widgetReducer = (
//   state: WidgetState,
//   action: WidgetAction
// ): WidgetState => {
//   switch (action.type) {
//     case 'ADD_WIDGET':
//       let id: number = Date.now();

//       return {
//         ...state,
//         layout: [...state.layout, { i: id, x: 0, y: Infinity, w: 2, h: 4 }],
//         data: {
//           ...state.data,
//           [id]: {
//             ...action.payload.widget,
//             id,
//           } as WidgetProps,
//         },
//       };

//     case 'UPDATE_WIDGET':
//       const existingWidget = state.data[action.payload.id];

//       if (!existingWidget) {
//         return state;
//       }

//       return {
//         ...state,
//         data: {
//           ...state.data,
//           [action.payload.id]: {
//             ...state.data[action.payload.id],
//             ...action.payload.updates,
//           } as WidgetProps,
//         },
//       };

//     case 'DELETE_WIDGET':
//       const { [action.payload.id]: _, ...newData } = state.data;
//       return {
//         ...state,
//         layout: state.layout.filter((item) => item.i !== action.payload.id),
//         data: newData,
//       };

//     case 'SET_WIDGETS':
//       return {
//         ...state,
//         layout: action.payload.layout,
//         data: action.payload.widgets,
//       };

//     case 'UPDATE_LAYOUT':
//       return {
//         ...state,
//         layout: action.payload.layout,
//       };

//     default:
//       return state;
//   }
// };

const WidgetRenderer: React.FC<{ widget: Widget }> = ({ widget }) => {
  const webSocketData = useWebSocketData();
  console.log('widget', widget);

  switch (widget.type) {
    case 'value-card':
      const data: typeof widget.data =
        widget.dataSubKey !== undefined
          ? webSocketData?.[widget.dataKey]?.[widget.dataSubKey]
          : 'NO data';

      // console.log('data', data);
      return (
        <div>
          {widget.label}'s value is {data ?? 'Loading...'}
        </div>
      );

    // case 'line-chart':
    //   return (
    //     <div>
    //       Line chart
    //       <pre>{JSON.stringify(widget.data, null, 2)}</pre>
    //     </div>
    //   );

    default:
      return <div>Unknown widget type</div>;
  }
};

export default WidgetRenderer;
