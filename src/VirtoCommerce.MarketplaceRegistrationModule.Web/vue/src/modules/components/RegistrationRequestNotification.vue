<template>
  <!-- legacy registration-request-notification: clicking it opened the request in the registration request list -->
  <NotificationTemplate
    color="var(--primary-500)"
    :title="notification.title ?? ''"
    icon="lucide-id-card"
    :notification="notificationRef"
  >
    <VcHint
      v-if="notification.description"
      class="tw-mb-1"
    >
      {{ notification.description }}
    </VcHint>
    <VcButton
      v-if="notification.registrationRequestId"
      size="sm"
      variant="secondary"
      @click="open"
    >
      {{ $t("MARKETPLACE_REGISTRATION.NOTIFICATION.OPEN") }}
    </VcButton>
  </NotificationTemplate>
</template>

<script setup lang="ts">
import { NotificationTemplate, useBlade, useNotificationContext } from "@vc-shell/framework";
import { VcButton, VcHint } from "@vc-shell/framework/ui";
import { computed } from "vue";
import type { RegistrationRequestPushNotification, RegistrationRequestsOptions } from "../types";

const notificationRef = useNotificationContext();
const notification = computed(() => notificationRef.value as unknown as RegistrationRequestPushNotification);
const { openBlade } = useBlade();

// the list as the workspace, with the request open next to it (legacy $state.go with the notification)
function open() {
  const options: RegistrationRequestsOptions = { openId: notification.value.registrationRequestId };
  openBlade({ name: "MarketplaceRegistrationRequests", isWorkspace: true, options });
}
</script>
