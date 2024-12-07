import { Box, Heading, Text, Button, Center } from '@chakra-ui/react';

export default function NotFound() {
  return (
    <Center h={'100%'}>
      <Box textAlign='center' py={10} px={6}>
        <Heading
          display='inline-block'
          as='h2'
          size='2xl'
          bgGradient='to-r'
          gradientFrom={'teal.400'}
          gradientTo={'teal.600'}
          backgroundClip='text'
        >
          404
        </Heading>
        <Text fontSize='18px' mt={3} mb={2}>
          Page Not Found
        </Text>
        <Text color={'gray.500'} mb={6}>
          The page you&apos;re looking for does not seem to exist
        </Text>

        <Button
          // bgGradient='to-r'
          // gradientFrom={'teal.400'}
          // gradientTo={'teal.600'}
          rounded={'full'}
          colorPalette={'teal'}
        >
          Go to Home
        </Button>
      </Box>
    </Center>
  );
}
