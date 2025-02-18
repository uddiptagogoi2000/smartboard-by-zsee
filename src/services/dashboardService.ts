import { apiCall } from '../apiClient';

type Dashboard = {
  _id: string;
  dashboard_name: string;
  created_by: string;
  deviceUniqueId: string;
};

type Device = {
  deviceId: string;
  deviceUniqueId: string;
  deviceName: string;
  deviceType: string;
};

export const DashboardService = {
  getAllDashboards: () =>
    apiCall<null, Dashboard[]>('get', '/users/get-all-dashboards'),

  getDevicesByUser: () => apiCall<null, Device[]>('get', '/devicesByUser'),
};
