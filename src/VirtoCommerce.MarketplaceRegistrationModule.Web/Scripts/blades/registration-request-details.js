angular.module('virtoCommerce.marketplaceRegistrationModule')
    .controller('virtoCommerce.marketplaceRegistrationModule.regisrationRequestDetailsController',
        ['$scope',
            'platformWebApp.bladeNavigationService', 'virtoCommerce.marketplaceModule.webApi',
            'virtoCommerce.marketplaceModule.stateMachineRegistrar',
            function ($scope,
                bladeNavigationService, marketplaceApi,
                stateMachineRegistrar) {
            var blade = $scope.blade;
            blade.headIcon = 'fa fa-address-card';
            blade.title = 'marketplaceRegistration.blades.registration-request-details.title';
            blade.isLoading = true;

            function initializeBlade(data) {
                blade.currentEntity = angular.copy(data);
                blade.originalEntity = data;

                fillTollbarCommands();

                blade.isLoading = false;
            }

            blade.refresh = function (parentRefresh) {
                if (parentRefresh) {
                    blade.parentBlade.refresh(true);
                }

                if (blade.currentEntity) {
                    blade.stateMachineInstance = null;
                    marketplaceApi.searchStateMachineInstance({
                        objectTypes: ['VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest'],
                        objectIds: [blade.currentEntity.id],
                        take: 1
                    }, function (response) {
                        if (response.totalCount > 0) {
                            blade.stateMachineInstance = response.results[0];
                        }
                        initializeBlade(blade.currentEntity);
                    });

                }
            };

            function fillTollbarCommands() {
                blade.toolbarCommands = [];

                if (blade.stateMachineInstance
                    && blade.stateMachineInstance.currentState
                    && blade.stateMachineInstance.currentState.transitions) {
                    blade.stateMachineInstance.currentState.transitions.forEach((element, index) => {
                        var command = {
                            id: 'command' + element.trigger,
                            name: 'marketplaceRegistration.state-trigger-actions.' + element.trigger,
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
                marketplaceApi.fireSmInstanceTrigger({
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
