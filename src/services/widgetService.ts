import { apiCall } from '../apiClient';

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

export type ValidateWidgetSubkeyPayload = {
  dashboardId: string;
  dataKey: string;
  dataSubKey: string;
  widgetLabel: string;
};

type WidgetPayload = {
  widgetAssignId: string;
  widgetType: string;
  widgetInfoId: string;
  widgetLabel: string;
  subscribeTopic?: string;
  publishTopic?: string;
  controlTopic?: string;
  dataKey: string;
  dataSubKey?: string;
  layout: {
    i: string;
    x: number;
    y: number;
    h: number;
    w: number;
  };
};

export type WidgetResponse = {
  _id: string;
  widget_infoId: string;
  widget_label: string;
  publish_topic: string;
  data_key: string;
  data_sub_key: string;
  on_off_cmd: boolean;
  widget_type: 'value-card' | 'switch';
  layout: {
    i: string;
    x: number;
    y: number;
    h: number;
    w: number;
  };
};

export type UpdateButtonPayload = {
  topicForControl: string;
  controlCmd: boolean;
  dataKey: string;
  widgetAssignId: string;
};

export type SaveDashboardPayload = {
  dashboardId: string;
  updated_widgets: WidgetPayload[];
  new_widgets: Omit<WidgetPayload, 'widgetAssignId'>[];
};

const WidgetApiService = {
  getWidgets: () => apiCall<null, Widget[]>('get', `/widgets`),
  addWidget: (payload: AddWidgetPayload) =>
    apiCall<AddWidgetPayload, unknown>('post', '/users/create-widget', payload),

  getWidgetsByDashboardId: (dashboardId: string) =>
    apiCall<null, WidgetResponse[]>(
      'get',
      `/users/dashboards/${dashboardId}/widgets`
    ),
  validateWidgetSubkey: (payload: ValidateWidgetSubkeyPayload) =>
    apiCall<ValidateWidgetSubkeyPayload, any>(
      'post',
      '/is_validDataKey',
      payload
    ),

  saveDashboard: (payload: SaveDashboardPayload) =>
    apiCall<SaveDashboardPayload, unknown>('post', '/assignWidgets', payload),
  // control widgets update api
  updateButton: (payload: UpdateButtonPayload) =>
    apiCall<UpdateButtonPayload, unknown>(
      'post',
      '/mqtt/button/publish',
      payload
    ),
};

export default WidgetApiService;
