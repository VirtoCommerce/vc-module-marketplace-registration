import { ref, computed } from 'vue';

interface Seller {
  id: string;
  name: string;
  ownerDetails: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface SearchSellersResult {
  results: Seller[];
  totalCount: number;
}

interface SearchSellersRequest {
  keyword?: string;
  skip: number;
  take: number;
}

export function useMarketplaceVendor() {
  const sellers = ref<Seller[]>([]);
  const loading = ref(false);

  const searchSellers = async (criteria: SearchSellersRequest): Promise<SearchSellersResult> => {
    loading.value = true;
    
    try {
      // This would use the marketplace vendor API client
      // For now, we'll simulate the response
      const mockResponse = {
        results: [
          {
            id: 'seller-1',
            name: criteria.keyword || 'Mock Seller',
            ownerDetails: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
            },
          },
        ],
        totalCount: 1,
      };

      sellers.value = mockResponse.results;
      return mockResponse;
    } catch (error) {
      console.error('Error searching sellers:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createSeller = async (seller: Omit<Seller, 'id'>) => {
    loading.value = true;
    
    try {
      // This would use the marketplace vendor API client
      // For now, we'll simulate the response
      const mockResponse = {
        id: Date.now().toString(),
        ...seller,
      };

      return mockResponse;
    } catch (error) {
      console.error('Error creating seller:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    sellers: computed(() => sellers.value),
    loading: computed(() => loading.value),
    searchSellers,
    createSeller,
  };
}