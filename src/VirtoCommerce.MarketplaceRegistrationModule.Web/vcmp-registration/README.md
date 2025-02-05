# Marketplace Registration Module

This module provides registration functionality for marketplace vendors. It can be extended and customized when integrated into your application.

## Installation

Этот модуль можно установить используя динамические модули. Пример можно найти в [этом репозитории](https://github.com/VirtoCommerce/vc-shell/tree/main/src/VirtoCommerce.MarketplaceRegistrationModule.Web/vcmp-registration).

## Extending Registration Form

The module provides an extension system that allows you to customize the registration form. You can add new fields, modify existing ones, and handle form data.

### Getting Extensions

First, get access to the registration form extensions using the extensions helper:

```typescript
import { extensionsHelper } from '@vc-shell/framework';

const registrationFormExtensions = extensionsHelper.getInboundExtensions("registration", "registration-form");
```

### Adding New Fields

You can extend the registration form by adding new fields:

```typescript
registrationFormExtensions?.extendForm([
  {
    name: "customField",
    type: "text",
    component: "VcInput", // Any Vue component
    label: "Custom Field",
    placeholder: "Enter custom value",
    required: true,
    rules: "required", // VeeValidate rules
    priority: 25, // Controls field position
    props: {
      // Additional props for the component
    }
  }
]);
```

### Example: Adding File Upload

Here's an example of adding a file upload field with custom handling:

```typescript
import { VcFileUpload } from '@vc-shell/framework';
import { useAssets } from '@vc-shell/framework';

registrationFormExtensions?.extendForm([
  {
    name: "attachments",
    component: VcFileUpload,
    priority: 60,
    props: {
      variant: "file-upload",
      onUpload: async(files) => {
        const { upload } = useAssets();
        const assets = await upload(files, 'test');
        
        // Update form data with uploaded assets
        registrationFormExtensions?.updateFormData("attachments", assets);
      },
    },
  },
]);
```

### Available Methods

The registration form extensions provide several methods to manage the form:

```typescript
const {
  extendForm,      // Add new fields
  removeField,     // Remove a field by name
  updateField,     // Update field configuration
  updateFormData,  // Update field value
  getFormData,     // Get current form data
  setFormData,     // Set multiple field values
  clearFormData,   // Clear all form data
  formData,        // Reactive form data object
  formConfig       // Reactive form configuration
} = registrationFormExtensions;
```

### Field Priorities

The default fields are positioned with priorities in steps of 10:
- firstName: 10
- lastName: 20
- organizationName: 30
- contactEmail: 40
- contactPhone: 50

When adding new fields, use priorities accordingly to position them where needed.

### Form Data Handling

You can watch form data changes:

```typescript
import { watch } from 'vue';

watch(() => registrationFormExtensions?.formData.value, (newData) => {
  console.log('Form data changed:', newData);
}, { deep: true });
```

## TypeScript Support

The module includes TypeScript definitions. Here are the main interfaces:

```typescript
interface IFormField {
  name: string;
  type: string;
  component: string | Component;
  label?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  rules?: string;
  props?: Record<string, unknown>;
  priority?: number;
}

interface IRegistrationFormConfig {
  fields: IFormField[];
}
```

## Notes

- Field priorities help organize form layout - use them to position new fields relative to existing ones
- Form validation uses VeeValidate - refer to their documentation for validation rules
