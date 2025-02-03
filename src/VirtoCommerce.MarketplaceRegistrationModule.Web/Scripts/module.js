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
        'platformWebApp.metaFormsService', 'virtoCommerce.marketplaceModule.stateMachineRegistrar',
        'platformWebApp.dialogService', 'platformWebApp.bladeNavigationService',
        'virtoCommerce.marketplaceRegistrationModule.webApi',
        function (mainMenuService, $state,
            metaFormsService, stateMachineRegistrar,
            dialogService, bladeNavigationService,
            registrationApi
        ) {
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

            // register Registration request's metafields
            metaFormsService.registerMetaFields('RegistrationRequest',
                [
                    {
                        name: 'firstName',
                        title: 'marketplaceRegistration.blades.registration-request-details.labels.first-name',
                        valueType: 'ShortText'
                    },
                    {
                        name: 'lastName',
                        title: 'marketplaceRegistration.blades.registration-request-details.labels.last-name',
                        valueType: 'ShortText'
                    },
                    {
                        name: 'organizationName',
                        title: 'marketplaceRegistration.blades.registration-request-details.labels.organization-name',
                        valueType: 'ShortText'
                    },
                    {
                        name: 'contactEmail',
                        title: 'marketplaceRegistration.blades.registration-request-details.labels.contact-email',
                        valueType: 'ShortText'
                    },
                    {
                        name: 'contactPhone',
                        title: 'marketplaceRegistration.blades.registration-request-details.labels.contact-phone',
                        valueType: 'ShortText'
                    },
                    {
                        name: 'declineReason',
                        title: 'marketplaceRegistration.blades.registration-request-details.labels.decline-reason',
                        valueType: 'ShortText',
                        isVisibleFn: function (blade) {
                            return blade.currentEntity.status == 'Declined'
                        }
                    },
                ]
            );

            // register state machine actions: complete
            stateMachineRegistrar.registerStateAction('CompleteRegistrationRequest', {
                callbackFn: function (blade, successCallback) {
                    var foundMetaFields = metaFormsService.getMetaFields('SellerAdd');
                    var createSellerCommand = {
                        sellerName: blade.currentEntity.organizationName,
                        ownerDetails: {
                            firstName: blade.currentEntity.firstName,
                            lastName: blade.currentEntity.lastName,
                            email: blade.currentEntity.contactEmail
                        }
                    };
                    var newBlade = {
                        id: 'registrationRequestComplete',
                        command: createSellerCommand,
                        title: 'marketplace.blades.seller-add.title',
                        subtitle: 'marketplace.blades.seller-add.subtitle',
                        controller: 'virtoCommerce.marketplaceModule.sellerAddController',
                        template: 'Modules/$(VirtoCommerce.MarketplaceVendor)/Scripts/blades/seller-add.tpl.html',
                        metaFields: foundMetaFields,
                        successCallback: successCallback
                    };
                    blade.childBlade = newBlade;
                    bladeNavigationService.showBlade(newBlade, blade);
                }
            });

            // register state machine actions: decline
            stateMachineRegistrar.registerStateAction('DeclineRegistrationRequest', {
                callbackFn: function (blade, successCallback) {
                    var dialog = {
                        comment: { text: '' },
                        callback: function (decline) {
                            if (decline) {
                                registrationApi.updateRegistrationRequests({
                                    id: blade.currentEntity.id,
                                    comment: dialog.comment.text
                                }, function (data) {
                                    blade.currentEntity = data;
                                });
                                successCallback();
                            }
                        }
                    }
                    dialogService.showDialog(dialog, 'Modules/$(VirtoCommerce.MarketplaceRegistration)/Scripts/dialogs/decline-request-dialog.tpl.html', 'platformWebApp.confirmDialogController');
                }
            });

        }
    ]);
