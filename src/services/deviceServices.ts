import { apiCall } from '../apiClient';

export type addDevicePayload = {
  deviceName: string;
  deviceType: string;
};

export type Device = {
  deviceId: string;
  deviceUniqueId: string;
  deviceName: string;
  deviceType: string;
};

export const DeviceService = {
  addDevice : (payload : addDevicePayload ) => apiCall<addDevicePayload, unknown>('post', '/users/create-device', payload),

  getDevicesByUser: () => apiCall<null, Device[]>('get', '/devicesByUser'),
};
