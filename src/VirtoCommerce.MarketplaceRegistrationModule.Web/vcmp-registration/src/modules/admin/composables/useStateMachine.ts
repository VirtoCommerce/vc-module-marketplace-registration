import { ref, computed } from 'vue';

interface StateMachineInstance {
  id: string;
  currentState: {
    name: string;
    localizedValue?: string;
    isFinal?: boolean;
    isSuccess?: boolean;
    isFailed?: boolean;
    transitions: StateTransition[];
  };
}

interface StateTransition {
  trigger: string;
  localizedValue?: string;
  description?: string;
  icon?: string;
}

interface StateMachineSearchCriteria {
  objectTypes: string[];
  objectIds: string[];
  responseGroup?: string;
  locale?: string;
  take: number;
}

export function useStateMachine() {
  const stateMachineInstance = ref<StateMachineInstance | null>(null);
  const loading = ref(false);

  const availableTransitions = computed(() => {
    return stateMachineInstance.value?.currentState?.transitions || [];
  });

  const loadStateMachineInstance = async (criteria: StateMachineSearchCriteria) => {
    loading.value = true;
    
    try {
      // This would use the state machine API client
      // For now, we'll simulate the response
      const mockResponse = {
        totalCount: 1,
        results: [
          {
            id: 'state-machine-instance-id',
            currentState: {
              name: 'Pending',
              localizedValue: 'Pending',
              isFinal: false,
              isSuccess: false,
              isFailed: false,
              transitions: [
                {
                  trigger: 'CompleteRegistrationRequest',
                  localizedValue: 'Complete',
                  description: 'Complete registration request',
                  icon: 'fas fa-check',
                },
                {
                  trigger: 'DeclineRegistrationRequest',
                  localizedValue: 'Decline',
                  description: 'Decline registration request',
                  icon: 'fas fa-times',
                },
              ],
            },
          },
        ],
      };

      if (mockResponse.totalCount > 0) {
        stateMachineInstance.value = mockResponse.results[0];
      }
    } catch (error) {
      console.error('Error loading state machine instance:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const fireTransition = async (instanceId: string, trigger: string, entityId: string) => {
    loading.value = true;
    
    try {
      // This would use the state machine API client
      // For now, we'll simulate the response
      console.log(`Firing transition ${trigger} for instance ${instanceId} and entity ${entityId}`);
      
      // After successful transition, reload the state machine instance
      await loadStateMachineInstance({
        objectTypes: ['VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest'],
        objectIds: [entityId],
        responseGroup: 'withLocalization',
        take: 1,
      });
    } catch (error) {
      console.error('Error firing state machine transition:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const getAllStates = async (entityType: string) => {
    try {
      // This would use the state machine API client
      // For now, we'll simulate the response
      const mockStates = [
        {
          name: 'Pending',
          localizedValue: 'Pending',
          isFinal: false,
          isSuccess: false,
          isFailed: false,
        },
        {
          name: 'Approved',
          localizedValue: 'Approved',
          isFinal: true,
          isSuccess: true,
          isFailed: false,
        },
        {
          name: 'Declined',
          localizedValue: 'Declined',
          isFinal: true,
          isSuccess: false,
          isFailed: true,
        },
      ];

      return mockStates;
    } catch (error) {
      console.error('Error getting all states:', error);
      throw error;
    }
  };

  return {
    stateMachineInstance: computed(() => stateMachineInstance.value),
    loading: computed(() => loading.value),
    availableTransitions,
    loadStateMachineInstance,
    fireTransition,
    getAllStates,
  };
}