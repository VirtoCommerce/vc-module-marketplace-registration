import { ref, computed, type Component } from "vue";
import { VcInput } from "@vc-shell/framework/ui";

export interface IFormField {
  name: string;
  type: string;
  component: Component;
  label?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  rules?: string;
  props?: Record<string, unknown>;
  priority?: number;
}

const defaultFields: IFormField[] = [
  {
    name: "firstName",
    type: "text",
    component: VcInput,
    label: "VCMP_VENDOR_REGISTRATION.LABELS.FIRST_NAME",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.FIRST_NAME",
    required: true,
    rules: "required",
    priority: 10,
  },
  {
    name: "lastName",
    type: "text",
    component: VcInput,
    label: "VCMP_VENDOR_REGISTRATION.LABELS.LAST_NAME",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.LAST_NAME",
    required: true,
    rules: "required",
    priority: 20,
  },
  {
    name: "organizationName",
    type: "text",
    component: VcInput,
    label: "VCMP_VENDOR_REGISTRATION.LABELS.ORGANIZATION",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.ORGANIZATION",
    required: true,
    rules: "required",
    priority: 30,
  },
  {
    name: "contactEmail",
    type: "email",
    component: VcInput,
    label: "VCMP_VENDOR_REGISTRATION.LABELS.EMAIL",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.EMAIL",
    hint: "VCMP_VENDOR_REGISTRATION.HINTS.EMAIL",
    required: true,
    rules: "required|email",
    priority: 40,
  },
  {
    name: "contactPhone",
    type: "tel",
    component: VcInput,
    label: "VCMP_VENDOR_REGISTRATION.LABELS.PHONE",
    placeholder: "VCMP_VENDOR_REGISTRATION.PLACEHOLDERS.PHONE",
    rules: "phone",
    priority: 50,
  },
];

// Module-level reactive state — other plugins can extend via extendForm()
const fields = ref<IFormField[]>([...defaultFields]);

export function useRegistrationForm() {
  const formData = ref<Record<string, unknown>>({});

  const formConfig = computed(() => ({
    fields: [...fields.value].sort((a, b) => (a.priority || 0) - (b.priority || 0)),
  }));

  const extendForm = (newFields: IFormField[]) => {
    fields.value.push(...newFields);
  };

  const removeField = (fieldName: string) => {
    fields.value = fields.value.filter((f) => f.name !== fieldName);
  };

  const updateField = (fieldName: string, updates: Partial<IFormField>) => {
    fields.value = fields.value.map((f) => (f.name === fieldName ? { ...f, ...updates } : f));
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
