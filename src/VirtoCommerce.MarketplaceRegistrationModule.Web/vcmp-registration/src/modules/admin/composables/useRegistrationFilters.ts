import { ref, computed } from 'vue';

interface RegistrationFilter {
  id: string;
  name: string;
  statuses?: string[];
  keyword?: string;
}

export function useRegistrationFilters() {
  const filters = ref<RegistrationFilter[]>([
    {
      id: 'new',
      name: 'VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.FILTERS.NEW_FILTER',
    },
  ]);

  const currentFilter = ref<RegistrationFilter | null>(null);

  // Load filters from localStorage
  const loadFilters = () => {
    const savedFilters = localStorage.getItem('registrationRequestFilters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        filters.value = [
          ...parsedFilters,
          {
            id: 'new',
            name: 'VCMP_ADMIN.PAGES.REGISTRATION_REQUESTS.FILTERS.NEW_FILTER',
          },
        ];
      } catch (error) {
        console.error('Error loading filters from localStorage:', error);
      }
    }

    const savedFilterId = localStorage.getItem('registrationRequestFilterId');
    if (savedFilterId) {
      currentFilter.value = filters.value.find(f => f.id === savedFilterId) || null;
    }
  };

  // Save filters to localStorage
  const saveFilters = () => {
    const filtersToSave = filters.value.filter(f => f.id !== 'new');
    localStorage.setItem('registrationRequestFilters', JSON.stringify(filtersToSave));
    
    if (currentFilter.value) {
      localStorage.setItem('registrationRequestFilterId', currentFilter.value.id);
    } else {
      localStorage.removeItem('registrationRequestFilterId');
    }
  };

  const addFilter = (filter: Omit<RegistrationFilter, 'id'>) => {
    const newFilter: RegistrationFilter = {
      ...filter,
      id: Date.now().toString(),
    };

    const newFilterIndex = filters.value.findIndex(f => f.id === 'new');
    filters.value.splice(newFilterIndex, 0, newFilter);
    currentFilter.value = newFilter;
    saveFilters();
    
    return newFilter;
  };

  const updateFilter = (filterId: string, updates: Partial<RegistrationFilter>) => {
    const filterIndex = filters.value.findIndex(f => f.id === filterId);
    if (filterIndex !== -1) {
      filters.value[filterIndex] = { ...filters.value[filterIndex], ...updates };
      saveFilters();
    }
  };

  const deleteFilter = (filterId: string) => {
    const filterIndex = filters.value.findIndex(f => f.id === filterId);
    if (filterIndex !== -1) {
      filters.value.splice(filterIndex, 1);
      
      if (currentFilter.value?.id === filterId) {
        currentFilter.value = null;
      }
      
      saveFilters();
    }
  };

  const onFilterChanged = (filter: RegistrationFilter | null) => {
    if (filter?.id === 'new') {
      // Handle new filter creation
      currentFilter.value = null;
      return { isNew: true };
    }
    
    currentFilter.value = filter;
    saveFilters();
    return { isNew: false };
  };

  // Initialize filters
  loadFilters();

  return {
    filters: computed(() => filters.value),
    currentFilter: computed(() => currentFilter.value),
    addFilter,
    updateFilter,
    deleteFilter,
    onFilterChanged,
  };
}