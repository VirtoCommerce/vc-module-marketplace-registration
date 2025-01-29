import { ref, computed } from "vue";
import type { IFormField, IRegistrationFormConfig } from "../types/form";

const defaultFields: IFormField[] = [
  {
    name: "firstName",
    type: "text",
    component: "VcInput",
    label: "VCMP_VENDOR_REGISTRATION.LABELS.FIRST_NAME",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.FIRST_NAME",
    required: true,
    rules: "required",
  },
  {
    name: "lastName",
    type: "text",
    component: "VcInput",
    label: "VCMP_VENDOR_REGISTRATION.LABELS.LAST_NAME",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.LAST_NAME",
    required: true,
    rules: "required",
  },
  {
    name: "organizationName",
    type: "text",
    component: "VcInput",
    label: "VCMP_VENDOR_REGISTRATION.LABELS.ORGANIZATION",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.ORGANIZATION",
    required: true,
    rules: "required",
  },
  {
    name: "contactEmail",
    type: "email",
    component: "VcInput",
    label: "VCMP_VENDOR_REGISTRATION.LABELS.EMAIL",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.EMAIL",
    hint: "VCMP_VENDOR_REGISTRATION.HINTS.EMAIL",
    required: true,
    rules: "required|email",
  },
  {
    name: "contactPhone",
    type: "tel",
    component: "VcInput",
    label: "VCMP_VENDOR_REGISTRATION.LABELS.PHONE",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.PHONE",
    rules: "phone",
  },
];

const formConfig = ref<IRegistrationFormConfig>({
  fields: [...defaultFields],
});

export function useRegistrationForm() {
  const extendForm = (newFields: IFormField[]) => {
    formConfig.value.fields = [...formConfig.value.fields, ...newFields];
  };

  const removeField = (fieldName: string) => {
    formConfig.value.fields = formConfig.value.fields.filter((field) => field.name !== fieldName);
  };

  const updateField = (fieldName: string, updates: Partial<IFormField>) => {
    const fieldIndex = formConfig.value.fields.findIndex((field) => field.name === fieldName);
    if (fieldIndex !== -1) {
      formConfig.value.fields[fieldIndex] = {
        ...formConfig.value.fields[fieldIndex],
        ...updates,
      };
    }
  };

  return {
    formConfig: computed(() => formConfig.value),
    extendForm,
    removeField,
    updateField,
  };
}
