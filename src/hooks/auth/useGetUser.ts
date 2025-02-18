import { useQuery } from '@tanstack/react-query';
import AuthApiService from '../../services/authService';
import useBoundStore from '../../store';
import { useEffect } from 'react';

export function useGetUser() {
  const { setUser, setToken } = useBoundStore();

  const { data, error, isError, refetch } = useQuery({
    queryKey: ['getUser'],
    queryFn: AuthApiService.getUser,
  });

  useEffect(() => {
    if (data) {
      setUser({
        firstName: data?.user?.firstName,
        lastName: data?.user?.lastName,
        email: data?.user?.email,
      });
      setToken(data?.accessToken);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      console.error('Failed to get user', error);
      console.info('Something went wrong! page should be shown');
    }
  }, [error, isError]);

  return {
    user: data?.user,
    refetchUser: refetch,
  };
}
