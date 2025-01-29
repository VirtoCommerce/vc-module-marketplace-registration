<template>
  <VcLoginForm
    :logo="customization.logo"
    :background="background"
    :title="$t('VCMP_VENDOR_REGISTRATION.TITLE')"
  >
    <VcForm
      v-if="!registerResult.isSuccess"
      class="registration-form"
    >
      <template
        v-for="field in formConfig.fields"
        :key="field.name"
      >
        <Field
          v-slot="{ errorMessage, handleChange, errors }"
          :name="field.name"
          :label="field.label ? $t(field.label) : undefined"
          :model-value="formData[field.name]"
          :rules="field.rules"
        >
          <component
            :is="field.component"
            v-model="formData[field.name]"
            :type="field.type"
            :label="field.label ? $t(field.label) : undefined"
            :placeholder="field.placeholder ? $t(field.placeholder) : undefined"
            :hint="field.hint ? $t(field.hint) : undefined"
            :error="!!errors.length"
            :error-message="errorMessage"
            :required="field.required"
            v-bind="field.props || {}"
            @update:model-value="handleChange"
          />
        </Field>
      </template>

      <VcButton
        type="submit"
        :loading="registrationLoading"
        :disabled="registrationLoading || !isValid"
        @click="onSubmit"
      >
        {{ $t("VCMP_VENDOR_REGISTRATION.SUBMIT") }}
      </VcButton>

      <VcHint
        v-if="!!registerResult.error"
        class="registration-form__error"
      >
        {{ registerResult.error }}
      </VcHint>
    </VcForm>
    <div v-else>
      <p>{{ $t("VCMP_VENDOR_REGISTRATION.SUCCESS") }}</p>
    </div>
  </VcLoginForm>
</template>

<script lang="ts" setup>
import { useSettings } from "@vc-shell/framework";
import { Field, useForm, useIsFormValid, defineRule } from "vee-validate";
import { computed, ref } from "vue";
import { useRegistration } from "../composables";
import { ICreateRegistrationRequestCommand } from "@vcmp-registration/api/marketplaceregistration";
import { useI18n } from "vue-i18n";
import { useRegistrationForm } from "../composables/useRegistrationForm";

export interface Props {
  logo: string;
  background: string;
}

const props = defineProps<Props>();

const { uiSettings, loading: customizationLoading } = useSettings();

const { validate } = useForm({
  validateOnMount: false,
});

const isValid = useIsFormValid();
const registerResult = ref({
  isSuccess: false,
  error: "",
});

const { t } = useI18n({ useScope: "global" });

const { register, loading: registrationLoading } = useRegistration();

const { formConfig } = useRegistrationForm();

const formData = ref<Record<string, unknown>>({});

formConfig.value.fields.forEach((field) => {
  formData.value[field.name] = "";
});

defineRule("phone", (value: string) => {
  const phonePattern = /^\+?[1-9]\d{1,14}$/;

  if (!phonePattern.test(value)) {
    return t("VCMP_VENDOR_REGISTRATION.VALIDATION.PHONE_INVALID");
  }

  return true;
});

const onSubmit = async () => {
  const { valid } = await validate();

  if (valid) {
    try {
      await register(formData.value as unknown as ICreateRegistrationRequestCommand);

      registerResult.value.isSuccess = true;

      formData.value = {};
    } catch (error) {
      try {
        const parsedError = JSON.parse(JSON.stringify(error));
        const errorResponse = JSON.parse(parsedError.response);
        registerResult.value.error = t("VCMP_VENDOR_REGISTRATION.ERRORS.REGISTRATION_ERROR") + errorResponse.message;
      } catch {
        registerResult.value.error = t("VCMP_VENDOR_REGISTRATION.ERRORS.DEFAULT_ERROR");
        console.error(t("VCMP_VENDOR_REGISTRATION.ERRORS.PARSING_ERROR"), error);
      }
    }
  }
};

const customization = computed(() => {
  return {
    logo: !customizationLoading.value ? uiSettings.value?.logo || props.logo : "",
  };
});
</script>

<style lang="scss">
:root {
  --registration-form-error-color: var(--danger-500);
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__error {
    color: var(--registration-form-error-color) !important;
  }
}
</style>
