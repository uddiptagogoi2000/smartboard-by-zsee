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

type Topic = {
  topicId: string;
  deviceId: string;
  topicForPublish: string;
  topicForControl: string;
};

type ControlTopic = Pick<Topic, 'deviceId' | 'topicForControl'>;

type CreateTopicPayload = {
  deviceId: string;
  topicForControl: string;
  topicForPublish: string;
};

type CreateDashboardPayload = {
  dashboard_name: string;
  device_id: string;
  description: string;
};

export const DashboardService = {
  getAllDashboards: () =>
    apiCall<null, Dashboard[]>('get', '/users/get-all-dashboards'),
  createDashboard: (payload: CreateDashboardPayload) =>
    apiCall<CreateDashboardPayload, unknown>(
      'post',
      '/users/create-dashboard',
      payload
    ),

  getDevicesByUser: () => apiCall<null, Device[]>('get', '/devicesByUser'),
  getTopicList: () => apiCall<null, Topic[]>('get', '/topicsByUser'),
  getControlTopicsByUser: (deviceId: string) =>
    apiCall<null, ControlTopic[]>('get', `/controlTopics?deviceId=${deviceId}`),
  createTopic: (payload: CreateTopicPayload) =>
    apiCall<CreateTopicPayload, unknown>('post', '/topics', payload),
};
