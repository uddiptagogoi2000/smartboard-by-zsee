import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { RiArtboard2Line } from '@remixicon/react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { signupSchema } from '../../schemas';
import { calculatePasswordStrength, capitalizeFirstLetter } from '../../utils';
import { Field } from '../ui/field';
import { PasswordInput, PasswordStrengthMeter } from '../ui/password-input';
import { toaster } from '../ui/toaster';
import useAuth from '../../hooks/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

type FormData = yup.InferType<typeof signupSchema>;

const signupToasterMessages = {
  success: {
    title: 'Signup Successful',
    description: 'Your account has been created successfully.',
  },
  error: {
    title: 'Signup Failed',
    description:
      'There was an issue with creating your account. Please try again.',
  },
  loading: {
    title: 'Processing Signup',
    description: 'Please wait while we complete your registration.',
  },
};

function SignupForm() {
  const { signUp, signUpLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(signupSchema, { abortEarly: false }),
  });

  const password = watch('password', '');
  const passwordStrength = calculatePasswordStrength(password);

  const onSubmit = ({
    email,
    password,
    firstName,
    lastName = '',
  }: FormData) => {
    toaster.promise(
      signUp({
        email,
        password,
        firstName,
        lastName,
      }),
      signupToasterMessages
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack
        align={{
          sm: 'center',
          md: 'flex-start',
        }}
        pb={8}
      >
        <Flex
          smDown={{
            mx: 'auto',
          }}
        >
          <RiArtboard2Line size={24} />
          <Heading ml={1} size={'xl'} fontWeight={'light'}>
            SmartBoard
          </Heading>
        </Flex>
        <Heading fontSize={'2xl'} textAlign={'center'}>
          Create an account
        </Heading>
        <Text fontSize={'md'} color={{ base: 'gray.600' }}>
          Start your IoT project with SmartBoard
        </Text>
      </Stack>
      <Stack gap={4}>
        <Grid
          alignItems={'flex-start'}
          templateColumns='1fr'
          md={{
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
          gap={'4'}
        >
          <GridItem>
            <Field
              label='First Name'
              errorText={capitalizeFirstLetter(errors.firstName?.message)}
              invalid={!!errors.firstName}
              required
              colorPalette={'teal'}
            >
              <Input
                placeholder='Enter your first name'
                {...register('firstName')}
              />
            </Field>
          </GridItem>
          <GridItem>
            <Field
              label='Last Name'
              errorText={capitalizeFirstLetter(errors.lastName?.message)}
              invalid={!!errors.lastName}
              colorPalette={'teal'}
            >
              <Input
                placeholder='Enter your last name'
                {...register('lastName')}
              />
            </Field>
          </GridItem>
        </Grid>
        <Field
          label='Email'
          errorText={capitalizeFirstLetter(errors.email?.message)}
          invalid={!!errors.email}
          required
          colorPalette={'teal'}
        >
          <Input
            type='email'
            placeholder='Enter your email'
            colorPalette={'white'}
            formNoValidate
            {...register('email')}
          />
        </Field>

        <Field
          label='Password'
          errorText={capitalizeFirstLetter(errors.password?.message)}
          invalid={!!errors.password}
          required
          colorPalette={'teal'}
        >
          <Stack width={'full'}>
            <PasswordInput
              type='password'
              placeholder='Enter your password'
              {...register('password')}
            />
            <PasswordStrengthMeter value={passwordStrength} />
          </Stack>
        </Field>

        <Field
          label='Confirm Password'
          errorText={capitalizeFirstLetter(errors.confirmPassword?.message)}
          invalid={!!errors.confirmPassword}
          required
          colorPalette={'teal'}
        >
          <Stack width={'full'}>
            <PasswordInput
              type='password'
              placeholder='Re-enter your password'
              {...register('confirmPassword')}
            />
          </Stack>
        </Field>
        <Stack gap={10} pt={2}>
          <Button
            size='lg'
            colorPalette={'teal'}
            bgGradient='to-r'
            gradientFrom={'teal.400'}
            gradientTo={'teal.600'}
            type='submit'
            loading={signUpLoading}
          >
            Sign up
          </Button>
        </Stack>
        <Stack pt={4}>
          <Text textAlign={'center'} fontSize={'sm'}>
            Already a user?{' '}
            <Link onClick={() => navigate('/signin')} colorPalette={'teal'}>
              Sign in
            </Link>
          </Text>
        </Stack>
      </Stack>
    </form>
  );
}

export default SignupForm;
