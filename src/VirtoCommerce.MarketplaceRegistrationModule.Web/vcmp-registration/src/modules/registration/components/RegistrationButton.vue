<template>
  <VcButton @click="onRegisterClick">Register</VcButton>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const onRegisterClick = () => {
  router.push("/registration");
};
</script>
