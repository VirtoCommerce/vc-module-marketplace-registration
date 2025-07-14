import { ref, computed } from 'vue';
import { MarketplaceRegistrationClient } from '../../../api_client/virtocommerce.marketplaceregistration';

interface RegistrationRequest {
  id: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  localizedStatus?: string;
  declineReason?: string;
  createdDate: string;
  modifiedDate: string;
}

interface SearchCriteria {
  keyword?: string;
  statuses?: string[];
  skip: number;
  take: number;
}

interface SearchResult {
  results: RegistrationRequest[];
  totalCount: number;
}

interface RegistrationRequestSettings {
  registrationFormUrl: string;
  vendorPortalUrl?: string;
}

export function useRegistrationRequests() {
  const items = ref<RegistrationRequest[]>([]);
  const loading = ref(false);
  const selectedItems = ref<RegistrationRequest[]>([]);
  const totalCount = ref(0);
  
  const pagination = ref({
    currentPage: 1,
    pageSize: 20,
    totalPages: 0,
  });

  const client = new MarketplaceRegistrationClient();

  const searchRegistrationRequests = async (criteria: SearchCriteria): Promise<SearchResult> => {
    loading.value = true;
    
    try {
      const result = await client.searchRegistrationRequests({
        keyword: criteria.keyword,
        statuses: criteria.statuses,
        skip: criteria.skip,
        take: criteria.take,
      });

      items.value = result.results || [];
      totalCount.value = result.totalCount || 0;
      pagination.value.totalPages = Math.ceil(totalCount.value / pagination.value.pageSize);

      return {
        results: items.value,
        totalCount: totalCount.value,
      };
    } catch (error) {
      console.error('Error searching registration requests:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createRegistrationRequest = async (request: Partial<RegistrationRequest>) => {
    loading.value = true;
    
    try {
      const result = await client.createRegistrationRequest(request);
      return result;
    } catch (error) {
      console.error('Error creating registration request:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateRegistrationRequest = async (request: Partial<RegistrationRequest>) => {
    loading.value = true;
    
    try {
      const result = await client.updateRegistrationRequest(request);
      return result;
    } catch (error) {
      console.error('Error updating registration request:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const getSettings = async (): Promise<RegistrationRequestSettings> => {
    try {
      const result = await client.getSettings();
      return result;
    } catch (error) {
      console.error('Error getting settings:', error);
      throw error;
    }
  };

  return {
    items: computed(() => items.value),
    loading: computed(() => loading.value),
    selectedItems,
    totalCount: computed(() => totalCount.value),
    pagination,
    searchRegistrationRequests,
    createRegistrationRequest,
    updateRegistrationRequest,
    getSettings,
  };
}