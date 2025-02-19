import { useQuery } from '@tanstack/react-query';
import { DeviceService } from '../../services/deviceServices';

export const useGetDevicesByUser = () => {
  const queryInfo = useQuery({
    queryKey: ['getAllDevices'],
    queryFn: () => DeviceService.getDevicesByUser(),
  });

  return {
    ...queryInfo,
    data: queryInfo.data?.data,
  };
}

export const useAddDevice = () => {

};