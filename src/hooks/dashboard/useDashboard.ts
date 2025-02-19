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

export function useGetTopicList() {
  const queryInfo = useQuery({
    queryKey: ['topicList'],
    queryFn: DashboardService.getTopicList,
  });

  return {
    ...queryInfo,
    data: queryInfo.data?.data,
  };
}

export function useGetDevicesByUser() {
  const queryInfo = useQuery({
    queryKey: ['devices'],
    queryFn: DashboardService.getDevicesByUser,
  });

  return {
    ...queryInfo,
    data: queryInfo.data?.data,
  };
}
