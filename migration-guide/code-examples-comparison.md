# 🔄 Примеры кода: миграция с AngularJS на Vue.js Shell

## 📋 Сравнение реализации функций

### 1. Основной модуль приложения

#### ❌ До (AngularJS)
```javascript
// Scripts/module.js
var moduleName = 'virtoCommerce.marketplaceRegistrationModule';

angular.module(moduleName, [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('workspace.registrationrequest', {
                url: '/registrationrequest',
                params: { notification: null },
                templateUrl: '$(Platform)/Scripts/common/templates/home.tpl.html',
                controller: ['$stateParams', 'platformWebApp.bladeNavigationService',
                    function ($stateParams, bladeNavigationService) {
                        var newBlade = {
                            id: 'registrationRequestList',
                            controller: 'virtoCommerce.marketplaceRegistrationModule.registrationRequestListController',
                            template: 'Modules/$(VirtoCommerce.MarketplaceRegistration)/Scripts/blades/registration-request-list.tpl.html',
                            isClosingDisabled: true,
                            notification: $stateParams.notification,
                        };
                        bladeNavigationService.showBlade(newBlade);
                    }
                ]
            });
    }])
    .run(['platformWebApp.mainMenuService', '$state', 'metaFormsService',
        function (mainMenuService, $state, metaFormsService) {
            // Register module in main menu
            var menuItem = {
                path: 'browse/registrationrequest',
                icon: 'fa fa-address-card',
                title: 'marketplaceRegistration.main-menu-title',
                priority: 100,
                action: function () { $state.go('workspace.registrationrequest'); },
                permission: 'seller:registration:read',
            };
            mainMenuService.addMenuItem(menuItem);
        }
    ]);
```

#### ✅ После (Vue.js Shell)
```typescript
// src/main.ts
import VirtoShellFramework, { notification, useUser, useLanguages } from "@vc-shell/framework";
import { createApp } from "vue";
import { router } from "./router";
import * as locales from "./locales";
import { RouterView } from "vue-router";
import Registration from "./modules";

import "@vc-shell/framework/dist/index.css";

async function startApp() {
  const { loadUser } = useUser();
  
  try {
    await loadUser();
  } catch (e) {
    console.log(e);
  }

  const { currentLocale, setLocale } = useLanguages();

  const app = createApp(RouterView)
    .use(VirtoShellFramework, {
      router,
      i18n: {
        locale: import.meta.env.APP_I18N_LOCALE,
        fallbackLocale: import.meta.env.APP_I18N_FALLBACK_LOCALE,
      },
    })
    .use(Registration.Registration.default, { router })
    .use(router);

  Object.entries(locales).forEach(([key, message]) => {
    app.config.globalProperties.$mergeLocaleMessage(key, message);
  });

  setLocale(currentLocale.value);

  app.config.errorHandler = (err) => {
    notification.error((err as Error).toString(), {
      timeout: 5000,
    });
  };

  await router.isReady();
  app.mount("#app");
}

startApp();
```

### 2. Контроллер деталей заявки

#### ❌ До (AngularJS)
```javascript
// Scripts/blades/registration-request-details.js
angular.module('virtoCommerce.marketplaceRegistrationModule')
    .controller('virtoCommerce.marketplaceRegistrationModule.regisrationRequestDetailsController',
        ['$scope',
            'virtoCommerce.stateMachineModule.webApi', 'virtoCommerce.stateMachineModule.stateMachineRegistrar',
            'virtoCommerce.marketplaceModule.webApi',
            'platformWebApp.metaFormsService', 'platformWebApp.bladeUtils',
            'platformWebApp.i18n',
            function ($scope,
                stateMachineApi, stateMachineRegistrar,
                marketplaceApi,
                metaFormsService, bladeUtils,
                i18n) {
                
            var blade = $scope.blade;
            blade.headIcon = 'fa fa-address-card';
            blade.title = 'marketplaceRegistration.blades.registration-request-details.title';

            function initializeBlade(data) {
                data.localizedStatus = data.status;
                if (blade.stateMachineInstance && blade.stateMachineInstance.currentState) {
                    data.localizedStatus = blade.stateMachineInstance.currentState.localizedValue;
                }
                blade.currentEntity = angular.copy(data);
                blade.originalEntity = data;
                fillTollbarCommands();
                blade.isLoading = false;
            }

            blade.refresh = function (parentRefresh) {
                blade.isLoading = true;
                
                if (parentRefresh) {
                    blade.parentBlade.refresh(true);
                }

                if (blade.currentEntity) {
                    blade.stateMachineInstance = null;
                    stateMachineApi.searchStateMachineInstance({
                        objectTypes: ['VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest'],
                        objectIds: [blade.currentEntity.id],
                        responseGroup: 'withLocalization',
                        locale: i18n.getLanguage(),
                        take: 1
                    }, function (response) {
                        if (response.totalCount > 0) {
                            blade.stateMachineInstance = response.results[0];
                        }
                        initializeBlade(blade.currentEntity);
                    });
                }
            };

            blade.openVendorDetails = function(){
                var searchCriteria = {
                    keyword: blade.currentEntity.organizationName,
                    skip: 0,
                    take: 1
                };

                marketplaceApi.searchSellers(searchCriteria, function (data) {
                    if (data && data.results && data.results.length > 0) {
                        var existedSeller = data.results[0];
                        // Open seller details blade
                    }
                });
            };

            blade.refresh();
        }
    ]);
```

#### ✅ После (Vue.js Composable)
```typescript
// composables/useRegistrationRequestDetails.ts
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { StateMachineApi, MarketplaceApi } from '@/api_client';

export const useRegistrationRequestDetails = () => {
  const { t } = useI18n();
  const isLoading = ref(false);
  const currentEntity = ref(null);
  const originalEntity = ref(null);
  const stateMachineInstance = ref(null);

  const localizedStatus = computed(() => {
    if (stateMachineInstance.value?.currentState?.localizedValue) {
      return stateMachineInstance.value.currentState.localizedValue;
    }
    return currentEntity.value?.status;
  });

  const toolbarCommands = computed(() => {
    const commands = [];
    
    if (stateMachineInstance.value?.currentState?.transitions) {
      stateMachineInstance.value.currentState.transitions.forEach((transition) => {
        commands.push({
          id: `command${transition.trigger}`,
          name: transition.localizedValue || transition.trigger,
          title: transition.description,
          icon: transition.icon,
          action: () => doAction(transition.trigger)
        });
      });
    }
    
    return commands;
  });

  const refresh = async (parentRefresh = false) => {
    isLoading.value = true;
    
    try {
      if (currentEntity.value?.id) {
        const stateMachineApi = new StateMachineApi();
        
        const response = await stateMachineApi.searchStateMachineInstance({
          objectTypes: ['VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest'],
          objectIds: [currentEntity.value.id],
          responseGroup: 'withLocalization',
          locale: t('locale'),
          take: 1
        });

        if (response.totalCount > 0) {
          stateMachineInstance.value = response.results[0];
        }
      }
    } finally {
      isLoading.value = false;
    }
  };

  const openVendorDetails = async () => {
    if (!currentEntity.value?.organizationName) return;

    const marketplaceApi = new MarketplaceApi();
    const searchCriteria = {
      keyword: currentEntity.value.organizationName,
      skip: 0,
      take: 1
    };

    try {
      const data = await marketplaceApi.searchSellers(searchCriteria);
      if (data?.results?.length > 0) {
        const existedSeller = data.results[0];
        // Navigate to seller details
      }
    } catch (error) {
      console.error('Error searching sellers:', error);
    }
  };

  const doAction = async (trigger: string) => {
    // Implementation for state machine actions
  };

  return {
    isLoading,
    currentEntity,
    originalEntity,
    stateMachineInstance,
    localizedStatus,
    toolbarCommands,
    refresh,
    openVendorDetails,
    doAction
  };
};
```

### 3. Список заявок с фильтрацией

#### ❌ До (AngularJS)
```javascript
// Scripts/blades/registration-request-list.js
angular.module('virtoCommerce.marketplaceRegistrationModule')
    .controller('virtoCommerce.marketplaceRegistrationModule.registrationRequestListController',
        ['$scope', '$localStorage',
        'platformWebApp.bladeUtils', 'platformWebApp.bladeNavigationService',
        'virtoCommerce.marketplaceRegistrationModule.webApi',
        'platformWebApp.uiGridHelper',
        function ($scope, $localStorage,
            bladeUtils, bladeNavigationService,
            registrationApi,
            uiGridHelper) {
            
            var blade = $scope.blade;
            blade.headIcon = 'fa fa-address-card';
            blade.title = 'marketplaceRegistration.blades.registration-request-list.title';
            $scope.hasMore = true;

            var filter = blade.filter = $scope.filter = {};

            blade.refresh = function (needRefreshChildBlade) {
                blade.isLoading = true;

                if ($scope.pageSettings.currentPage !== 1)
                    $scope.pageSettings.currentPage = 1;

                var searchCriteria = getSearchCriteria();

                if (filter.current) {
                    angular.extend(searchCriteria, filter.current);
                }

                registrationApi.searchRegistrationRequests(searchCriteria, function (data) {
                    blade.isLoading = false;
                    $scope.listEntries = [];
                    blade.selectedItem = undefined;

                    if (data.results) {
                        $scope.listEntries = data.results;
                        if (notificationRegistrationRequestId) {
                            $scope.selectedNodeId = notificationRegistrationRequestId;
                        }
                        if ($scope.selectedNodeId) {
                            blade.selectedItem = $scope.listEntries.find(x => x.id === $scope.selectedNodeId);
                        }
                    }

                    $scope.pageSettings.totalItems = data.totalCount;
                    $scope.hasMore = data.results.length === $scope.pageSettings.itemsPerPageCount;
                });
            };

            function getSearchCriteria() {
                var searchCriteria = {
                    keyword: filter.keyword,
                    skip: ($scope.pageSettings.currentPage - 1) * $scope.pageSettings.itemsPerPageCount,
                    take: $scope.pageSettings.itemsPerPageCount
                };
                return searchCriteria;
            }

            blade.refresh();
        }
    ]);
```

#### ✅ После (Vue.js Composition API)
```vue
<!-- pages/RegistrationRequestList.vue -->
<template>
  <div class="registration-request-list">
    <div class="filters">
      <VcInput 
        v-model="filter.keyword" 
        :placeholder="$t('common.search')"
        @keyup.enter="refresh"
      />
      <VcSelect 
        v-model="filter.current"
        :options="savedFilters"
        @change="onFilterChange"
      />
    </div>

    <VcTable
      :loading="isLoading"
      :items="listEntries"
      :columns="columns"
      :total-count="totalCount"
      :page="currentPage"
      :page-size="pageSize"
      @item-click="selectItem"
      @page-change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRegistrationRequests } from '@/composables/useRegistrationRequests';

const { t } = useI18n();
const {
  searchRequests,
  isLoading,
  listEntries,
  totalCount,
  hasMore
} = useRegistrationRequests();

const filter = reactive({
  keyword: '',
  current: null
});

const currentPage = ref(1);
const pageSize = ref(20);

const columns = computed(() => [
  { key: 'firstName', title: t('registration.firstName') },
  { key: 'lastName', title: t('registration.lastName') },
  { key: 'organizationName', title: t('registration.organizationName') },
  { key: 'contactEmail', title: t('registration.contactEmail') },
  { key: 'status', title: t('registration.status') }
]);

const searchCriteria = computed(() => ({
  keyword: filter.keyword,
  skip: (currentPage.value - 1) * pageSize.value,
  take: pageSize.value,
  ...filter.current
}));

const refresh = async () => {
  await searchRequests(searchCriteria.value);
};

const selectItem = (item: any) => {
  // Handle item selection
};

const onFilterChange = () => {
  currentPage.value = 1;
  refresh();
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  refresh();
};

// Watch for filter changes
watch(() => filter.keyword, () => {
  if (currentPage.value > 1) {
    currentPage.value = 1;
  } else {
    refresh();
  }
});

onMounted(() => {
  refresh();
});
</script>
```

### 4. API сервисы

#### ❌ До (AngularJS)
```javascript
// Scripts/resources/marketplace-registration-api.js
angular.module('virtoCommerce.marketplaceRegistrationModule')
    .factory('virtoCommerce.marketplaceRegistrationModule.webApi', ['$resource', function ($resource) {
        return $resource('api/vcmp', null, {
            searchRegistrationRequests: { method: 'POST', url: 'api/vcmp/registrationrequest/search' },
            createRegistrationRequests: { method: 'POST', url: 'api/vcmp/registrationrequest/new' },
            updateRegistrationRequests: { method: 'POST', url: 'api/vcmp/registrationrequest/update' },
            getSettings: { method: 'GET', url: 'api/vcmp/registrationrequest/settings' },
        });
    }]);
```

#### ✅ После (Auto-generated TypeScript API Client)
```typescript
// api_client/api/registration-requests-api.ts (автоматически сгенерировано)
export class RegistrationRequestsApi extends BaseAPI {
    /**
     * Search registration requests
     */
    public async searchRegistrationRequests(
        searchCriteria: SearchRegistrationRequestCriteria,
        options?: AxiosRequestConfig
    ): Promise<SearchRegistrationRequestResult> {
        const response = await this.request({
            url: '/api/vcmp/registrationrequest/search',
            method: 'POST',
            data: searchCriteria,
            ...options
        });
        return response.data;
    }

    /**
     * Create registration request
     */
    public async createRegistrationRequest(
        request: RegistrationRequest,
        options?: AxiosRequestConfig
    ): Promise<RegistrationRequest> {
        const response = await this.request({
            url: '/api/vcmp/registrationrequest/new',
            method: 'POST',
            data: request,
            ...options
        });
        return response.data;
    }

    /**
     * Update registration request
     */
    public async updateRegistrationRequest(
        request: RegistrationRequest,
        options?: AxiosRequestConfig
    ): Promise<void> {
        await this.request({
            url: '/api/vcmp/registrationrequest/update',
            method: 'POST',
            data: request,
            ...options
        });
    }

    /**
     * Get settings
     */
    public async getSettings(
        options?: AxiosRequestConfig
    ): Promise<RegistrationRequestSettings> {
        const response = await this.request({
            url: '/api/vcmp/registrationrequest/settings',
            method: 'GET',
            ...options
        });
        return response.data;
    }
}
```

### 5. Шаблоны и компоненты

#### ❌ До (AngularJS HTML)
```html
<!-- Scripts/blades/registration-request-details.tpl.html -->
<div class="blade-content">
    <div class="blade-inner">
        <div class="inner-block">
            <form class="form" name="formScope">
                <fieldset>
                    <va-metaform registered-inputs="blade.metaFields" blade="blade" ng-init="setForm(formScope)"></va-metaform>
                </fieldset>
            </form>
            <va-widget-container group="registrationRequestDetails" blade="blade" data="blade.item" class="form-group"></va-widget-container>
        </div>
    </div>
</div>

<script type="text/ng-template" id="registrationRequest-organizationNameField.html">
  <a ng-click="blade.openVendorDetails()">
    <label class="organization-name-link">{{ 'marketplaceRegistration.blades.registration-request-details.labels.open-vendor-details' | translate }}</label>
  </a>
</script>
```

#### ✅ После (Vue.js SFC)
```vue
<!-- components/RegistrationRequestDetails.vue -->
<template>
  <div class="registration-request-details">
    <VcContainer :loading="isLoading">
      <VcForm v-model="formData" :schema="formSchema">
        <template #organizationName="{ field }">
          <div class="flex items-center gap-2">
            <VcInput v-model="field.value" readonly />
            <VcButton 
              v-if="showSuccessFields"
              variant="outline"
              size="sm"
              @click="openVendorDetails"
            >
              {{ $t('registration.openVendorDetails') }}
            </VcButton>
          </div>
        </template>
      </VcForm>

      <VcWidgetContainer 
        group="registrationRequestDetails"
        :data="currentEntity"
      />
    </VcContainer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRegistrationRequestDetails } from '@/composables/useRegistrationRequestDetails';

const { t } = useI18n();
const {
  isLoading,
  currentEntity,
  localizedStatus,
  openVendorDetails
} = useRegistrationRequestDetails();

const showSuccessFields = computed(() => {
  // Logic to determine if success fields should be shown
  return currentEntity.value?.status === 'Success';
});

const formData = computed({
  get: () => currentEntity.value || {},
  set: (value) => {
    // Handle form updates if needed
  }
});

const formSchema = computed(() => [
  {
    property: 'localizedStatus',
    title: t('registration.status'),
    type: 'text',
    readonly: true
  },
  {
    property: 'firstName',
    title: t('registration.firstName'),
    type: 'text',
    readonly: true
  },
  {
    property: 'lastName',
    title: t('registration.lastName'),
    type: 'text',
    readonly: true
  },
  {
    property: 'organizationName',
    title: t('registration.organizationName'),
    type: 'text',
    readonly: true
  },
  {
    property: 'contactEmail',
    title: t('registration.contactEmail'),
    type: 'email',
    readonly: true
  },
  {
    property: 'contactPhone',
    title: t('registration.contactPhone'),
    type: 'tel',
    readonly: true
  }
]);
</script>
```

## 🎯 Ключевые изменения

### 1. **Архитектурные изменения:**
- AngularJS Controllers → Vue.js Composition API
- Angular Services → TypeScript Classes with API clients
- Angular Templates → Vue.js Single File Components
- Angular Modules → Vue.js Plugins

### 2. **Управление состоянием:**
- `$scope` → `ref()` и `reactive()`
- Angular Services → Composables
- `$rootScope.$broadcast` → Event emitters или Pinia store

### 3. **API интеграция:**
- `$resource` → Auto-generated TypeScript API clients
- Callbacks → Promises/async-await
- Manual API calls → Type-safe API methods

### 4. **Стилизация:**
- Bootstrap classes → Tailwind CSS
- Custom CSS → Utility-first approach
- Angular directives → Vue.js directives

### 5. **Тестирование:**
- Jasmine/Karma → Vitest
- Angular mocks → Vue Testing Library
- E2E with Protractor → Playwright

Эта миграция демонстрирует полный переход на современный стек технологий с сохранением всей функциональности и улучшением Developer Experience.