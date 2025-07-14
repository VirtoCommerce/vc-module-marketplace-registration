import { ref } from 'vue';

interface DialogInput {
  type: 'text' | 'textarea' | 'select';
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

interface DialogOptions {
  title: string;
  message: string;
  type: 'confirm' | 'info' | 'warning' | 'error';
  inputs?: DialogInput[];
  confirmText?: string;
  cancelText?: string;
}

interface DialogResult {
  confirmed: boolean;
  data?: Record<string, any>;
}

export function useDialog() {
  const isOpen = ref(false);
  const dialogOptions = ref<DialogOptions | null>(null);
  const dialogResolver = ref<((result: DialogResult) => void) | null>(null);

  const showDialog = (options: DialogOptions): Promise<DialogResult> => {
    return new Promise((resolve) => {
      dialogOptions.value = options;
      dialogResolver.value = resolve;
      isOpen.value = true;
    });
  };

  const closeDialog = (result: DialogResult) => {
    isOpen.value = false;
    if (dialogResolver.value) {
      dialogResolver.value(result);
      dialogResolver.value = null;
    }
    dialogOptions.value = null;
  };

  const confirmDialog = (data?: Record<string, any>) => {
    closeDialog({ confirmed: true, data });
  };

  const cancelDialog = () => {
    closeDialog({ confirmed: false });
  };

  return {
    isOpen,
    dialogOptions,
    showDialog,
    closeDialog,
    confirmDialog,
    cancelDialog,
  };
}