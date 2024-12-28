import {
  Bleed,
  Box,
  Flex,
  Grid,
  GridItem,
  Group,
  Heading,
  HStack,
  IconButton,
  Separator,
} from '@chakra-ui/react';
import PageLayout from '../layouts/PageLayout';
import {
  RiAddLine,
  RiCheckLine,
  RiCloseLine,
  RiPencilLine,
  RiResetRightLine,
  RiSearchLine,
} from '@remixicon/react';
import { Button } from '../components/ui/button';
import { useState } from 'react';

const DashboardDetailsPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingWidget, setIsAddingWidget] = useState(false);

  return (
    <PageLayout isLoading fixedHeight fullWidth>
      <Box
        bgColor={'Background'}
        width={{
          base: '100%',
          lg: '70%',
        }}
        zIndex={1}
        position={'absolute'}
        right={0}
        bottom={0}
        top={0}
        transition={'transform 0.3s'}
        transform={isAddingWidget ? 'translateX(0)' : 'translateX(100%)'}
      >
        <Flex justifyContent='space-between' alignItems='center' p={4}>
          <Heading>Select widgets bundle</Heading>
          <HStack>
            <IconButton variant={'ghost'} rounded={'full'}>
              <RiSearchLine />
            </IconButton>
            <IconButton
              variant={'ghost'}
              rounded={'full'}
              onClick={() => setIsAddingWidget(false)}
            >
              <RiCloseLine />
            </IconButton>
          </HStack>
        </Flex>
        <Grid templateColumns='repeat(4, 1fr)' gap={2} p={4}>
          <GridItem>Widget 1</GridItem>
          <GridItem>Widget 2</GridItem>
        </Grid>
      </Box>
      {!isAddingWidget && (
        <Grid
          templateColumns={{
            base: '1fr',
            lg: 'repeat(2, 1fr)',
          }}
          bgColor={'teal'}
          color={'white'}
          p={2}
          alignItems={'center'}
          gap={{
            base: '2',
            lg: '0',
          }}
        >
          <GridItem>Demo</GridItem>
          <GridItem>
            <HStack
              lg={{
                justifyContent: 'flex-end',
                gap: 3,
              }}
            >
              {isEditing && (
                <Button
                  size='sm'
                  variant={'outline'}
                  color={'white'}
                  _hover={{
                    bg: 'none',
                  }}
                  onClick={() => setIsAddingWidget(true)}
                >
                  <RiAddLine /> Add widget
                </Button>
              )}
              {isEditing && <Separator orientation='vertical' height='4' />}
              {isEditing ? (
                <Group>
                  <Button
                    size='sm'
                    variant='ghost'
                    colorPalette={'teal'}
                    color={'white'}
                    _hover={{
                      bg: 'colorPalette.500/20',
                    }}
                    onClick={() => setIsEditing(false)}
                  >
                    <RiCloseLine /> Cancel
                  </Button>
                  <Button
                    size='sm'
                    variant={'outline'}
                    color={'white'}
                    _hover={{
                      bg: 'none',
                    }}
                    onClick={() => setIsEditing(false)}
                  >
                    <RiCheckLine /> Save
                  </Button>
                </Group>
              ) : (
                <Button
                  size='sm'
                  color={'white'}
                  variant='outline'
                  _hover={{
                    bg: 'none',
                  }}
                  onClick={() => setIsEditing(true)}
                >
                  <RiPencilLine /> Edit mode
                </Button>
              )}
              {/* <IconButton variant={'ghost'} rounded={'full'}>
              <RiAddLine />
            </IconButton>
            <IconButton variant={'ghost'} rounded={'full'}>
              <RiResetRightLine />
            </IconButton>
            <IconButton variant={'ghost'} rounded={'full'}>
              <RiSearchLine />
            </IconButton>
            <IconButton variant={'ghost'} rounded={'full'}>
              <RiSearchLine />
            </IconButton>
            <IconButton variant={'ghost'} rounded={'full'}>
              <RiSearchLine />
            </IconButton>
            <IconButton variant={'ghost'} rounded={'full'}>
              <RiSearchLine />
            </IconButton> */}
            </HStack>
          </GridItem>
        </Grid>
      )}
    </PageLayout>
  );
};

export default DashboardDetailsPage;
