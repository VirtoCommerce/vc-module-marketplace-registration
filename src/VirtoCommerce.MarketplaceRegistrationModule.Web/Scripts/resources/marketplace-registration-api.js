angular.module('virtoCommerce.marketplaceRegistrationModule')
    .factory('virtoCommerce.marketplaceRegistrationModule.webApi', ['$resource', function ($resource) {
        return $resource('api/vcmp', null, {
            // registration request
            searchRegistrationRequests: { method: 'POST', url: 'api/vcmp/registrationrequest/search' },
            createRegistrationRequests: { method: 'POST', url: 'api/vcmp/registrationrequest/new' },
            updateRegistrationRequests: { method: 'POST', url: 'api/vcmp/registrationrequest/update' },
            allStates: { method: 'GET', url: 'api/vcmp/registrationrequest/allstates', isArray: true },
        });
    }]);
