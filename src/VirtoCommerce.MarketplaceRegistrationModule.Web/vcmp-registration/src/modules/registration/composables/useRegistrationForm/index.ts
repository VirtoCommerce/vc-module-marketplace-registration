import { ref, computed } from "vue";
import { useExtensionData } from "@vc-shell/framework";

export interface IFormField {
  name: string;
  type: string;
  component: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  rules?: string;
  props?: Record<string, unknown>;
  priority?: number;
}

export function useRegistrationForm() {
  const { data, updateData, getValue, setValue } = useExtensionData("registration-form");

  // Local form data
  const formData = ref<Record<string, unknown>>({});

  // Fields from extension system
  const formConfig = computed(() => ({
    fields: (data.value.fields || []).sort((a: IFormField, b: IFormField) => (a.priority || 0) - (b.priority || 0)),
  }));

  const extendForm = (newFields: IFormField[]) => {
    const currentFields = data.value.fields || [];
    updateData({
      fields: [...currentFields, ...newFields],
    });
  };

  const removeField = (fieldName: string) => {
    const currentFields = data.value.fields || [];
    updateData({
      fields: currentFields.filter((field: IFormField) => field.name !== fieldName),
    });
  };

  const updateField = (fieldName: string, updates: Partial<IFormField>) => {
    const currentFields = data.value.fields || [];
    const updatedFields = currentFields.map((field: IFormField) =>
      field.name === fieldName ? { ...field, ...updates } : field,
    );
    updateData({ fields: updatedFields });
  };

  const updateFormData = (fieldName: string, value: unknown) => {
    formData.value[fieldName] = value;
  };

  const getFormData = () => {
    return formData.value;
  };

  const setFormData = (newData: Record<string, unknown>) => {
    formData.value = { ...formData.value, ...newData };
  };

  const clearFormData = () => {
    formData.value = {};
  };

  return {
    formConfig,
    formData: computed(() => formData.value),
    extendForm,
    removeField,
    updateField,
    updateFormData,
    getFormData,
    setFormData,
    clearFormData,
  };
}
