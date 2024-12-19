import { useMutation } from '@tanstack/react-query';
import type { SignInPayload, SignUpPayload } from '../../services/authService';
import AuthApiService from '../../services/authService';
import useBoundStore from '../../store';

function useAuth() {
  const setUser = useBoundStore((state) => state.setUser);

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
    signIn,
  };
}

export default useAuth;
