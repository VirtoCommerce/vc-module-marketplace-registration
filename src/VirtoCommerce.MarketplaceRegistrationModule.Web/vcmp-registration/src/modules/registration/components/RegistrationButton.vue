<template>
  <VcButton
    :variant="variant"
    @click="onRegisterClick"
    >{{ text }}</VcButton
  >
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
