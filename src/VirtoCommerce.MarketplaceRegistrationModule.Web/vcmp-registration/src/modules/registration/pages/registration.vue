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
            :loading="field.name === 'contactEmail' && validateEmailLoading"
            v-bind="field.props || {}"
            @update:model-value="
              (value) => {
                handleChange(value);
                updateFormData(field.name, value);
              }
            "
          />
        </Field>
      </template>

      <div class="registration-form__button">
        <VcButton
          type="submit"
          :loading="registrationLoading"
          :disabled="registrationLoading || !isValid"
          @click="onSubmit"
        >
          {{ $t("VCMP_VENDOR_REGISTRATION.SUBMIT") }}
        </VcButton>
      </div>

      <VcHint
        v-if="!!registerResult.error"
        class="registration-form__error"
      >
        {{ registerResult.error }}
      </VcHint>
    </VcForm>
    <div v-else>
      <p class="registration-form__success">{{ $t("VCMP_VENDOR_REGISTRATION.SUCCESS") }}</p>
    </div>
  </VcLoginForm>
</template>

<script lang="ts" setup>
import { useSettings } from "@vc-shell/framework";
import { Field, useForm, useIsFormValid, defineRule } from "vee-validate";
import { computed, ref } from "vue";
import { useRegistration, useRegistrationForm } from "../composables";
import { ICreateRegistrationRequestCommand } from "@vcmp-registration/api/marketplaceregistration";
import { useI18n } from "vue-i18n";

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

const { register, loading: registrationLoading, validateEmail, validateEmailLoading } = useRegistration();

const { formConfig, formData, updateFormData, clearFormData } = useRegistrationForm();

defineRule("phone", (value: string) => {
  const phonePattern = /^\+?[0-9]\d{1,14}$/;

  if (value === "") {
    return true;
  }

  if (!phonePattern.test(value)) {
    return t("VCMP_VENDOR_REGISTRATION.VALIDATION.PHONE_INVALID");
  }

  return true;
});

defineRule("emailWithServerValidation", async (value: string) => {
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (!value) {
    return t("VCMP_VENDOR_REGISTRATION.VALIDATION.EMAIL_REQUIRED");
  }

  if (!emailPattern.test(value)) {
    return t("VCMP_VENDOR_REGISTRATION.VALIDATION.EMAIL_INVALID");
  }

  try {
    const result = await validateEmail(formData.value);

    const mailValidationError = result.find((error) => error.propertyName === "ContactEmail");

    if (
      mailValidationError &&
      (mailValidationError.errorCode === "SELLER_EMAIL_ALREADY_EXISTS" ||
        mailValidationError.errorCode === "REQUEST_EMAIL_ALREADY_EXISTS")
    ) {
      return t("VCMP_VENDOR_REGISTRATION.VALIDATION.EMAIL_ALREADY_EXISTS");
    }
  } catch (error) {
    console.error("Email validation error:", error);
    return t("VCMP_VENDOR_REGISTRATION.VALIDATION.EMAIL_VALIDATION_ERROR");
  }

  return true;
});

const onSubmit = async () => {
  const { valid } = await validate();

  console.log(formData.value);

  if (valid) {
    try {
      await register(formData.value as unknown as ICreateRegistrationRequestCommand);

      registerResult.value.isSuccess = true;

      clearFormData();
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

  &__success {
    white-space: pre-wrap;
  }

  &__button {
    display: flex;
    justify-content: center;
  }
}
</style>
