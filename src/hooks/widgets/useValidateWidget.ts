import { useState } from 'react';
import { useDashboard } from '../../components/context/DashboardRefactor';

export function useValidateWidget() {
  const { state } = useDashboard();
  const [submitError, setSubmitError] = useState<{
    widgetName?: string;
    dataSubKey?: string;
  }>({});

  const validate = async ({
    widgetName,
    dataKey,
    dataSubKey,
  }: {
    widgetName: string;
    dataKey: string;
    dataSubKey: string;
  }): Promise<{ widgetName?: string; dataSubKey?: string } | null> => {
    return new Promise((resolve) => {
      const widgetNameTaken = state.context.widgets.some(
        (widget) => widget.label === widgetName
      );
      const dataSubKeyTaken = state.context.widgets.some(
        (widget) =>
          widget.dataKey === dataKey && widget.dataSubKey === dataSubKey
      );

      if (widgetNameTaken || dataSubKeyTaken) {
        resolve({
          widgetName: widgetNameTaken
            ? 'Widget name is already taken'
            : undefined,
          dataSubKey: dataSubKeyTaken
            ? 'Data sub key is already taken'
            : undefined,
        });
      } else {
        resolve(null);
      }
    });
  };

  const clearErrors = () => {
    setSubmitError({});
  };

  return {
    error: submitError,
    validate,
    clearErrors,
    setSubmitError,
  };
}
