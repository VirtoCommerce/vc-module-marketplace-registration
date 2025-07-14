<template>
  <VcBlade
    :title="isNew ? $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.FILTERS.NEW_FILTER') : filter.name"
    :subtitle="isNew ? $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.FILTERS.NEW_FILTER_SUBTITLE') : $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.FILTERS.EDIT_FILTER_SUBTITLE')"
    :loading="loading"
    @close="$emit('close')"
  >
    <template #toolbar>
      <VcButton
        :disabled="!isValid"
        variant="primary"
        @click="saveFilter"
      >
        {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.COMMANDS.APPLY_FILTER') }}
      </VcButton>
      <VcButton
        :disabled="!isDirty"
        variant="secondary"
        @click="resetFilter"
      >
        {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.COMMANDS.RESET') }}
      </VcButton>
      <VcButton
        v-if="!isNew"
        variant="danger"
        @click="deleteFilter"
      >
        {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.COMMANDS.DELETE') }}
      </VcButton>
    </template>

    <template #content>
      <VcContainer>
        <VcRow>
          <VcCol>
            <VcCard>
              <VcCardContent>
                <VcForm>
                  <VcFormGroup>
                    <VcLabel>
                      {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.FILTERS.NAME') }}
                    </VcLabel>
                    <VcInput
                      v-model="currentFilter.name"
                      :placeholder="$t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.FILTERS.NAME_PLACEHOLDER')"
                      required
                    />
                  </VcFormGroup>

                  <VcFormGroup>
                    <VcLabel>
                      {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.FILTERS.STATUSES') }}
                    </VcLabel>
                    <VcMultiSelect
                      v-model="currentFilter.statuses"
                      :options="availableStatuses"
                      :placeholder="$t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.FILTERS.STATUSES_PLACEHOLDER')"
                      multiple
                    />
                  </VcFormGroup>
                </VcForm>
              </VcCardContent>
            </VcCard>
          </VcCol>
        </VcRow>
      </VcContainer>
    </template>
  </VcBlade>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStateMachine } from '../composables/useStateMachine';

interface Filter {
  id?: string;
  name: string;
  statuses?: string[];
}

interface Props {
  filter?: Filter;
  isNew?: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', filter: Filter): void;
  (e: 'delete', filterId: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  isNew: false,
});

const emit = defineEmits<Emits>();

const { t } = useI18n();
const { getAllStates } = useStateMachine();

const loading = ref(false);
const availableStatuses = ref<string[]>([]);
const currentFilter = ref<Filter>({
  name: '',
  statuses: [],
});

const originalFilter = ref<Filter>({
  name: '',
  statuses: [],
});

const isDirty = computed(() => {
  return JSON.stringify(currentFilter.value) !== JSON.stringify(originalFilter.value);
});

const isValid = computed(() => {
  return currentFilter.value.name.trim().length > 0;
});

const saveFilter = () => {
  if (isValid.value) {
    emit('save', { ...currentFilter.value });
  }
};

const resetFilter = () => {
  currentFilter.value = { ...originalFilter.value };
};

const deleteFilter = () => {
  if (currentFilter.value.id) {
    emit('delete', currentFilter.value.id);
  }
};

const loadStatuses = async () => {
  loading.value = true;
  
  try {
    const states = await getAllStates('VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest');
    availableStatuses.value = states.map(state => state.name);
  } catch (error) {
    console.error('Error loading statuses:', error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.filter,
  (newFilter) => {
    if (newFilter) {
      currentFilter.value = { ...newFilter };
      originalFilter.value = { ...newFilter };
    }
  },
  { immediate: true }
);

onMounted(() => {
  loadStatuses();
  
  if (props.isNew) {
    currentFilter.value = {
      name: '',
      statuses: [],
    };
    originalFilter.value = {
      name: '',
      statuses: [],
    };
  }
});
</script>

<style scoped>
.registration-request-filter {
  padding: 20px;
}
</style>