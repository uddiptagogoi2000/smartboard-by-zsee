import { createContext, useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { useGetWidgetsByDashboardId } from '../../hooks/widgets/useWidgets';

type DashboardAction =
  | {
      type: 'ADD_WIDGET';
      payload: Pick<
        DashboardWidget,
        'dataKey' | 'dataSubKey' | 'label' | 'type' | 'typeId'
      > &
        Partial<Pick<DashboardWidget, 'controlTopic'>>;
    }
  | {
      type: 'UPDATE_WIDGET';
      payload: { id: string } & Partial<Omit<DashboardWidget, 'id'>>;
    }
  | {
      type: 'DELETE_WIDGET';
      payload: string;
    }
  | {
      type: 'SET_WIDGETS';
      payload: DashboardWidget[];
    }
  | {
      type: 'UPDATE_LAYOUT';
      payload: any;
    }
  | {
      type: 'EDIT_MODE';
    }
  | {
      type: 'VIEW_MODE';
    }
  | {
      type: 'TOGGLE_STATE';
      payload: DashboardState;
    };

export type LayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
};

export type WidgetDesign = {};

export type WidgetBase = {
  id: string;
  type: string;
  typeId: string;
  label: string;
  dataKey: string;
  dataSubKey?: string;
  layout: LayoutItem;
  controlTopic?: string;
};

export type SwitchWidgetDesignConfig = {
  title?: string;
  isTitleHidden?: boolean;
  color?: string;
  showOnOffLabel?: boolean;
  onLabelText?: string;
  offLabelText?: string;
  labelPosition?: 'right' | 'left';
};

export interface ValueCardWidgetData extends WidgetBase {
  type: 'value-card';
  data?: string | number;
}

export interface SwitchWidgetData extends WidgetBase {
  type: 'switch';
  data?: boolean;
  design?: SwitchWidgetDesignConfig;
}

export type DashboardWidget = ValueCardWidgetData | SwitchWidgetData;

type DashboardState = 'readonly' | 'editing';

type Dashboard = {
  value: DashboardState;
  context: {
    id: string;
    widgets: DashboardWidget[];
    newWidgets: Set<string>;
    updatedWidgets: Set<string>;
    deletedWidgets: Set<string>;
  };
};

// const switchWidget1: Widget = {
//   id: '1',
//   type: 'switch',
//   typeId: 'value-card-1',
//   label: 'Value Card',
//   dataKey: 'temperature',
//   dataSubKey: 'current',
//   layout: { i: '1', x: 0, y: 0, w: 2, h: 2 },
//   data: 0,
// };

// flux/ state-machine
export function dashboardReducer(
  state: Dashboard,
  action: DashboardAction
): Dashboard {
  switch (state.value) {
    case 'readonly': {
      if (action.type === 'TOGGLE_STATE' && action.payload === 'editing') {
        return {
          ...state,
          value: action.payload,
        };
      }

      if (action.type === 'SET_WIDGETS') {
        return {
          ...state,
          value: 'readonly',
          context: {
            ...state.context,
            widgets: action.payload,
          },
        };
      }
      return state;
    }
    case 'editing': {
      if (action.type === 'TOGGLE_STATE') {
        return {
          ...state,
          value: action.payload,
        };
      }

      if (action.type === 'ADD_WIDGET') {
        const id = Date.now().toString();

        const maxYWidget = state.context.widgets.reduce(
          (maxWidget, widget) =>
            widget.layout.y > maxWidget.layout.y ? widget : maxWidget,
          state.context.widgets[0] // Start with the first widget
        );

        const yPos =
          state.context.widgets.length > 0
            ? maxYWidget.layout.y + maxYWidget.layout.h
            : 0;

        let newWidget: DashboardWidget = {
          ...action.payload,
          id,
          layout: { i: id, x: 0, y: yPos, w: 2, h: 3 },
        };

        if (action.payload.type === 'switch') {
          newWidget = {
            ...action.payload,
            id,
            layout: { i: id, x: 0, y: yPos, w: 2, h: 3 },
            controlTopic: action.payload.controlTopic,
            design: {
              title: action.payload.label,
            },
          };
        }

        return {
          ...state,
          context: {
            ...state.context,
            widgets: [...state.context.widgets, newWidget],
            newWidgets: new Set(state.context.newWidgets).add(newWidget.id),
          },
        };
      }

      if (action.type === 'UPDATE_WIDGET') {
        let updatedWidgets = new Set(state.context.updatedWidgets);
        if (!state.context.newWidgets.has(action.payload.id)) {
          updatedWidgets = updatedWidgets.add(action.payload.id);
        }

        return {
          ...state,
          context: {
            ...state.context,
            updatedWidgets,
            widgets: state.context.widgets.map((widget) =>
              widget.id === action.payload.id
                ? { ...widget, ...action.payload, type: widget.type }
                : widget
            ),
          },
        };
      }

      return state;
    }

    default:
      return state;
  }
}

type DashboardContextType = {
  state: Dashboard;
  dispatch: React.Dispatch<DashboardAction>;
  dashboardDataLoading: boolean;
};

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const { id: dashboardId } = useParams();
  const [state, dispatch] = useReducer(dashboardReducer, {
    value: 'readonly',
    context: {
      id: dashboardId ?? '',
      widgets: [],
      newWidgets: new Set<string>(),
      updatedWidgets: new Set<string>(),
      deletedWidgets: new Set<string>(),
    },
  });

  const {
    data,
    isFetched,
    isFetching,
    isLoading,
    isFetchedAfterMount,
    refetch,
  } = useGetWidgetsByDashboardId(state.value === 'editing', dashboardId);

  useEffect(() => {
    if (data && isFetched && isFetchedAfterMount && !isFetching) {
      dispatch({
        type: 'SET_WIDGETS',
        payload:
          data?.data.map((widget) => ({
            id: widget._id,
            typeId: widget.widget_infoId,
            label: widget.widget_label,
            type: widget.widget_type,
            dataKey: widget.data_key,
            layout: { ...widget.layout, i: widget._id },
            dataSubKey: widget.data_sub_key,
            controlTopic: widget.control_topic,
            data: widget.on_off_cmd,
          })) ?? [],
      });
    }
  }, [data, isFetched, isFetchedAfterMount, isFetching]);

  useEffect(() => {
    if (state.value === 'readonly') {
      refetch();
    }
  }, [state.value]);

  return (
    <DashboardContext.Provider
      value={{ state, dispatch, dashboardDataLoading: isLoading || isFetching }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

export { DashboardContext, DashboardProvider, useDashboard };
