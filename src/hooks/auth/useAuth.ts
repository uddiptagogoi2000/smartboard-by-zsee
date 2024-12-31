import { useMutation } from '@tanstack/react-query';
import type { SignInPayload, SignUpPayload } from '../../services/authService';
import AuthApiService from '../../services/authService';
import useBoundStore from '../../store';
import { useLocalStorageManager } from '../localStorage/useLocalStorageManager';
import { useNavigate } from 'react-router-dom';

function useAuth() {
  const setUser = useBoundStore((state) => state.setUser);
  const setToken = useBoundStore((state) => state.setToken);
  const { updateAuthState: updateAuthStateLS } = useLocalStorageManager();
  useNavigate;
  const navigate = useNavigate();

  const signUpMutation = useMutation({
    mutationFn: AuthApiService.signUp,
    onSuccess: () => {
      console.log('Signup successful');
    },
    onError: (error) => {
      console.error('Signup failed', error);
    },
  });

  const signInMutation = useMutation({
    mutationFn: AuthApiService.signIn,
    onSuccess: (data) => {
      console.log('Signin successful', data);
      setUser({
        firstName: data.data.data.user.firstName,
        email: data.data.data.user.email,
      });
      setToken(data.data.data.accessToken);
      updateAuthStateLS(true);
      console.log(useBoundStore.getState());
      navigate('/dashboards');
    },
    onError: (error) => {
      console.error('Signin failed', error);
    },
  });

  const signUp = async ({ lastName = '', ...payload }: SignUpPayload) => {
    await signUpMutation.mutateAsync({
      ...payload,
      lastName,
    });
  };

  const signIn = async (payload: SignInPayload) => {
    await signInMutation.mutateAsync(payload);
  };

  return {
    signUp,
    signUpLoading: signUpMutation.isPending,
    signIn,
    signInLoading: signInMutation.isPending,
  };
}

export default useAuth;
