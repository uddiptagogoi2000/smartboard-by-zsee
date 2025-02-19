import { createContext, useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { useGetWidgetsByDashboardId } from '../../hooks/widgets/useWidgets';

type DashboardAction =
  | {
      type: 'ADD_WIDGET';
      payload: Pick<
        Widget,
        'dataKey' | 'dataSubKey' | 'label' | 'type' | 'typeId'
      >;
    }
  | {
      type: 'UPDATE_WIDGET';
      payload: { id: string } & Partial<Omit<Widget, 'id'>>;
    }
  | {
      type: 'DELETE_WIDGET';
      payload: string;
    }
  | {
      type: 'SET_WIDGETS';
      payload: Widget[];
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

type WidgetLayout = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
};

export type LayoutItem = WidgetLayout;

export type BaseWidget = {
  id: string;
  type: string;
  typeId: string;
  label: string;
  dataKey: string;
  dataSubKey?: string;
  layout: WidgetLayout;
};

interface ValueCardWidget extends BaseWidget {
  type: 'value-card';
  data?: string | number;
}

export type Widget = ValueCardWidget;

type DashboardState = 'readonly' | 'editing' | 'fetching' | 'persisting';

type Dashboard = {
  value: DashboardState;
  context: {
    id: string;
    widgets: Widget[];
    newWidgets: Set<string>;
    updatedWidgets: Set<string>;
    deletedWidgets: Set<string>;
  };
};

// flux/ state-machine
export function dashboardReducer(
  state: Dashboard,
  action: DashboardAction
): Dashboard {
  // console.log({
  //   state,
  //   action,
  // });

  switch (state.value) {
    case 'readonly': {
      if (
        action.type === 'TOGGLE_STATE' &&
        (action.payload === 'editing' || action.payload === 'fetching')
      ) {
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
      if (action.type === 'TOGGLE_STATE' && action.payload !== 'fetching') {
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

        const newWidget: Widget = {
          ...action.payload,
          id,
          layout: { i: id, x: 0, y: yPos, w: 2, h: 3 },
        };

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
                ? { ...widget, ...action.payload }
                : widget
            ),
          },
        };
      }

      return state;
    }
    case 'fetching': {
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

      if (action.type === 'TOGGLE_STATE' && action.payload === 'readonly') {
        return {
          ...state,
          value: action.payload,
        };
      }
      return state;
    }
    case 'persisting': {
      // if success, change state to view
      // if error, change state to edit
      if (action.type === 'TOGGLE_STATE') {
        return {
          ...state,
          value: action.payload,
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
    isSuccess,
    isPending,
    isLoading,
    isFetching,
    isFetchedAfterMount,
    refetch,
  } = useGetWidgetsByDashboardId(state.value === 'editing', dashboardId);

  console.log({
    state,
    isFetched,
    isSuccess,
    isPending,
    isLoading,
    isFetching,
    isFetchedAfterMount,
  });

  useEffect(() => {
    if (data && isFetched && isFetchedAfterMount && !isFetching) {
      console.log('setting widgets');
      dispatch({
        type: 'SET_WIDGETS',
        payload:
          data?.data.map((widget) => ({
            id: widget._id,
            typeId: widget.widget_infoId,
            label: widget.widget_label,
            type: 'value-card',
            dataKey: widget.data_key,
            layout: { ...widget.layout, i: widget._id },
            dataSubKey: widget.data_sub_key,
          })) ?? [],
      });
    }
  }, [data, isFetched, isFetchedAfterMount, isFetching]);

  useEffect(() => {
    // console.log('isFetching', isFetching);
    // if (isFetching) {
    //   dispatch({
    //     type: 'TOGGLE_STATE',
    //     payload: 'fetching',
    //   });
    // }
  }, [isFetching]);

  // useEffect(() => {
  //   if (isFetched || isFetchedAfterMount) {
  //     dispatch({
  //       type: 'TOGGLE_STATE',
  //       payload: 'readonly',
  //     });
  //   }
  // }, [isFetched, isFetchedAfterMount]);

  useEffect(() => {
    if (state.value === 'readonly') {
      refetch();
    }
  }, [state.value]);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
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
