<template>
  <div class="tw-flex tw-justify-center tw-items-center tw-gap-1 tw-w-full tw-text-sm">
    <span class="tw-text-[color:var(--neutrals-500)]">{{ label || $t("VCMP_VENDOR_REGISTRATION.LOGIN_BUTTON.LABEL") }}</span>
    <VcButton
      variant="link"
      @click="onRegisterClick"
    >
      {{ text || $t("VCMP_VENDOR_REGISTRATION.LOGIN_BUTTON.TEXT") }}
    </VcButton>
  </div>
</template>

<script setup lang="ts">
import { VcButton } from "@vc-shell/framework";
import { useRouter } from "vue-router";

export interface Props {
  label?: string;
  text?: string;
}

defineProps<Props>();

const router = useRouter();

const onRegisterClick = () => {
  router.push("/registration");
};
</script>
