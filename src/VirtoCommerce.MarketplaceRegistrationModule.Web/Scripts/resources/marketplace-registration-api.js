angular.module('virtoCommerce.marketplaceRegistrationModule')
    .factory('virtoCommerce.marketplaceRegistrationModule.webApi', ['$resource', function ($resource) {
        return $resource('api/vcmp', null, {
            // registration request
            searchRegistrationRequests: { method: 'POST', url: 'api/vcmp/registrationrequest/search' },
        });
    }]);
