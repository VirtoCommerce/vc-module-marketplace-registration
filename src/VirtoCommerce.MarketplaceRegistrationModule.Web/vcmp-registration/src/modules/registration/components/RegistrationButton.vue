<template>
  <div class="tw-flex tw-justify-center tw-items-center tw-pt-4 tw-w-full">
    <VcButton
      :variant="variant"
      @click="onRegisterClick"
      >{{ text }}</VcButton
    >
  </div>
</template>

<script setup lang="ts">
import { VcButton } from "@vc-shell/framework";
import { useRouter } from "vue-router";

export interface Props {
  text: string;
  variant?: "primary" | "secondary";
}

defineProps<Props>();

const router = useRouter();

const onRegisterClick = () => {
  router.push("/registration");
};
</script>
