import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Table,
} from '@chakra-ui/react';
import { RiAddLine, RiResetRightLine, RiSearchLine } from '@remixicon/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { CommonDialog } from '../components/common/CommonDialog';
import CreateTopicForm from '../components/dashboard/CreateTopicForm';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '../components/ui/pagination';
import { useGetTopicList } from '../hooks/dashboard/useDashboard';
import PageLayout from '../layouts/PageLayout';
import { DashboardService } from '../services/dashboardService';

const TopicListPage = () => {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetTopicList();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: DashboardService.createTopic,
    onSuccess: () => {
      console.log('Topic created successfully');
      queryClient.invalidateQueries({
        queryKey: ['topicList'],
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error('Failed to create topic', error);
    },
  });

  return (
    <PageLayout fixedHeight isLoading={isLoading}>
      <CommonDialog
        title='Create Topic'
        open={open}
        onOpenChange={(open) => setOpen(open)}
      >
        <CreateTopicForm
          onOpenChange={(open) => setOpen(open)}
          onAdd={(payload: {
            deviceId: string;
            topicForControl: string;
            topicForPublish: string;
          }) => {
            mutation.mutate({
              ...payload,
            });
          }}
        />
      </CommonDialog>
      <Stack
        rounded={'sm'}
        height={'calc(0.95 * (100vh - 78px))'}
        bg={'transparent'}
      >
        <Flex justifyContent={'space-between'} p={4} alignItems={'center'}>
          <Heading>Topics</Heading>
          <HStack>
            <IconButton
              variant={'ghost'}
              rounded={'full'}
              onClick={() => setOpen(true)}
            >
              <RiAddLine />
            </IconButton>
            <IconButton variant={'ghost'} rounded={'full'}>
              <RiResetRightLine />
            </IconButton>
            <IconButton variant={'ghost'} rounded={'full'}>
              <RiSearchLine />
            </IconButton>
          </HStack>
        </Flex>
        <Table.ScrollArea height={'full'}>
          <Table.Root size='lg' stickyHeader interactive striped>
            <Table.Header>
              <Table.Row bg='bg.subtle'>
                <Table.ColumnHeader>Id</Table.ColumnHeader>
                <Table.ColumnHeader>Control</Table.ColumnHeader>
                <Table.ColumnHeader>Publish</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data?.data.map((item) => (
                <Table.Row
                  key={item.deviceId}
                  // onClick={() =>
                  //   navigate(
                  //     `/dashboards/${item._id}?name=${item.dashboard_name}&deviceId=${item.deviceUniqueId}`
                  //   )
                  // }
                >
                  <Table.Cell>{item.deviceId}</Table.Cell>
                  <Table.Cell>{item.topicForControl}</Table.Cell>
                  <Table.Cell>{item.topicForPublish}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <PaginationRoot count={5 * 5} pageSize={5} page={1} py={2} ml={'auto'}>
          <HStack wrap='wrap'>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Stack>
    </PageLayout>
  );
};

export default TopicListPage;
