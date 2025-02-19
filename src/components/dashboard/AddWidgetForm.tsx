import { HStack, Input, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useValidateWidget } from '../../hooks/widgets/useValidateWidget';
import { addWidgetSchema } from '../../schemas';
import { Button } from '../ui/button';
import { Field } from '../ui/field';
import { useEffect } from 'react';
import { Widget } from '../context/DashboardRefactor';

type FormData = yup.InferType<typeof addWidgetSchema>;

type FormDialogProps = {
  onOpenChange: (open: boolean) => void;
  onAdd: (widgetInfo: Pick<Widget, 'dataKey' | 'dataSubKey' | 'label'>) => void;
};

type AddWidgetFormProps = FormDialogProps;

const AddWidgetForm = ({ onOpenChange, onAdd }: AddWidgetFormProps) => {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(addWidgetSchema, { abortEarly: false }),
  });

  const datakey = watch('dataKey');
  const dataSubKey = watch('dataSubKey');
  const widgetName = watch('widgetName');
  const hasDatakey = !!datakey;
  const { error, validate, clearErrors, setSubmitError } = useValidateWidget();

  async function onSubmit(data: FormData) {
    if (data.widgetName && data.dataSubKey) {
      const errors = await validate({
        dataKey: data.dataKey,
        dataSubKey: data.dataSubKey,
        widgetName: data.widgetName,
      });

      if (errors) {
        setSubmitError({
          dataSubKey: errors.dataSubKey,
          widgetName: errors.widgetName,
        });
      } else {
        onAdd({
          dataKey: data.dataKey,
          dataSubKey: data.dataSubKey,
          label: data.widgetName,
        });
      }
    }
  }

  useEffect(() => {
    clearErrors();
  }, [dataSubKey, widgetName]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack>
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
            errorText={errors.dataSubKey?.message || error.dataSubKey}
            invalid={!!errors.dataSubKey || !!error.dataSubKey}
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
