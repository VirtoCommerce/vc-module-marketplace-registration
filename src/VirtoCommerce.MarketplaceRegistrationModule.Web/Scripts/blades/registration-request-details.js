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

            var bladeNavigationService = bladeUtils.bladeNavigationService;

            function initializeBlade(data) {
                data.localizedStatus = data.status;
                if (blade.stateMachineInstance
                    && blade.stateMachineInstance.currentState
                    && blade.stateMachineInstance.currentState.localizedValue) {
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

                blade.close = function () {
                    $scope.bladeClose();
                }

            function fillTollbarCommands() {
                blade.toolbarCommands = [];

                if (blade.stateMachineInstance
                    && blade.stateMachineInstance.currentState
                    && blade.stateMachineInstance.currentState.transitions) {
                    blade.stateMachineInstance.currentState.transitions.forEach((element, index) => {
                        var command = {
                            id: 'command' + element.trigger,
                            name: element.localizedValue || element.trigger,
                            title: element.description,
                            icon: element.icon,
                            executeMethod: function () {
                                doAction(element.trigger);
                            },
                            canExecuteMethod: function () {
                                return true;
                            }
                        };
                        if (!blade.toolbarCommands.find(x => x.id === "command" + element.trigger)) {
                            blade.toolbarCommands.splice(index, 0, command);
                        }
                    });
                }
            }

            $scope.setForm = function (form) {
                $scope.formScope = form;
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

                        var foundMetaFields = metaFormsService.getMetaFields('Seller');
                        var newBlade = {
                            id: 'sellerDetails',
                            title: existedSeller.name,
                            subtitle: 'marketplace.blades.seller-details.subtitle',
                            currentEntity: existedSeller,
                            controller: 'virtoCommerce.marketplaceModule.sellerDetailsController',
                            template: 'Modules/$(VirtoCommerce.MarketplaceVendor)/Scripts/blades/seller-details.tpl.html',
                            metaFields: foundMetaFields
                        };
                        bladeNavigationService.showBlade(newBlade, blade);
                    }
                });
            }

            function doAction(trigger) {
                blade.isLoading = true;
                var stateMachineAction = stateMachineRegistrar.getStateAction(trigger);
                if (stateMachineAction && stateMachineAction.callbackFn && typeof stateMachineAction.callbackFn === "function") {
                    function successCallback() {
                        doStateMachineStep(trigger);
                    };
                    stateMachineAction.callbackFn(blade, successCallback);
                } else {
                    doStateMachineStep(trigger);
                }

                blade.isLoading = false;
            }

            function doStateMachineStep(trigger) {
                stateMachineApi.fireStateMachineInstanceTrigger({
                    stateMachineInstanceId: blade.stateMachineInstance.id,
                    trigger: trigger,
                    entityId: blade.currentEntity.id
                },
                function (data) {
                    blade.refresh(true);
                });
            }

            blade.refresh();
        }
    ]);
