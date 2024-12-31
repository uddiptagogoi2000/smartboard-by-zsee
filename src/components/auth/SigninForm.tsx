import { Flex, Heading, Input, Link, Stack, Text } from '@chakra-ui/react';
import { RiArtboard2Line, RiLock2Line, RiMailLine } from '@remixicon/react';
import { capitalizeFirstLetter } from '../../utils';
import { Field } from '../ui/field';
import { PasswordInput } from '../ui/password-input';
import * as yup from 'yup';
import { signinSchema } from '../../schemas';
import useAuth from '../../hooks/auth/useAuth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toaster } from '../ui/toaster';
import { InputGroup } from '../ui/input-group';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

type FormData = yup.InferType<typeof signinSchema>;

const signinToasterMessages = {
  success: {
    title: 'Signin Successful',
    description: 'You have been signed in successfully.',
  },
  error: {
    title: 'Signin Failed',
    description: 'There was an issue with signing in. Please try again.',
  },
  loading: {
    title: 'Processing Signin',
    description: 'Please wait while we sign you in.',
  },
};

const SigninForm = () => {
  const { signIn, signInLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(signinSchema, { abortEarly: false }),
  });

  const onSubmit = ({ email, password }: FormData) => {
    toaster.promise(
      signIn({
        email,
        password,
      }),
      signinToasterMessages
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack align='center' pb={8}>
        <Flex mx={'auto'} mb={'4'}>
          <RiArtboard2Line size={24} />
          <Heading ml={1} size={'xl'} fontWeight={'light'}>
            SmartBoard
          </Heading>
        </Flex>
        <Heading fontSize={'2xl'} textAlign={'center'}>
          Sign in to your account
        </Heading>
        <Text fontSize={'md'} color={{ base: 'gray.600' }}>
          Start your IoT project with SmartBoard
        </Text>
      </Stack>
      <Stack gap={4}>
        <Field
          label='Email'
          errorText={capitalizeFirstLetter(errors.email?.message)}
          invalid={!!errors.email}
          required
          colorPalette={'teal'}
        >
          <InputGroup startElement={<RiMailLine size={'15'} />} w={'full'}>
            <Input
              type='email'
              placeholder='Enter your email'
              colorPalette={'white'}
              formNoValidate
              {...register('email')}
            />
          </InputGroup>
        </Field>
        <Field
          label='Password'
          errorText={capitalizeFirstLetter(errors.password?.message)}
          invalid={!!errors.password}
          required
          colorPalette={'teal'}
        >
          <InputGroup startElement={<RiLock2Line size={'15'} />} w={'full'}>
            <PasswordInput
              type='password'
              placeholder='Enter your password'
              {...register('password')}
            />
          </InputGroup>
        </Field>
        <Button
          size='lg'
          colorPalette={'teal'}
          bgGradient='to-r'
          gradientFrom={'teal.400'}
          gradientTo={'teal.600'}
          type='submit'
          loading={signInLoading}
        >
          Sign in
        </Button>
        <Text textAlign={'center'} fontSize={'sm'} mt={'3'}>
          Don't have an account?{' '}
          <Link onClick={() => navigate('/signup')} colorPalette={'teal'}>
            Sign up
          </Link>
        </Text>
      </Stack>
    </form>
  );
};

export default SigninForm;
