var moduleName = 'virtoCommerce.marketplaceRegistrationModule';

if (AppDependencies !== undefined) {
    AppDependencies.push(moduleName);
}

angular.module(moduleName, [])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('workspace.registrationrequest', {
                    url: '/registrationrequest',
                    templateUrl: '$(Platform)/Scripts/common/templates/home.tpl.html',
                    controller: [
                        'platformWebApp.bladeNavigationService',
                        function (bladeNavigationService) {
                            var newBlade = {
                                id: 'registrationRequestList',
                                controller: 'virtoCommerce.marketplaceRegistrationModule.registrationRequestListController',
                                template: 'Modules/$(VirtoCommerce.MarketplaceRegistration)/Scripts/blades/registration-request-list.tpl.html',
                                isClosingDisabled: true,
                            };
                            bladeNavigationService.showBlade(newBlade);
                        }
                    ]
                });
        }
    ])
    .run(['platformWebApp.mainMenuService', '$state',
        'platformWebApp.metaFormsService',
        function (mainMenuService, $state,
            metaFormsService) {
            //Register module in main menu
            var menuItem = {
                path: 'browse/registrationrequest',
                icon: 'fa fa-address-card',
                title: 'marketplaceRegistration.main-menu-title',
                priority: 100,
                action: function () { $state.go('workspace.registrationrequest'); },
                permission: 'MarketplaceRegistrationModule:access',
            };
            mainMenuService.addMenuItem(menuItem);
        }
    ]);
