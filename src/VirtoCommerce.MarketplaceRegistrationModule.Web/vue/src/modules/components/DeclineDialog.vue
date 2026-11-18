<template>
  <VcPopup
    :title="$t('MARKETPLACE_REGISTRATION.DECLINE.TITLE')"
    variant="warning"
    @close="$emit('close')"
  >
    <template #content>
      <div class="registration-decline">
        <p>{{ $t("MARKETPLACE_REGISTRATION.DECLINE.MESSAGE") }}</p>
        <VcTextarea
          v-model="reason"
          :label="$t('MARKETPLACE_REGISTRATION.DECLINE.LABEL')"
          :placeholder="$t('MARKETPLACE_REGISTRATION.DECLINE.PLACEHOLDER')"
          :maxlength="REASON_MAX_LENGTH"
          required
        />
      </div>
    </template>
    <template #footer="{ close }">
      <VcButton
        variant="secondary"
        @click="close()"
      >
        {{ $t("MARKETPLACE_REGISTRATION.DECLINE.CANCEL") }}
      </VcButton>
      <VcButton
        :disabled="!reason.trim()"
        @click="$emit('confirm', reason)"
      >
        {{ $t("MARKETPLACE_REGISTRATION.DECLINE.CONFIRM") }}
      </VcButton>
    </template>
  </VcPopup>
</template>

<script setup lang="ts">
// legacy decline-request-dialog: confirmation with a required decline reason
import { VcButton, VcPopup, VcTextarea } from "@vc-shell/framework/ui";
import { ref } from "vue";

// DeclineReason is unlimited in the database; VcTextarea limits to 1024 characters by default
const REASON_MAX_LENGTH = "1000000";

defineEmits<{ (e: "close"): void; (e: "confirm", reason: string): void }>();
const reason = ref("");
</script>

<style scoped>
.registration-decline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
