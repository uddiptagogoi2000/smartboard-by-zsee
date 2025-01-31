import { useMutation, useQuery } from '@tanstack/react-query';
import WidgetApiService, {
  AddWidgetPayload,
} from '../../services/widgetService';

export const useGetWidgets = () => {
  return useQuery({
    queryKey: ['widgets'],
    queryFn: () => WidgetApiService.getWidgets(),
  });
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
