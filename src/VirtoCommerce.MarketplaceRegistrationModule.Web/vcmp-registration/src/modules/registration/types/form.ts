export interface IFormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'file' | 'custom';
  component: string;
  label: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  rules?: string;
  props?: Record<string, any>;
}

export interface IRegistrationFormConfig {
  fields: IFormField[];
}
