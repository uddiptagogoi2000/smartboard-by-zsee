import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../../services/dashboardService';

export function useGetAllDashboards() {
  const queryInfo = useQuery({
    queryKey: ['getAllDashboards'],
    queryFn: DashboardService.getAllDashboards,
  });

  return {
    ...queryInfo,
    data: queryInfo.data?.data,
  };
}
