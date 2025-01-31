interface BaseWidgetProps {
  id: string;
  name: string;
  type: string;
  dashboardId: string;
  dataKey: string;
  dataSubkey?: string;
}

interface ValueCardWidgetProps extends BaseWidgetProps {
  type: 'value-card';
  data: {
    value: string | null;
  };
}

interface LineChartWidgetProps extends BaseWidgetProps {
  type: 'line-chart';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
}

export type WidgetProps = ValueCardWidgetProps | LineChartWidgetProps;

export type WidgetAction =
  | {
      type: 'ADD_WIDGET';
      payload: {
        widget: Omit<WidgetProps, 'id'>;
      };
    }
  | {
      type: 'UPDATE_WIDGET';
      payload: {
        id: string;
        updates: Partial<WidgetProps>;
      };
    }
  | {
      type: 'DELETE_WIDGET';
      payload: {
        id: string;
      };
    }
  | {
      type: 'SET_WIDGETS';
      payload: {
        widgets: Record<string, WidgetProps>;
      };
    }
  | {
      type: 'UPDATE_LAYOUT';
      payload: {
        layout: { i: string; x: number; y: number; w: number; h: number }[];
      };
    };

export type WidgetState = {
  layout: { i: string; x: number; y: number; w: number; h: number }[];
  data: Record<string, WidgetProps>;
};

export const widgetReducer = (
  state: WidgetState,
  action: WidgetAction
): WidgetState => {
  switch (action.type) {
    case 'ADD_WIDGET':
      let id = Date.now().toString();

      return {
        ...state,
        layout: [...state.layout, { i: id, x: 0, y: Infinity, w: 2, h: 4 }],
        data: {
          ...state.data,
          [id]: {
            ...action.payload.widget,
            id,
          } as WidgetProps,
        },
      };

    case 'UPDATE_WIDGET':
      const existingWidget = state.data[action.payload.id];

      if (!existingWidget) {
        return state;
      }

      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.id]: {
            ...state.data[action.payload.id],
            ...action.payload.updates,
          } as WidgetProps,
        },
      };

    case 'DELETE_WIDGET':
      const { [action.payload.id]: _, ...newData } = state.data;
      return {
        ...state,
        layout: state.layout.filter((item) => item.i !== action.payload.id),
        data: newData,
      };

    case 'SET_WIDGETS':
      return {
        ...state,
        data: action.payload.widgets,
      };

    case 'UPDATE_LAYOUT':
      return {
        ...state,
        layout: action.payload.layout,
      };

    default:
      return state;
  }
};

const WidgetRenderer: React.FC<WidgetProps> = (props) => {
  switch (props.type) {
    case 'value-card':
      return <div>Value card value is {props.data.value}</div>;

    case 'line-chart':
      return (
        <div>
          Line chart
          <pre>{JSON.stringify(props.data, null, 2)}</pre>
        </div>
      );

    default:
      return <div>Unknown widget type</div>;
  }
};

export default WidgetRenderer;
