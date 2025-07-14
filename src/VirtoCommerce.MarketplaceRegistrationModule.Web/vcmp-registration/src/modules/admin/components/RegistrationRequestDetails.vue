<template>
  <div class="registration-request-details">
    <VcContainer>
      <VcRow>
        <VcCol>
          <VcCard>
            <VcCardHeader>
              <VcCardTitle>
                {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUEST_DETAILS.TITLE') }}
              </VcCardTitle>
            </VcCardHeader>
            
            <VcCardContent>
              <VcForm>
                <VcFormGroup>
                  <VcLabel>
                    {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.STATUS') }}
                  </VcLabel>
                  <VcChip
                    :variant="getStatusVariant(item.status)"
                    :label="item.localizedStatus || item.status"
                  />
                </VcFormGroup>

                <VcFormGroup>
                  <VcLabel>
                    {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.FIRST_NAME') }}
                  </VcLabel>
                  <VcInput
                    :model-value="item.firstName"
                    readonly
                  />
                </VcFormGroup>

                <VcFormGroup>
                  <VcLabel>
                    {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.LAST_NAME') }}
                  </VcLabel>
                  <VcInput
                    :model-value="item.lastName"
                    readonly
                  />
                </VcFormGroup>

                <VcFormGroup>
                  <VcLabel>
                    {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.ORGANIZATION_NAME') }}
                  </VcLabel>
                  <div class="organization-name-field">
                    <VcInput
                      :model-value="item.organizationName"
                      readonly
                    />
                    <VcButton
                      v-if="showSuccessFields"
                      variant="ghost"
                      @click="openVendorDetails"
                    >
                      {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.OPEN_VENDOR_DETAILS') }}
                    </VcButton>
                  </div>
                </VcFormGroup>

                <VcFormGroup>
                  <VcLabel>
                    {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.CONTACT_EMAIL') }}
                  </VcLabel>
                  <VcInput
                    :model-value="item.contactEmail"
                    readonly
                  />
                </VcFormGroup>

                <VcFormGroup>
                  <VcLabel>
                    {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.CONTACT_PHONE') }}
                  </VcLabel>
                  <VcInput
                    :model-value="item.contactPhone"
                    readonly
                  />
                </VcFormGroup>

                <VcFormGroup v-if="showFailedFields">
                  <VcLabel>
                    {{ $t('VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.LABELS.DECLINE_REASON') }}
                  </VcLabel>
                  <VcTextarea
                    :model-value="item.declineReason"
                    readonly
                  />
                </VcFormGroup>
              </VcForm>
            </VcCardContent>

            <VcCardFooter v-if="availableTransitions.length > 0">
              <VcButton
                v-for="transition in availableTransitions"
                :key="transition.trigger"
                :variant="getTransitionVariant(transition.trigger)"
                :loading="actionLoading === transition.trigger"
                @click="executeTransition(transition)"
              >
                {{ transition.localizedValue || transition.trigger }}
              </VcButton>
            </VcCardFooter>
          </VcCard>
        </VcCol>
      </VcRow>
    </VcContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStateMachine } from '../composables/useStateMachine';
import { useMarketplaceVendor } from '../composables/useMarketplaceVendor';
import { useDialog } from '../composables/useDialog';
import { useRegistrationRequests } from '../composables/useRegistrationRequests';

interface Props {
  item: any;
}

interface Emits {
  (e: 'close'): void;
  (e: 'refresh'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const router = useRouter();

const {
  stateMachineInstance,
  availableTransitions,
  loadStateMachineInstance,
  fireTransition,
} = useStateMachine();

const { searchSellers } = useMarketplaceVendor();
const { showDialog } = useDialog();
const { updateRegistrationRequest } = useRegistrationRequests();

const actionLoading = ref<string | null>(null);

const showSuccessFields = computed(() => {
  return stateMachineInstance.value?.currentState?.isFinal && 
         stateMachineInstance.value?.currentState?.isSuccess;
});

const showFailedFields = computed(() => {
  return stateMachineInstance.value?.currentState?.isFinal && 
         stateMachineInstance.value?.currentState?.isFailed;
});

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

const getTransitionVariant = (trigger: string) => {
  switch (trigger?.toLowerCase()) {
    case 'complete':
    case 'approve':
      return 'success';
    case 'decline':
    case 'reject':
      return 'error';
    default:
      return 'primary';
  }
};

const openVendorDetails = async () => {
  const searchCriteria = {
    keyword: props.item.organizationName,
    skip: 0,
    take: 1,
  };

  const result = await searchSellers(searchCriteria);
  
  if (result.results && result.results.length > 0) {
    const existedSeller = result.results[0];
    // Navigate to vendor details - this would typically open in a new blade
    router.push(`/sellers/${existedSeller.id}`);
  }
};

const executeTransition = async (transition: any) => {
  actionLoading.value = transition.trigger;
  
  try {
    if (transition.trigger === 'DeclineRegistrationRequest') {
      await handleDeclineTransition(transition);
    } else if (transition.trigger === 'CompleteRegistrationRequest') {
      await handleCompleteTransition(transition);
    } else {
      await fireTransition(stateMachineInstance.value.id, transition.trigger, props.item.id);
      emit('refresh');
    }
  } catch (error) {
    console.error('Error executing transition:', error);
  } finally {
    actionLoading.value = null;
  }
};

const handleDeclineTransition = async (transition: any) => {
  const result = await showDialog({
    title: t('VCMP_ADMIN.DIALOGS.DECLINE_REQUEST.TITLE'),
    message: t('VCMP_ADMIN.DIALOGS.DECLINE_REQUEST.MESSAGE'),
    type: 'confirm',
    inputs: [
      {
        type: 'textarea',
        name: 'comment',
        placeholder: t('VCMP_ADMIN.DIALOGS.DECLINE_REQUEST.COMMENT_PLACEHOLDER'),
        required: true,
      },
    ],
  });

  if (result.confirmed && result.data.comment) {
    await updateRegistrationRequest({
      id: props.item.id,
      comment: result.data.comment,
    });
    
    await fireTransition(stateMachineInstance.value.id, transition.trigger, props.item.id);
    emit('refresh');
    emit('close');
  }
};

const handleCompleteTransition = async (transition: any) => {
  // This would typically open a seller creation blade
  // For now, we'll just fire the transition
  await fireTransition(stateMachineInstance.value.id, transition.trigger, props.item.id);
  emit('refresh');
};

onMounted(async () => {
  await loadStateMachineInstance({
    objectTypes: ['VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest'],
    objectIds: [props.item.id],
    responseGroup: 'withLocalization',
    take: 1,
  });
});
</script>

<style scoped>
.registration-request-details {
  padding: 20px;
}

.organization-name-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.organization-name-field .vc-input {
  flex: 1;
}
</style>