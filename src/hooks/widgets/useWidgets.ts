import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import WidgetApiService, {
  AddWidgetPayload,
} from '../../services/widgetService';
import { useDashboard } from '../../components/context/DashboardRefactor';

export const useGetWidgets = (isOpen: boolean) => {
  const queryInfo = useQuery({
    queryKey: ['widgets'],
    queryFn: () => WidgetApiService.getWidgets(),
    enabled: isOpen,
  });

  return {
    ...queryInfo,
    data: queryInfo.data?.data,
  };
};

export const useGetWidgetsByDashboardId = (
  isEditing: boolean,
  dashboardId?: string
) => {
  const queryInfo = useQuery({
    queryKey: ['widgets', dashboardId],
    queryFn: () => WidgetApiService.getWidgetsByDashboardId(dashboardId ?? ''),
    enabled: !!dashboardId,
    refetchOnWindowFocus: () => (isEditing ? false : true),
  });

  return {
    ...queryInfo,
    data: queryInfo.data?.data,
  };
};

export const useValidateWidgetSubkey = () => {
  const mutation = useMutation({
    mutationFn: WidgetApiService.validateWidgetSubkey,
    onSuccess: () => {
      console.log('Widget subkey is valid');
    },
    onError: (error) => {
      console.error('Widget subkey is invalid', error);
    },
  });

  return mutation;
};

export const useAddWidget = () => {
  const mutation = useMutation({
    mutationFn: WidgetApiService.addWidget,
    onSuccess: () => {
      console.log('Widget added successfully');
    },
    onError: (error) => {
      console.error('Failed to add widget', error);
    },
  });

  return {
    addWidget: async (payload: AddWidgetPayload) => {
      await mutation.mutateAsync(payload);
    },
    isLoading: mutation.isPending,
  };
};

export const useSaveDashboard = (dashboardId: string) => {
  const { dispatch } = useDashboard();
  const queryClient = new QueryClient();

  const mutation = useMutation({
    mutationFn: WidgetApiService.saveDashboard,
    onSuccess: () => {
      console.log('Dashboard saved successfully');
      queryClient.invalidateQueries({ queryKey: ['widgets', dashboardId] });

      dispatch({ type: 'TOGGLE_STATE', payload: 'readonly' });
      dispatch({ type: 'RESET_DASHBOARD' });
    },
    onError: (error) => {
      console.error('Failed to save dashboard', error);
    },
  });

  return mutation;
};

// control widgets update api
export const useUpdateControlWidget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: WidgetApiService.updateButton,
    onSuccess: () => {
      console.log('Button updated successfully');
      queryClient.invalidateQueries({ queryKey: ['widgets'] });
    },
    onError: (error) => {
      console.error('Failed to update button', error);
    },
  });
};
