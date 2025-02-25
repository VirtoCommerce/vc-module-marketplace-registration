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
                    params: {
                        notification: null,
                    },
                    templateUrl: '$(Platform)/Scripts/common/templates/home.tpl.html',
                    controller: [
                        '$stateParams', 'platformWebApp.bladeNavigationService',
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
        }
    ])
    .run(['platformWebApp.mainMenuService', '$state',
        'platformWebApp.metaFormsService', 'virtoCommerce.stateMachineModule.stateMachineRegistrar',
        'platformWebApp.dialogService', 'platformWebApp.bladeNavigationService',
        'platformWebApp.pushNotificationTemplateResolver',
        'virtoCommerce.marketplaceRegistrationModule.webApi',
        function (mainMenuService, $state,
            metaFormsService, stateMachineRegistrar,
            dialogService, bladeNavigationService,
            pushNotificationTemplateResolver,
            registrationApi
        ) {
            //Register module in main menu
            var menuItem = {
                path: 'browse/registrationrequest',
                icon: 'fa fa-address-card',
                title: 'marketplaceRegistration.main-menu-title',
                priority: 100,
                action: function () { $state.go('workspace.registrationrequest'); },
                permission: 'seller:registration:read',
            };
            mainMenuService.addMenuItem(menuItem);

            // register Registration request's metafields
            metaFormsService.registerMetaFields('RegistrationRequest',
                [
                    {
                        name: 'status',
                        title: 'marketplaceRegistration.blades.registration-request-details.labels.status',
                        valueType: 'ShortText',
                        isReadOnly: true
                    },
                    {
                        name: 'firstName',
                        title: 'marketplaceRegistration.blades.registration-request-details.labels.first-name',
                        valueType: 'ShortText',
                        isReadOnly: true
                    },
                    {
                        name: 'lastName',
                        title: 'marketplaceRegistration.blades.registration-request-details.labels.last-name',
                        valueType: 'ShortText',
                        isReadOnly: true
                    },
                    {
                        name: 'organizationName',
                        title: 'marketplaceRegistration.blades.registration-request-details.labels.organization-name',
                        valueType: 'ShortText',
                        isReadOnly: true
                    },
                    {
                        name: 'organizationName',
                        templateUrl: 'registrationRequest-organizationNameField.html',
                        isVisibleFn: function (blade) {
                            return blade.showSuccessFields;
                        }
                    },
                    {
                        name: 'contactEmail',
                        title: 'marketplaceRegistration.blades.registration-request-details.labels.contact-email',
                        valueType: 'ShortText',
                        isReadOnly: true
                    },
                    {
                        name: 'contactPhone',
                        title: 'marketplaceRegistration.blades.registration-request-details.labels.contact-phone',
                        valueType: 'ShortText',
                        isReadOnly: true
                    },
                    {
                        name: 'declineReason',
                        title: 'marketplaceRegistration.blades.registration-request-details.labels.decline-reason',
                        valueType: 'LongText',
                        isReadOnly: true,
                        isVisibleFn: function (blade) {
                            return blade.showFailedFields;
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
                                    blade.close();
                                });
                                successCallback();
                            }
                        }
                    }
                    dialogService.showDialog(dialog, 'Modules/$(VirtoCommerce.MarketplaceRegistration)/Scripts/dialogs/decline-request-dialog.tpl.html', 'platformWebApp.confirmDialogController');
                }
            });

            // Registration request notification template
            pushNotificationTemplateResolver.register({
                priority: 900,
                satisfy: function (notify, place) {
                    return (place === 'history' || place === 'header-notification')
                        && notify.notifyType === 'RegistrationRequestPushNotification';
                },
                template: 'Modules/$(VirtoCommerce.MarketplaceRegistration)/Scripts/notifications/registration-request-notification.tpl.html',
                action: function (notify) {
                    if ($state.current.name !== 'workspace.registrationrequest') {
                        $state.go('workspace.registrationrequest', { notification: notify });
                    }
                    else {
                        var blade = {
                            id: 'registrationRequestList',
                            notification: notify,
                            isClosingDisabled: true,
                            controller: 'virtoCommerce.marketplaceRegistrationModule.registrationRequestListController',
                            template: 'Modules/$(VirtoCommerce.MarketplaceRegistration)/Scripts/blades/registration-request-list.tpl.html',
                        };
                        bladeNavigationService.showBlade(blade);
                    }
                }

            });

        }
    ]);
