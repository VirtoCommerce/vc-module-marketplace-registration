<template>
  <VcBlade
    :title="$t('MARKETPLACE_REGISTRATION.DETAILS.TITLE')"
    :subtitle="item.organizationName"
    :toolbar-items="toolbar"
    :loading="loading"
    width="50%"
  >
    <VcContainer>
      <VcForm class="registration-form">
        <VcInput
          :model-value="statusName"
          :label="$t('MARKETPLACE_REGISTRATION.DETAILS.STATUS')"
          disabled
        />
        <VcRow class="registration-form__row">
          <VcCol>
            <VcInput
              :model-value="item.firstName"
              :label="$t('MARKETPLACE_REGISTRATION.DETAILS.FIRST_NAME')"
              disabled
            />
          </VcCol>
          <VcCol>
            <VcInput
              :model-value="item.lastName"
              :label="$t('MARKETPLACE_REGISTRATION.DETAILS.LAST_NAME')"
              disabled
            />
          </VcCol>
        </VcRow>
        <VcInput
          :model-value="item.organizationName"
          :label="$t('MARKETPLACE_REGISTRATION.DETAILS.ORGANIZATION_NAME')"
          disabled
        />
        <!-- legacy registrationRequest-organizationNameField: only once the request made a vendor -->
        <VcLink
          v-if="isSucceeded"
          class="registration-form__vendor"
          @click="openVendor"
        >
          {{ $t("MARKETPLACE_REGISTRATION.DETAILS.OPEN_VENDOR_DETAILS") }}
        </VcLink>
        <VcRow class="registration-form__row">
          <VcCol>
            <VcInput
              :model-value="item.contactEmail"
              :label="$t('MARKETPLACE_REGISTRATION.DETAILS.CONTACT_EMAIL')"
              disabled
            />
          </VcCol>
          <VcCol>
            <VcInput
              :model-value="item.contactPhone"
              :label="$t('MARKETPLACE_REGISTRATION.DETAILS.CONTACT_PHONE')"
              disabled
            />
          </VcCol>
        </VcRow>
        <VcTextarea
          v-if="isFailed"
          :model-value="item.declineReason"
          :label="$t('MARKETPLACE_REGISTRATION.DETAILS.DECLINE_REASON')"
          :maxlength="REASON_MAX_LENGTH"
          disabled
        />
      </VcForm>
    </VcContainer>
  </VcBlade>
</template>

<script setup lang="ts">
import { useBlade, usePopup, type IBladeToolbar } from "@vc-shell/framework";
import { VcBlade, VcCol, VcContainer, VcForm, VcInput, VcLink, VcRow, VcTextarea } from "@vc-shell/framework/ui";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api, errorText, registrationStates, transitionIcon } from "../api";
import { useDeclinePrompt } from "../composables/useDeclinePrompt";
import { PERMISSIONS, REGISTRATION_REQUEST_TYPE, type SellerAddOptions } from "../types";
import type { RegistrationRequest } from "../../api_client/virtocommerce.marketplaceregistration";
import type { StateMachineInstance, StateMachineStateShort } from "../../api_client/virtocommerce.statemachine";

// legacy registration-request-details: the request (read-only) and its state machine transitions as toolbar commands
defineBlade({ url: "/registration-request", name: "MarketplaceRegistrationRequestDetails", permissions: [PERMISSIONS.READ] });

// legacy stateMachineRegistrar.registerStateAction triggers: they ask for more before the transition is fired
const COMPLETE_TRIGGER = "CompleteRegistrationRequest";
const DECLINE_TRIGGER = "DeclineRegistrationRequest";
// DeclineReason is unlimited in the database; VcTextarea limits to 1024 characters by default
const REASON_MAX_LENGTH = "1000000";

const { t, locale } = useI18n({ useScope: "global" });
const { param, openBlade, callParent, exposeToChildren } = useBlade();
const { showError } = usePopup();
const promptDecline = useDeclinePrompt();

const item = ref<RegistrationRequest>({});
const instance = ref<StateMachineInstance>();
const states = ref<StateMachineStateShort[]>([]);
const loading = ref(false);

// the request's status names a state of its machine; legacy compared it with the final success/failed states
const state = computed(() => states.value.find((x) => x.name === item.value.status));
const isSucceeded = computed(() => !!state.value?.isFinal && !!state.value.isSuccess);
const isFailed = computed(() => !!state.value?.isFinal && !!state.value.isFailed);
const statusName = computed(
  () => instance.value?.currentState?.localizedValue || state.value?.localizedValue || item.value.status || "",
);
const transitions = computed(() => instance.value?.currentState?.transitions ?? []);

async function load() {
  if (!param.value) return;
  loading.value = true;
  try {
    const lang = String(locale.value);
    const [request, instances, allStates] = await Promise.all([
      api.requests.getById(param.value),
      api.stateMachine.searchInstance({
        objectTypes: [REGISTRATION_REQUEST_TYPE],
        objectIds: [param.value],
        responseGroup: "withLocalization",
        locale: lang,
        take: 1,
      }),
      registrationStates(lang),
    ]);
    item.value = request ?? {};
    instance.value = instances.results?.[0];
    states.value = allStates;
  } catch (e) {
    showError(errorText(e));
  } finally {
    loading.value = false;
  }
}

async function fireTrigger(trigger: string) {
  await api.stateMachine.fireTrigger({ stateMachineInstanceId: instance.value?.id, trigger, entityId: item.value.id });
}

// the list shows the new status too
async function reloadAll() {
  await load();
  callParent("reload").catch(() => undefined);
}

async function runTransition(trigger: string) {
  if (trigger === COMPLETE_TRIGGER) {
    // legacy: Marketplace Vendor's seller-add, prefilled from the request; the transition follows a created seller
    const options: SellerAddOptions = {
      command: {
        sellerName: item.value.organizationName,
        ownerDetails: { firstName: item.value.firstName, lastName: item.value.lastName, email: item.value.contactEmail },
      },
      onCreated: () => fireTrigger(trigger),
    };
    try {
      await openBlade({ name: "MarketplaceSellerAdd", options });
    } catch (e) {
      showError(errorText(e));
    }
    return;
  }

  let reason: string | false | undefined;
  if (trigger === DECLINE_TRIGGER) {
    reason = await promptDecline();
    if (reason === false) return;
  }

  loading.value = true;
  try {
    // the reason is saved first, so it is there when the request turns Declined
    if (reason) await api.requests.updateRegistrationRequest({ id: item.value.id!, comment: reason });
    await fireTrigger(trigger);
  } catch (e) {
    showError(errorText(e));
  } finally {
    loading.value = false;
  }
  await reloadAll();
}

// legacy openVendorDetails: the vendor the request created, found by the organization name
async function openVendor() {
  const name = item.value.organizationName;
  try {
    const res = await api.sellers.searchSellers({ keyword: name, skip: 0, take: 1 });
    const seller = res.results?.[0];
    if (!seller?.id) {
      showError(t("MARKETPLACE_REGISTRATION.DETAILS.VENDOR_NOT_FOUND", { name: name ?? "" }));
      return;
    }
    await openBlade({ name: "MarketplaceSellerDetails", param: seller.id });
  } catch (e) {
    showError(errorText(e));
  }
}

const toolbar = computed<IBladeToolbar[]>(() => [
  ...transitions.value.map(
    (x): IBladeToolbar => ({
      id: "transition" + x.trigger,
      title: x.localizedValue || x.trigger,
      icon: transitionIcon(x.icon),
      permissions: PERMISSIONS.UPDATE,
      disabled: loading.value,
      clickHandler: () => runTransition(x.trigger!),
    }),
  ),
]);

// MarketplaceSellerAdd reloads its parent once the seller is created and the transition fired
exposeToChildren({ reload: reloadAll });

onMounted(load);
</script>

<style lang="scss" scoped>
.registration-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__row {
    gap: 16px;
  }

  &__vendor {
    align-self: flex-start;
  }
}
</style>
