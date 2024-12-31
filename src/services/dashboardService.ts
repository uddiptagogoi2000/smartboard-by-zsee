import { apiCall } from '../apiClient';

type ApiResponse<T> = {
  statusCode: number;
  data: T;
  message: string;
};

type Dashboard = {
  _id: string;
  dashboard_name: string;
  created_by: string;
};

export const DashboardService = {
  getAllDashboards: () =>
    apiCall<null, ApiResponse<Dashboard[]>>('get', '/users/get-all-dashboards'),
};
