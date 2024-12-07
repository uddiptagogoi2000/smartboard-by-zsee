import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { RiArtboard2Line } from '@remixicon/react';
import BgPattern from '../../assets/bg-pattern.svg';
import { Field } from '../ui/field';
import { PasswordInput, PasswordStrengthMeter } from '../ui/password-input';
import { ColorModeProvider } from '../ui/color-mode';

function SignupCard() {
  return (
    <ColorModeProvider forcedTheme='light'>
      <Box
        minH={'100vh'}
        position={'relative'}
        bg={{ base: 'brand.lightestgrey', _dark: 'brand.darkestblue' }}
      >
        <Box
          position={'absolute'}
          top={0}
          right={0}
          bottom={0}
          left={0}
          bgImage={`url(${BgPattern})`}
          bgSize={'contain'}
          bgPos={'left 0 top -40%'}
          bgRepeat={'no-repeat'}
          opacity={1}
        />

        <Box pt={3}>
          <Container>
            <Flex alignItems={'center'}>
              <RiArtboard2Line size={24} />
              <Heading ml={1} size={'xl'} fontWeight={'light'}>
                SmartBoard
              </Heading>
            </Flex>
          </Container>
        </Box>
        <Box>
          <Stack mx={'auto'} maxW={'lg'} py={12} px={6} position={'relative'}>
            <Box
              rounded={'lg'}
              boxShadow={'lg'}
              p={8}
              bg={{ base: 'white', _dark: 'brand.layerdark' }}
            >
              <Stack align={'flex-start'} pb={8}>
                <Flex alignItems={'center'}>
                  <RiArtboard2Line size={24} />
                  <Heading ml={1} size={'xl'} fontWeight={'light'}>
                    SmartBoard
                  </Heading>
                </Flex>
                <Heading fontSize={'2xl'} textAlign={'center'}>
                  Create an account
                </Heading>
                <Text
                  fontSize={'md'}
                  color={{ base: 'gray.600', _dark: 'whiteAlpha.700' }}
                >
                  Start your IoT project with SmartBoard
                </Text>
              </Stack>
              <Stack gap={4}>
                <HStack>
                  <Box>
                    <Field
                      label='First Name'
                      required
                      helperText='This field is required'
                    >
                      <Input placeholder='Enter your first name' />
                    </Field>
                  </Box>
                  <Box>
                    <Field
                      label='Last Name'
                      required
                      helperText='This field is required'
                    >
                      <Input placeholder='Enter your last name' />
                    </Field>
                  </Box>
                </HStack>
                <Field
                  label='Email'
                  required
                  helperText='This field is required'
                >
                  <Input
                    type='email'
                    placeholder='Enter your email'
                    colorPalette={'white'}
                  />
                </Field>

                <Field
                  label='Password'
                  required
                  helperText='This field is required'
                >
                  <Stack width={'full'}>
                    <PasswordInput />
                    <PasswordStrengthMeter value={2} />
                  </Stack>
                </Field>

                <Field
                  label='Confirm Password'
                  required
                  helperText='This field is required'
                >
                  <Stack width={'full'}>
                    <PasswordInput />
                  </Stack>
                </Field>
                <Stack gap={10} pt={2}>
                  <Button
                    size='lg'
                    colorPalette={'teal'}
                    bgGradient='to-r'
                    gradientFrom={'teal.400'}
                    gradientTo={'teal.600'}
                  >
                    Sign up
                  </Button>
                </Stack>
                <Stack pt={4}>
                  <Text textAlign={'center'} fontSize={'sm'}>
                    Already a user? <Link colorPalette={'teal'}>Login</Link>
                  </Text>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
    </ColorModeProvider>
  );
}

export default SignupCard;
