<template>
  <div class="registration-request-details-page">
    <VcBlade
      :title="$t('VCMP_ADMIN.PAGES.REGISTRATION_REQUEST_DETAILS.TITLE')"
      :subtitle="$t('VCMP_ADMIN.PAGES.REGISTRATION_REQUEST_DETAILS.SUBTITLE')"
      :loading="loading"
      @close="goBack"
    >
      <template #header>
        <VcBreadcrumbs :items="breadcrumbs" />
      </template>

      <template #content>
        <RegistrationRequestDetails
          v-if="item"
          :item="item"
          @close="goBack"
          @refresh="refresh"
        />
        <div v-else class="no-data">
          {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUEST_DETAILS.NO_DATA') }}
        </div>
      </template>
    </VcBlade>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useRegistrationRequests } from '../composables/useRegistrationRequests';
import RegistrationRequestDetails from '../components/RegistrationRequestDetails.vue';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const { searchRegistrationRequests } = useRegistrationRequests();

const item = ref(null);
const loading = ref(false);

const breadcrumbs = computed(() => [
  {
    title: t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.TITLE'),
    to: '/registration-requests',
  },
  {
    title: t('VCMP_ADMIN.PAGES.REGISTRATION_REQUEST_DETAILS.TITLE'),
    to: `/registration-requests/${route.params.id}`,
  },
]);

const goBack = () => {
  router.push('/registration-requests');
};

const refresh = async () => {
  loading.value = true;
  
  try {
    const result = await searchRegistrationRequests({
      skip: 0,
      take: 1,
      // Filter by ID if needed
    });
    
    // Find the item by ID
    const itemId = route.params.id as string;
    item.value = result.results.find(r => r.id === itemId) || null;
  } catch (error) {
    console.error('Error loading registration request:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  refresh();
});
</script>

<style scoped>
.registration-request-details-page {
  height: 100vh;
}

.no-data {
  padding: 20px;
  text-align: center;
  color: #666;
}
</style>