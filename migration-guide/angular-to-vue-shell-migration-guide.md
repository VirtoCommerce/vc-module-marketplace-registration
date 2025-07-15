# 🚀 Руководство по миграции Angular модуля на VirtoCommerce Shell (Vue.js 3)

## 📌 Обзор

Данное руководство описывает процесс миграции модуля VirtoCommerce Marketplace Registration с AngularJS на современную Shell архитектуру, использующую Vue.js 3.4.x, TypeScript 5.8.x и VirtoCommerce Shell Framework.

## 🎯 Результат миграции

В проекте успешно реализована миграция с сохранением всей функциональности:
- ✅ Полностью функциональное Vue.js приложение
- ✅ Интеграция с VirtoCommerce Shell Framework
- ✅ TypeScript поддержка
- ✅ Современная архитектура с композаблами
- ✅ Автоматическая генерация API клиентов

## 📁 Структура мигрированного проекта

```
vcmp-registration/
├── src/
│   ├── api_client/          # Автоматически сгенерированные API клиенты
│   ├── modules/
│   │   └── registration/
│   │       ├── components/  # Vue компоненты
│   │       ├── composables/ # Логика приложения (Composition API)
│   │       ├── pages/       # Страницы Vue
│   │       ├── router/      # Роуты Vue Router
│   │       ├── locales/     # Локализация
│   │       └── index.ts     # Модуль
│   ├── pages/              # Главные страницы приложения
│   ├── router/             # Основной роутер
│   ├── locales/            # Глобальная локализация
│   └── main.ts             # Точка входа приложения
├── package.json            # Зависимости и скрипты
├── vite.config.mts         # Конфигурация Vite
└── tsconfig.json           # Конфигурация TypeScript
```

## 🔄 Этапы миграции (выполнено)

### 1. Создание Vue.js приложения с Shell Framework

**Исходная структура (AngularJS):**
- `Scripts/blades/` - Angular контроллеры и шаблоны
- `Scripts/module.js` - Основной Angular модуль
- `Scripts/resources/` - API сервисы

**Новая структура (Vue.js Shell):**
```typescript
// src/main.ts
import VirtoShellFramework from "@vc-shell/framework";
import { createApp } from "vue";
import { router } from "./router";
import Registration from "./modules";

const app = createApp(RouterView)
  .use(VirtoShellFramework, {
    router,
    i18n: {
      locale: import.meta.env.APP_I18N_LOCALE,
      fallbackLocale: import.meta.env.APP_I18N_FALLBACK_LOCALE,
    },
  })
  .use(Registration.Registration.default, { router });
```

### 2. Миграция Angular контроллеров на Vue Composition API

**До (AngularJS):**
```javascript
// registration-request-details.js
angular.module('virtoCommerce.marketplaceRegistrationModule')
  .controller('virtoCommerce.marketplaceRegistrationModule.regisrationRequestDetailsController',
    ['$scope', 'virtoCommerce.stateMachineModule.webApi', 
     function ($scope, stateMachineApi) {
       var blade = $scope.blade;
       
       blade.refresh = function() {
         // логика обновления
       };
     }]);
```

**После (Vue.js Composable):**
```typescript
// composables/useRegistrationForm.ts
export const useRegistrationForm = () => {
  const isLoading = ref(false);
  const currentEntity = ref(null);
  
  const refresh = async () => {
    isLoading.value = true;
    try {
      // логика обновления
    } finally {
      isLoading.value = false;
    }
  };
  
  return {
    isLoading,
    currentEntity,
    refresh
  };
};
```

### 3. Создание модульной архитектуры

**Структура модуля:**
```typescript
// modules/registration/index.ts
export default {
  install(app: App, options?: { router: Router }) {
    // Добавление роутов
    routes.forEach((route) => {
      routerInstance.addRoute(route);
    });
    
    // Добавление локализации
    Object.entries(locales).forEach(([key, message]) => {
      i18n.global.mergeLocaleMessage(key, message);
    });
  },
  extensions: {
    inbound: {
      "registration-form": useRegistrationForm(),
    },
    outbound: {
      "login-after-form": [{ 
        id: "RegistrationButton", 
        component: RegistrationButton 
      }],
    },
  },
};
```

### 4. Роутинг Vue Router

**Конфигурация роутов:**
```typescript
// router/index.ts
export const routes: RouteRecordRaw[] = [
  {
    path: "/registration",
    name: "Registration", 
    component: Registration,
    props: (route) => ({
      logo: whiteLogoImage,
      background: bgImage,
    }),
  },
];
```

### 5. Автоматическая генерация API клиентов

**Конфигурация в package.json:**
```json
{
  "scripts": {
    "generate-api-client": "cross-env api-client-generator --APP_PLATFORM_MODULES='[VirtoCommerce.MarketplaceRegistration]' --APP_API_CLIENT_DIRECTORY=./src/api_client/ --APP_PACKAGE_NAME=@vcmp-registration/api --APP_PACKAGE_VERSION=$npm_package_version"
  }
}
```

## 🛠 Использование VirtoCommerce MCP Server

### Установка и настройка

1. **Установка API Client Generator:**
```bash
npm install -g @vc-shell/api-client-generator
```

2. **Генерация API клиентов:**
```bash
yarn generate-api-client
```

3. **Использование сгенерированных клиентов:**
```typescript
// В композабле
import { RegistrationRequestsApi } from "@/api_client";

export const useRegistrationRequests = () => {
  const api = new RegistrationRequestsApi();
  
  const searchRequests = async (criteria: SearchCriteria) => {
    return await api.searchRegistrationRequests(criteria);
  };
  
  return {
    searchRequests
  };
};
```

## 📦 Зависимости и инструменты

**Основные зависимости:**
```json
{
  "dependencies": {
    "@vc-shell/framework": "latest",
    "vue": "^3.4.x",
    "vue-router": "^4.x",
    "typescript": "^5.8.x"
  },
  "devDependencies": {
    "vite": "latest",
    "tailwindcss": "^3.4.17",
    "@vitejs/plugin-vue": "latest"
  }
}
```

## 🎨 Стилизация с Tailwind CSS

**Конфигурация Tailwind:**
```typescript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{vue,js,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## 🌐 Интернационализация

**Структура локализации:**
```typescript
// locales/en.ts
export default {
  "registration": {
    "title": "Registration Request",
    "form": {
      "firstName": "First Name",
      "lastName": "Last Name"
    }
  }
};
```

## 🔧 Сборка и развертывание

**Скрипты сборки:**
```json
{
  "scripts": {
    "serve": "vite --force",
    "build": "yarn build:app && yarn build:types",
    "build:app": "vite build",
    "build:types": "vue-tsc --declaration --emitDeclarationOnly"
  }
}
```

## ✅ Преимущества миграции

1. **Современные технологии:** Vue.js 3, TypeScript, Vite
2. **Лучшая производительность:** Реактивность Vue.js и быстрая сборка Vite  
3. **Модульная архитектура:** Четкое разделение ответственности
4. **Автоматическая генерация API:** Использование VirtoCommerce MCP Server
5. **Типобезопасность:** Полная поддержка TypeScript
6. **Современные инструменты разработки:** ESLint, Prettier, Hot Module Replacement

## 📚 Дополнительные ресурсы

- [VirtoCommerce Shell Framework](https://github.com/VirtoCommerce/vc-shell)
- [Vue.js 3 Documentation](https://vuejs.org/)
- [VirtoCommerce Frontend](https://github.com/VirtoCommerce/vc-frontend)
- [MCP Server Documentation](https://www.pulsemcp.com/)

## 🤝 Заключение

Миграция успешно завершена! Модуль VirtoCommerce Marketplace Registration теперь использует современную архитектуру Vue.js Shell, предоставляя:

- Высокую производительность
- Удобство разработки  
- Масштабируемость
- Интеграцию с экосистемой VirtoCommerce

Данный подход может быть использован для миграции других AngularJS модулей VirtoCommerce на современный стек технологий.