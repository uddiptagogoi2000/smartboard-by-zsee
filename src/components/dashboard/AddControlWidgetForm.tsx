import { createListCollection, HStack, Input, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useValidateWidget } from '../../hooks/widgets/useValidateWidget';
import { addControlWidgetSchema } from '../../schemas';
import { Button } from '../ui/button';
import { Field } from '../ui/field';
import { useEffect, useMemo, useRef } from 'react';
import { Widget } from '../context/DashboardRefactor';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../ui/select';
import { DashboardService } from '../../services/dashboardService';
import { useQuery } from '@tanstack/react-query';

type FormData = yup.InferType<typeof addControlWidgetSchema>;

type FormDialogProps = {
  onOpenChange: (open: boolean) => void;
};

type AddWidgetFormProps = FormDialogProps & {
  onAdd: (
    widgetInfo: Pick<Widget, 'dataKey' | 'controlTopic' | 'label'>
  ) => void;
  deviceId: string;
};

const AddControlWidgetForm = ({
  onOpenChange,
  onAdd,
  deviceId,
}: AddWidgetFormProps) => {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(addControlWidgetSchema, { abortEarly: false }),
  });

  const datakey = watch('dataKey');
  const widgetName = watch('widgetName');
  const { error, validate, clearErrors, setSubmitError } = useValidateWidget();
  const contentRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ['controlTopics'],
    queryFn: () => DashboardService.getControlTopicsByUser(deviceId),
  });

  const controlTopics = useMemo(() => {
    return createListCollection({
      items:
        data?.data?.data.map((item) => ({
          label: item.topicForControl,
          value: item.topicForControl,
        })) || [],
    });
  }, [data]);

  async function onSubmit(data: FormData) {
    console.log('onSubmit data: ', data);
    if (data.widgetName && data.dataKey) {
      const errors = await validate({
        dataKey: data.dataKey,
        widgetName: data.widgetName,
      });

      if (errors) {
        setSubmitError({
          dataKey: errors.dataKey,
          widgetName: errors.widgetName,
        });
      } else {
        onAdd({
          dataKey: data.dataKey,
          controlTopic: data.controlTopic[0],
          label: data.widgetName,
        });
        console.log('data', data);
      }
    }
  }

  useEffect(() => {
    clearErrors();
  }, [widgetName, datakey]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack ref={contentRef}>
        <Field
          label='Widget Name'
          errorText={errors.widgetName?.message || error.widgetName}
          invalid={!!errors.widgetName || !!error.widgetName}
          required
          colorPalette={'teal'}
        >
          <Input
            type='text'
            placeholder='Widget Name'
            colorPalette={'white'}
            formNoValidate
            {...register('widgetName')}
          />
        </Field>
        <Field
          label='Control Topic'
          invalid={!!errors.controlTopic}
          errorText={errors.controlTopic?.message}
          required
        >
          <Controller
            control={control}
            name='controlTopic'
            render={({ field }) => {
              return (
                <SelectRoot
                  collection={controlTopics}
                  value={field.value as string[]}
                  onValueChange={({ value }) => field.onChange(value)}
                  onInteractOutside={() => field.onBlur()}
                  colorPalette={'teal'}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder='Select device' />
                  </SelectTrigger>
                  <SelectContent portalRef={contentRef} maxHeight={'200px'}>
                    {controlTopics.items.map((topic) => (
                      <SelectItem item={topic} key={topic.value}>
                        {topic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              );
            }}
          />
        </Field>
        <Field
          label='Data Key'
          errorText={errors.dataKey?.message || error.dataKey}
          invalid={!!errors.dataKey || !!error.dataKey}
          required
          colorPalette={'teal'}
          helperText='Data key for the widget'
        >
          <Input
            type='text'
            placeholder='Data Key'
            colorPalette={'white'}
            formNoValidate
            {...register('dataKey')}
          />
        </Field>
      </Stack>
      <HStack gap={4} justifyContent={'flex-end'} mt={2}>
        <Button
          variant='ghost'
          colorScheme='gray'
          onClick={() => onOpenChange?.(false)}
        >
          Cancel
        </Button>
        <Button colorScheme='teal' type='submit'>
          Save
        </Button>
      </HStack>
    </form>
  );
};

export default AddControlWidgetForm;
