<template>
  <div class="registration-request-notification">
    <VcNotification
      :type="notification.type"
      :title="notification.title"
      :description="notification.description"
      :actions="actions"
      @action-click="onActionClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

interface Props {
  notification: {
    type: string;
    title: string;
    description: string;
    registrationRequestId?: string;
    [key: string]: any;
  };
}

const props = defineProps<Props>();
const router = useRouter();
const { t } = useI18n();

const actions = computed(() => [
  {
    id: 'view',
    label: t('VCMP_ADMIN.NOTIFICATIONS.REGISTRATION_REQUEST.VIEW'),
    primary: true,
  },
  {
    id: 'dismiss',
    label: t('VCMP_ADMIN.NOTIFICATIONS.REGISTRATION_REQUEST.DISMISS'),
  },
]);

const onActionClick = (actionId: string) => {
  if (actionId === 'view') {
    if (props.notification.registrationRequestId) {
      router.push(`/registration-requests/${props.notification.registrationRequestId}`);
    } else {
      router.push('/registration-requests');
    }
  } else if (actionId === 'dismiss') {
    // Handle dismiss action
    console.log('Notification dismissed');
  }
};
</script>

<style scoped>
.registration-request-notification {
  padding: 10px;
}
</style>