import { apiCall } from '../apiClient';
import { ApiResponse } from './dashboardService';

export type Widget = {
  _id: string;
  widget_name: string;
  widget_type: string;
  description: string;
  is_subscribe: boolean;
};

export type AddWidgetPayload = {
  dashboardId: string;
  name: string;
  type: string;
  mainKey: string;
  subKey?: string;
};

const WidgetApiService = {
  getWidgets: () => apiCall<null, ApiResponse<Widget[]>>('get', `/widgets`),
  addWidget: (payload: AddWidgetPayload) =>
    apiCall<AddWidgetPayload, ApiResponse<unknown>>(
      'post',
      '/users/create-widget',
      payload
    ),

  getWidgetsByDashboardId: (id: string) => {},
};

export default WidgetApiService;
