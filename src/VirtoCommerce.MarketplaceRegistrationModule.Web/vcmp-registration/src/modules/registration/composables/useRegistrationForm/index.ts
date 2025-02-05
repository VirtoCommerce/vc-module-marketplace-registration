import { ref, computed } from "vue";

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

export interface IRegistrationFormConfig {
  fields: IFormField[];
}

const defaultFields: IFormField[] = [
  {
    name: "firstName",
    type: "text",
    component: "VcInput",
    label: "VCMP_VENDOR_REGISTRATION.LABELS.FIRST_NAME",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.FIRST_NAME",
    required: true,
    rules: "required",
    priority: 10,
  },
  {
    name: "lastName",
    type: "text",
    component: "VcInput",
    label: "VCMP_VENDOR_REGISTRATION.LABELS.LAST_NAME",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.LAST_NAME",
    required: true,
    rules: "required",
    priority: 20,
  },
  {
    name: "organizationName",
    type: "text",
    component: "VcInput",
    label: "VCMP_VENDOR_REGISTRATION.LABELS.ORGANIZATION",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.ORGANIZATION",
    required: true,
    rules: "required",
    priority: 30,
  },
  {
    name: "contactEmail",
    type: "email",
    component: "VcInput",
    label: "VCMP_VENDOR_REGISTRATION.LABELS.EMAIL",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.EMAIL",
    hint: "VCMP_VENDOR_REGISTRATION.HINTS.EMAIL",
    required: true,
    rules: "emailWithServerValidation",
    priority: 40,
  },
  {
    name: "contactPhone",
    type: "tel",
    component: "VcInput",
    label: "VCMP_VENDOR_REGISTRATION.LABELS.PHONE",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.PHONE",
    rules: "phone",
    priority: 50,
  },
];

const formConfig = ref<IRegistrationFormConfig>({
  fields: [...defaultFields],
});

const formData = ref<Record<string, unknown>>({});

defaultFields.forEach((field) => {
  formData.value[field.name] = "";
});

export function useRegistrationForm() {
  const extendForm = (newFields: IFormField[]) => {
    formConfig.value.fields = [...formConfig.value.fields, ...newFields].sort(
      (a, b) => (a.priority || 0) - (b.priority || 0),
    );

    newFields.forEach((field) => {
      if (!(field.name in formData.value)) {
        formData.value[field.name] = "";
      }
    });
  };

  const removeField = (fieldName: string) => {
    formConfig.value.fields = formConfig.value.fields.filter((field) => field.name !== fieldName);

    delete formData.value[fieldName];
  };

  const updateField = (fieldName: string, updates: Partial<IFormField>) => {
    const fieldIndex = formConfig.value.fields.findIndex((field) => field.name === fieldName);
    if (fieldIndex !== -1) {
      formConfig.value.fields[fieldIndex] = {
        ...formConfig.value.fields[fieldIndex],
        ...updates,
      };
      if ("priority" in updates) {
        formConfig.value.fields = formConfig.value.fields.sort((a, b) => (a.priority || 0) - (b.priority || 0));
      }
    }
  };

  const updateFormData = (fieldName: string, value: unknown) => {
    formData.value[fieldName] = value;
  };

  const getFormData = () => {
    return formData.value;
  };

  const setFormData = (data: Record<string, unknown>) => {
    formData.value = { ...formData.value, ...data };
  };

  const clearFormData = () => {
    formData.value = {};
  };

  return {
    formConfig: computed(() => formConfig.value),
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
