import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../../services/dashboardService';

export function useGetAllDashboards() {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ['getAllDashboards'],
    queryFn: DashboardService.getAllDashboards,
  });

  return {
    data,
    error,
    isLoading: isLoading || isFetching,
  };
}
