# Migration Guide: AngularJS to vc-shell

## Overview

This document describes the migration of the VirtoCommerce Marketplace Registration module from AngularJS to vc-shell (Vue.js 3).

## Architecture Changes

### From AngularJS to Vue.js 3

| AngularJS | vc-shell (Vue.js 3) |
|-----------|-------------------|
| Controllers | Composition API with `<script setup>` |
| Templates | Vue SFC templates |
| Services | Composables |
| Directives | Vue directives |
| Filters | Computed properties |
| $scope | Reactive references |

## File Structure Migration

### Original Structure (AngularJS)
```
Scripts/
├── blades/
│   ├── registration-request-list.js
│   ├── registration-request-list.tpl.html
│   ├── registration-request-details.js
│   ├── registration-request-details.tpl.html
│   ├── registration-request-filter.js
│   └── registration-request-filter.tpl.html
├── dialogs/
│   └── decline-request-dialog.tpl.html
├── notifications/
│   └── registration-request-notification.tpl.html
├── resources/
│   └── marketplace-registration-api.js
└── module.js
```

### New Structure (vc-shell)
```
src/modules/admin/
├── components/
│   ├── RegistrationRequestDetails.vue
│   ├── RegistrationRequestFilter.vue
│   ├── RegistrationRequestNotification.vue
│   └── index.ts
├── composables/
│   ├── useRegistrationRequests.ts
│   ├── useRegistrationFilters.ts
│   ├── useStateMachine.ts
│   ├── useMarketplaceVendor.ts
│   └── useDialog.ts
├── pages/
│   ├── RegistrationRequestsList.vue
│   ├── RegistrationRequestDetails.vue
│   └── index.ts
├── router/
│   └── index.ts
├── locales/
│   ├── en.json
│   └── index.ts
├── index.ts
└── module.manifest.json
```

## Key Components Migration

### 1. Registration Request List
- **From**: `registration-request-list.js` + `registration-request-list.tpl.html`
- **To**: `pages/RegistrationRequestsList.vue`
- **Changes**: 
  - Converted controller to Composition API
  - Replaced AngularJS directives with Vue components
  - Integrated with vc-shell component library

### 2. Registration Request Details
- **From**: `registration-request-details.js` + `registration-request-details.tpl.html`
- **To**: `components/RegistrationRequestDetails.vue`
- **Changes**:
  - Converted to Vue SFC with TypeScript
  - Replaced $scope with reactive references
  - Integrated state machine functionality

### 3. Registration Request Filter
- **From**: `registration-request-filter.js` + `registration-request-filter.tpl.html`
- **To**: `components/RegistrationRequestFilter.vue`
- **Changes**:
  - Converted to Vue component with props/emits
  - Added TypeScript interfaces
  - Improved form validation

### 4. API Integration
- **From**: `marketplace-registration-api.js`
- **To**: `composables/useRegistrationRequests.ts`
- **Changes**:
  - Converted $resource to composable pattern
  - Added TypeScript interfaces
  - Improved error handling

## Features Migration

### State Management
- **From**: AngularJS `$scope` and `$localStorage`
- **To**: Vue 3 `ref`, `reactive`, and `localStorage` API
- **Benefits**: Better type safety and reactivity

### Routing
- **From**: AngularJS `$state` and `$stateProvider`
- **To**: Vue Router 4 with TypeScript
- **Benefits**: Better navigation guards and type safety

### Internationalization
- **From**: AngularJS `$translate`
- **To**: Vue i18n with TypeScript
- **Benefits**: Better IDE support and type checking

### State Machine Integration
- **From**: AngularJS service injection
- **To**: Vue composables with TypeScript
- **Benefits**: Better reusability and testing

## New Features

### 1. Enhanced UI Components
- Replaced custom AngularJS directives with vc-shell components
- Improved accessibility and responsive design
- Better form validation and error handling

### 2. TypeScript Support
- Full TypeScript support for better development experience
- Type-safe API calls and data handling
- Better IDE support with auto-completion

### 3. Modern Build System
- Vite-based build system for faster development
- Hot module replacement for instant updates
- Optimized production builds

### 4. Improved Testing
- Vue Testing Library integration
- Component unit testing support
- Better test isolation and mocking

## Migration Benefits

1. **Performance**: Faster rendering with Vue 3's reactivity system
2. **Developer Experience**: Better TypeScript support and modern tooling
3. **Maintainability**: Cleaner component structure and better code organization
4. **Scalability**: Modular architecture with reusable composables
5. **Accessibility**: Better accessibility support with vc-shell components

## Breaking Changes

### API Changes
- API methods now return Promises instead of using callbacks
- Error handling is now done with try/catch instead of error callbacks

### Component Props
- All props are now strongly typed with TypeScript interfaces
- Event handlers use emit instead of callback functions

### Routing
- Route parameters are now accessed via `useRoute()` instead of `$stateParams`
- Navigation is done with `useRouter()` instead of `$state.go()`

## Migration Steps

1. **Setup**: Install dependencies and configure build system
2. **API Migration**: Convert API services to composables
3. **Component Migration**: Convert blades to Vue components
4. **Routing Migration**: Setup Vue Router configuration
5. **State Management**: Convert scope variables to reactive references
6. **Internationalization**: Setup Vue i18n with existing translations
7. **Testing**: Add unit tests for new components
8. **Integration**: Integrate with existing vc-shell application

## Future Enhancements

1. **Progressive Web App**: Add PWA features for offline support
2. **Real-time Updates**: Implement WebSocket integration for live updates
3. **Advanced Filtering**: Add more sophisticated filtering options
4. **Bulk Operations**: Support for bulk actions on registration requests
5. **Analytics**: Add dashboard with registration statistics

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Router 4 Documentation](https://router.vuejs.org/)
- [Vue i18n Documentation](https://vue-i18n.intlify.dev/)
- [vc-shell Component Library](https://github.com/VirtoCommerce/vc-shell)
- [TypeScript Documentation](https://www.typescriptlang.org/)