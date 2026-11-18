<template>
  <VcBlade
    :title="$t('MARKETPLACE_REGISTRATION.LIST.TITLE')"
    :toolbar-items="toolbar"
    :loading="loading"
    width="50%"
  >
    <VcDataTable
      v-model:search-value="keyword"
      v-model:sort-field="sortField"
      v-model:sort-order="sortOrder"
      searchable
      :items="items"
      :total-count="totalCount"
      :pagination="pagination"
      :state-key="'MARKETPLACE_REGISTRATION_REQUESTS'"
      :active-item-id="activeItemId"
      :empty-state="{ icon: 'lucide-id-card', title: $t('MARKETPLACE_REGISTRATION.LIST.EMPTY') }"
      :not-found-state="{ icon: 'lucide-search', title: $t('MARKETPLACE_REGISTRATION.LIST.NOT_FOUND') }"
      @row-click="(e: { data: RegistrationRequest }) => open(e.data.id)"
      @pagination-click="pagination.goToPage"
    >
      <template #search-header-actions>
        <VcSelect
          v-model="statuses"
          class="registration-requests__statuses"
          :options="statusOptions"
          :placeholder="$t('MARKETPLACE_REGISTRATION.LIST.STATUSES_PLACEHOLDER')"
          size="small"
          multiple
        />
      </template>
      <VcColumn
        id="firstName"
        :title="$t('MARKETPLACE_REGISTRATION.LIST.FIRST_NAME')"
        sortable
        always-visible
      />
      <VcColumn
        id="lastName"
        :title="$t('MARKETPLACE_REGISTRATION.LIST.LAST_NAME')"
        sortable
      />
      <VcColumn
        id="organizationName"
        :title="$t('MARKETPLACE_REGISTRATION.LIST.ORGANIZATION_NAME')"
        sortable
      />
      <VcColumn
        id="contactEmail"
        :title="$t('MARKETPLACE_REGISTRATION.LIST.CONTACT_EMAIL')"
        sortable
      />
      <VcColumn
        id="contactPhone"
        :title="$t('MARKETPLACE_REGISTRATION.LIST.CONTACT_PHONE')"
        sortable
      />
      <VcColumn
        id="status"
        :title="$t('MARKETPLACE_REGISTRATION.LIST.STATUS')"
        sortable
      >
        <template #body="{ data }">{{ statusName(data.status) }}</template>
      </VcColumn>
    </VcDataTable>
  </VcBlade>
</template>

<script setup lang="ts">
import {
  useBlade,
  useDataTablePagination,
  useDataTableSort,
  useFunctions,
  type IBladeToolbar,
} from "@vc-shell/framework";
import { VcBlade, VcColumn, VcDataTable, VcSelect } from "@vc-shell/framework/ui";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { api, registrationFormUrl, registrationStates } from "../api";
import { PERMISSIONS, type RegistrationRequestsOptions } from "../types";
import type { RegistrationRequest } from "../../api_client/virtocommerce.marketplaceregistration";
import type { StateMachineStateShort } from "../../api_client/virtocommerce.statemachine";

// legacy registration-request-list (main menu "Registration requests").
// The legacy saved-filter blade (registration-request-filter) is replaced by the inline status filter.
defineBlade({
  url: "/registration-requests",
  name: "MarketplaceRegistrationRequests",
  isWorkspace: true,
  permissions: [PERMISSIONS.READ],
  menuItem: { title: "MARKETPLACE_REGISTRATION.MENU.TITLE", icon: "lucide-id-card", priority: 900 },
});

const PAGE_SIZE = 30;
// the chosen status filter is a per-browser convenience, as the legacy $localStorage filters were
const FILTER_KEY = "marketplace-registration.statuses";

const { t, locale } = useI18n({ useScope: "global" });
const { options, openBlade, exposeToChildren } = useBlade<RegistrationRequestsOptions>();
const { debounce } = useFunctions();

const items = ref<RegistrationRequest[]>([]);
const totalCount = ref(0);
const loading = ref(false);
const keyword = ref("");
const activeItemId = ref<string>();
const statuses = ref<string[]>(readFilter());
const formUrl = ref<string>();
// newest first: the legacy grid sent no sort, and the server then sorts by created date, descending
const { sortField, sortOrder, sortExpression } = useDataTableSort({ initialField: "createdDate", initialDirection: "DESC" });
const pagination = useDataTablePagination({ pageSize: PAGE_SIZE, totalCount });

const states = ref<StateMachineStateShort[]>([]);
const statusOptions = computed(() => states.value.map((x) => ({ id: x.name!, title: x.localizedValue || x.name! })));
const statusName = (status?: string) => states.value.find((x) => x.name === status)?.localizedValue || status;
watch(locale, async () => (states.value = await registrationStates(String(locale.value))), { immediate: true });

function readFilter(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FILTER_KEY) ?? "[]");
  } catch {
    return [];
  }
}
watch(statuses, (value) => {
  try {
    localStorage.setItem(FILTER_KEY, JSON.stringify(value));
  } catch {
    // per-browser convenience only
  }
});

async function load() {
  loading.value = true;
  try {
    const res = await api.requests.search({
      keyword: keyword.value || undefined,
      statuses: statuses.value.length ? statuses.value : undefined,
      sort: sortExpression.value,
      skip: pagination.skip,
      take: PAGE_SIZE,
    });
    items.value = res.results ?? [];
    totalCount.value = res.totalCount ?? 0;
  } finally {
    loading.value = false;
  }
}
load();
watch([keyword, statuses], () => pagination.setPage(1));
watch([sortExpression, keyword, statuses, () => pagination.skip], debounce(load, 300));

function open(id?: string) {
  if (!id) return;
  activeItemId.value = id;
  openBlade({ name: "MarketplaceRegistrationRequestDetails", param: id, onClose: () => (activeItemId.value = undefined) });
}

const toolbar = computed<IBladeToolbar[]>(() => [
  { id: "refresh", title: t("MARKETPLACE_REGISTRATION.TOOLBAR.REFRESH"), icon: "lucide-refresh-cw", clickHandler: load },
  {
    // legacy "add": the vendor portal's registration form, where a new request is filed
    id: "newRequest",
    title: t("MARKETPLACE_REGISTRATION.TOOLBAR.NEW_REQUEST"),
    icon: "lucide-plus",
    disabled: !formUrl.value,
    clickHandler: () => {
      if (formUrl.value) window.open(formUrl.value, "_blank");
    },
  },
]);

onMounted(async () => {
  // opened from a push notification: show the request (legacy blade.notification)
  if (options.value?.openId) open(options.value.openId);
  formUrl.value = await registrationFormUrl();
});

exposeToChildren({ reload: load });
</script>

<style scoped>
.registration-requests__statuses {
  min-width: 200px;
}
</style>
