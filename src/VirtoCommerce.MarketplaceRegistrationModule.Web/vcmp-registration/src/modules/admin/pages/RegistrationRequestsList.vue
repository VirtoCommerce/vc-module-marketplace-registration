<template>
  <VcBlade
    :title="$t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.TITLE')"
    :subtitle="$t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.SUBTITLE')"
    :loading="loading"
    :expanded="false"
    :closable="false"
    width="50%"
  >
    <template #header>
      <VcBreadcrumbs :items="breadcrumbs" />
    </template>

    <template #toolbar>
      <VcButton
        :loading="loading"
        @click="refresh"
      >
        {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.COMMANDS.REFRESH') }}
      </VcButton>
      <VcButton
        v-if="registrationFormUrl"
        variant="primary"
        @click="redirectToRegistrationForm"
      >
        {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.COMMANDS.ADD') }}
      </VcButton>
    </template>

    <template #filters>
      <VcFilterBar
        :filters="filters"
        @filter-changed="onFilterChanged"
      />
    </template>

    <template #content>
      <VcTable
        :items="items"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        :selected-items="selectedItems"
        @item-click="onItemClick"
        @selection-changed="onSelectionChanged"
        @page-changed="onPageChanged"
        @sort-changed="onSortChanged"
      >
        <template #item.status="{ item }">
          <VcChip
            :variant="getStatusVariant(item.status)"
            :label="item.localizedStatus || item.status"
          />
        </template>
        
        <template #item.organizationName="{ item }">
          <VcLink
            @click="onItemClick(item)"
          >
            {{ item.organizationName }}
          </VcLink>
        </template>
      </VcTable>
    </template>
  </VcBlade>

  <VcBlade
    v-if="selectedItem"
    :title="$t('VCMP_ADMIN.PAGES.REGISTRATION_REQUEST_DETAILS.TITLE')"
    :subtitle="$t('VCMP_ADMIN.PAGES.REGISTRATION_REQUEST_DETAILS.SUBTITLE')"
    :loading="detailsLoading"
    @close="closeDetails"
  >
    <RegistrationRequestDetails
      :item="selectedItem"
      @close="closeDetails"
      @refresh="refresh"
    />
  </VcBlade>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useRegistrationRequests } from '../composables/useRegistrationRequests';
import { useRegistrationFilters } from '../composables/useRegistrationFilters';
import RegistrationRequestDetails from '../components/RegistrationRequestDetails.vue';

const { t } = useI18n();
const router = useRouter();

const {
  items,
  loading,
  selectedItems,
  pagination,
  searchRegistrationRequests,
  getSettings,
} = useRegistrationRequests();

const {
  filters,
  currentFilter,
  onFilterChanged,
} = useRegistrationFilters();

const selectedItem = ref(null);
const detailsLoading = ref(false);
const registrationFormUrl = ref('');
const vendorPortalUrl = ref('');

const breadcrumbs = computed(() => [
  {
    title: t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.TITLE'),
    to: '/registration-requests',
  },
]);

const columns = computed(() => [
  {
    key: 'firstName',
    title: t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.FIRST_NAME'),
    sortable: true,
  },
  {
    key: 'lastName',
    title: t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.LAST_NAME'),
    sortable: true,
  },
  {
    key: 'organizationName',
    title: t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.ORGANIZATION_NAME'),
    sortable: true,
  },
  {
    key: 'contactEmail',
    title: t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.CONTACT_EMAIL'),
    sortable: true,
  },
  {
    key: 'contactPhone',
    title: t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.CONTACT_PHONE'),
    sortable: true,
  },
  {
    key: 'status',
    title: t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.STATUS'),
    sortable: true,
  },
]);

const getStatusVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'completed':
      return 'success';
    case 'declined':
    case 'failed':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'info';
  }
};

const onItemClick = (item: any) => {
  selectedItem.value = item;
  router.push(`/registration-requests/${item.id}`);
};

const onSelectionChanged = (selection: any[]) => {
  selectedItems.value = selection;
};

const onPageChanged = (page: number) => {
  pagination.value.currentPage = page;
  refresh();
};

const onSortChanged = (sort: any) => {
  // Handle sort change
  refresh();
};

const refresh = async () => {
  await searchRegistrationRequests({
    ...currentFilter.value,
    skip: (pagination.value.currentPage - 1) * pagination.value.pageSize,
    take: pagination.value.pageSize,
  });
  
  await loadSettings();
};

const loadSettings = async () => {
  const settings = await getSettings();
  registrationFormUrl.value = settings.registrationFormUrl;
  vendorPortalUrl.value = settings.vendorPortalUrl;
  correctRegistrationFormUrl();
};

const correctRegistrationFormUrl = () => {
  if (registrationFormUrl.value && registrationFormUrl.value.length > 1
      && !(registrationFormUrl.value.startsWith("http://") || registrationFormUrl.value.startsWith("https://"))
      && vendorPortalUrl.value && vendorPortalUrl.value.length > 1) {
    
    let vendorUrl = vendorPortalUrl.value;
    if (vendorUrl.endsWith("/")) {
      vendorUrl = vendorUrl.substring(0, vendorUrl.length - 1);
    }

    let registrationUrl = registrationFormUrl.value;
    if (registrationUrl.startsWith("/")) {
      registrationUrl = registrationUrl.substring(1, registrationUrl.length);
    }

    registrationFormUrl.value = vendorUrl + "/" + registrationUrl;
  }
};

const redirectToRegistrationForm = () => {
  if (registrationFormUrl.value && registrationFormUrl.value.length > 1) {
    window.open(registrationFormUrl.value, '_blank');
  }
};

const closeDetails = () => {
  selectedItem.value = null;
  router.push('/registration-requests');
};

onMounted(() => {
  refresh();
});
</script>

<style scoped>
.registration-requests-list {
  padding: 20px;
}
</style>