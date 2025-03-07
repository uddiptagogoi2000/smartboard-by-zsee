import { Flex, Group, Heading, HStack, Stack, Table } from '@chakra-ui/react';
import { RiAddLine } from '@remixicon/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommonDialog } from '../components/common/CommonDialog';
import CreateDashboardForm from '../components/dashboard/CreateDashboardForm';
import { Button } from '../components/ui/button';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '../components/ui/pagination';
import { useGetAllDashboards } from '../hooks/dashboard/useDashboard';
import PageLayout from '../layouts/PageLayout';
import { DashboardService } from '../services/dashboardService';

const DashboardListPage = () => {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetAllDashboards();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: DashboardService.createDashboard,
    onSuccess: () => {
      console.log('Topic created successfully');
      queryClient.invalidateQueries({ queryKey: ['getAllDashboards'] });

      setOpen(false);
    },
    onError: (error) => {
      console.error('Failed to create topic', error);
    },
  });

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <PageLayout fixedHeight isLoading={isLoading}>
      <CommonDialog
        title='Create Dashboard'
        open={open}
        onOpenChange={handleOpenChange}
      >
        <CreateDashboardForm
          onOpenChange={handleOpenChange}
          onAdd={(dashboardInfo) => {
            mutation.mutate({
              dashboard_name: dashboardInfo.title,
              device_id: dashboardInfo.deviceId,
              description: dashboardInfo.description,
            });
          }}
        />
      </CommonDialog>
      <Stack
        rounded={'lg'}
        height={'calc(0.95 * (100vh - 78px))'}
        bg={'bg.panel'}
        px={6}
      >
        <Flex justifyContent={'space-between'} py={8} alignItems={'center'}>
          <Heading>Dashboards</Heading>
          <HStack>
            <Button
              variant={'solid'}
              rounded={'sm'}
              size={'sm'}
              fontWeight={'bold'}
              onClick={() => handleOpenChange(true)}
            >
              <RiAddLine />
              Add dashboard
            </Button>
            {/* <IconButton variant={'ghost'} rounded={'full'}>
              <RiResetRightLine />
            </IconButton>
            <IconButton variant={'ghost'} rounded={'full'}>
              <RiSearchLine />
            </IconButton> */}
          </HStack>
        </Flex>
        <Table.ScrollArea height={'full'}>
          <Table.Root
            size='lg'
            stickyHeader
            interactive
            // striped
            colorPalette={'transparent'}
            variant={'line'}
            rounded={'md'}
          >
            <Table.Header>
              <Table.Row bg={'blackAlpha.300'} fontSize={'sm'}>
                <Table.ColumnHeader>Id</Table.ColumnHeader>
                <Table.ColumnHeader>Title</Table.ColumnHeader>
                <Table.ColumnHeader>Created By</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data?.data.map((item) => (
                <Table.Row
                  bg='transparent'
                  key={item._id}
                  onClick={() =>
                    navigate(
                      `/dashboards/${item._id}?name=${item.dashboard_name}&deviceId=${item.deviceUniqueId}`
                    )
                  }
                >
                  <Table.Cell>{item._id}</Table.Cell>
                  <Table.Cell>{item.dashboard_name}</Table.Cell>
                  <Table.Cell>{item.created_by}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <PaginationRoot
          count={items.length * 5}
          pageSize={5}
          page={1}
          py={2}
          mx={'auto'}
          variant='solid'
        >
          <Group attached>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </Group>
        </PaginationRoot>
      </Stack>
    </PageLayout>
  );
};

const items = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99 },
  { id: 2, name: 'Coffee Maker', category: 'Home Appliances', price: 49.99 },
  { id: 3, name: 'Desk Chair', category: 'Furniture', price: 150.0 },
  { id: 4, name: 'Smartphone', category: 'Electronics', price: 799.99 },
  { id: 5, name: 'Headphones', category: 'Accessories', price: 199.99 },
  { id: 6, name: 'Laptop', category: 'Electronics', price: 999.99 },
  { id: 7, name: 'Coffee Maker', category: 'Home Appliances', price: 49.99 },
  { id: 8, name: 'Desk Chair', category: 'Furniture', price: 150.0 },
  { id: 9, name: 'Smartphone', category: 'Electronics', price: 799.99 },
  { id: 10, name: 'Headphones', category: 'Accessories', price: 199.99 },
  { id: 11, name: 'Laptop', category: 'Electronics', price: 999.99 },
  { id: 12, name: 'Coffee Maker', category: 'Home Appliances', price: 49.99 },
  { id: 13, name: 'Desk Chair', category: 'Furniture', price: 150.0 },
  { id: 14, name: 'Smartphone', category: 'Electronics', price: 799.99 },
  { id: 15, name: 'Headphones', category: 'Accessories', price: 199.99 },
  { id: 16, name: 'Laptop', category: 'Electronics', price: 999.99 },
  { id: 17, name: 'Coffee Maker', category: 'Home Appliances', price: 49.99 },
  { id: 18, name: 'Desk Chair', category: 'Furniture', price: 150.0 },
  { id: 19, name: 'Smartphone', category: 'Electronics', price: 799.99 },
  { id: 20, name: 'Headphones', category: 'Accessories', price: 199.99 },
];

export default DashboardListPage;
