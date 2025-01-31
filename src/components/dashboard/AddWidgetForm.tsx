import { HStack, Input, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { addWidgetSchema } from '../../schemas';
import { Button } from '../ui/button';
import { Field } from '../ui/field';
import { WidgetProps } from '../widgets/WidgetRenderer';

type FormData = yup.InferType<typeof addWidgetSchema>;

type FormDialogProps = {
  onOpenChange: (open: boolean) => void;
  onAdd: (widget: Omit<WidgetProps, 'id'>) => void;
};

type AddWidgetFormProps = FormDialogProps & {
  widgetDetails: {
    name: string;
    type: string;
    dashboardId: string;
  };
};

const AddWidgetForm = ({
  onOpenChange,
  onAdd,
  widgetDetails,
}: AddWidgetFormProps) => {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(addWidgetSchema, { abortEarly: false }),
  });

  const datakey = watch('dataKey');
  const hasDatakey = !!datakey;
  // const { addWidget, isLoading } = useAddWidget();

  function onSubmit(data: FormData) {
    // addWidget({
    //   dashboardId: widgetDetails.dashboardId,
    //   type: widgetDetails.type,
    //   name: data.widgetName,
    //   mainKey: data.mainKey,
    //   subKey: data.subKey,
    // });

    onAdd({
      dashboardId: widgetDetails.dashboardId,
      type: 'value-card',
      name: data.widgetName,
      dataKey: data.dataKey ?? '',
      dataSubkey: data.dataSubKey ?? '',
      data: {
        value: '0',
      },
    });

    onOpenChange(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack>
        <Field
          label='Widget Name'
          errorText={errors.widgetName?.message}
          invalid={!!errors.widgetName}
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
          label='Data Key'
          errorText={errors.dataKey?.message}
          invalid={!!errors.dataKey}
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
        {hasDatakey && (
          <Field
            label='Data Sub Key'
            errorText={errors.dataSubKey?.message}
            invalid={!!errors.dataSubKey}
            colorPalette={'teal'}
            helperText='Data Sub key for the widget'
          >
            <Input
              type='text'
              placeholder='Data Sub Key'
              colorPalette={'white'}
              formNoValidate
              {...register('dataSubKey')}
            />
          </Field>
        )}
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

export default AddWidgetForm;
