angular.module('virtoCommerce.marketplaceRegistrationModule')
    .controller('virtoCommerce.marketplaceRegistrationModule.registrationRequestListController',
        ['$scope',
        'platformWebApp.bladeUtils', 'platformWebApp.bladeNavigationService',
        'platformWebApp.metaFormsService',
        'virtoCommerce.marketplaceRegistrationModule.webApi',
        'platformWebApp.uiGridHelper', 'platformWebApp.ui-grid.extension',
        function ($scope,
            bladeUtils, bladeNavigationService,
            metaFormsService,
            registrationApi,
            uiGridHelper, gridOptionExtension) {
            $scope.uiGridConstants = uiGridHelper.uiGridConstants;

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

                    if (blade.searchCriteria) {
                        angular.extend(searchCriteria, blade.searchCriteria);
                    }

                    registrationApi.searchRegistrationRequests(searchCriteria, function (data) {
                        blade.isLoading = false;

                        $scope.listEntries = [];
                        blade.selectedItem = undefined;

                        if (data.results) {
                            $scope.listEntries = data.results;
                            if ($scope.selectedNodeId) {
                                blade.selectedItem = $scope.listEntries.filter(x => x.id === $scope.selectedNodeId).find(o => true);
                            }
                        }

                        $scope.pageSettings.totalItems = data.totalCount;
                        $scope.hasMore = data.results.length === $scope.pageSettings.itemsPerPageCount;

                        if (blade.childBlade) {
                            if (blade.selectedItem) {
                                blade.childBlade.currentEntity = blade.selectedItem;
                                if (needRefreshChildBlade) {
                                    blade.childBlade.refresh();
                                };
                            }
                        }
                    });

                resetStateGrid();
            };

            blade.toolbarCommands = [
                {
                    name: "platform.commands.refresh", icon: 'fa fa-refresh',
                    executeMethod: function () {
                        blade.refresh(true);
                    },
                    canExecuteMethod: function () {
                        return true;
                    }
                }
                //{
                //    name: "marketplaceCommunication.blades.conversation-list.commands.new-chat",
                //    icon: 'fas fa-plus',
                //    executeMethod: function () {
                //        $scope.startNew();
                //    },
                //    canExecuteMethod: function () {
                //        return true;
                //    }
                //}
            ];

            var setSelectedItem = function (listItem) {
                $scope.selectedNodeId = listItem.id;
                blade.selectedItem = listItem;
            };

            $scope.selectItem = function (e, listItem) {
                setSelectedItem(listItem);

                $scope.showDetails(listItem);
            }

            $scope.showDetails = function (listItem) {
                var conversationTemplate = metaFormsService.getMetaFields('RegistrationRequest');
                var newBlade = {
                    id: 'registrationRequest',
                    currentEntity: listItem,
                    controller: 'virtoCommerce.marketplaceRegistrationModule.regisrationRequestDetailsController',
                    template: 'Modules/$(VirtoCommerce.MarketplaceRegistration)/Scripts/blades/registration-request-details.tpl.html',
                    metaFields: conversationTemplate
                };
                blade.childBlade = newBlade;
                bladeNavigationService.showBlade(newBlade, blade);
            }

            $scope.startNew = function () {
                $scope.selectedNodeId = undefined;
                blade.selectedItem = undefined;

                var newBlade = {
                    id: 'conversationAdd',
                    controller: 'virtoCommerce.marketplaceCommunicationModule.conversationAddController',
                    template: 'Modules/$(VirtoCommerce.MarketplaceCommunication)/Scripts/blades/conversation-add.tpl.html'
                };
                blade.childBlade = newBlade;
                bladeNavigationService.showBlade(newBlade, blade);
            }

            filter.criteriaChanged = function () {
                if ($scope.pageSettings.currentPage > 1) {
                    $scope.pageSettings.currentPage = 1;
                } else {
                    blade.refresh(true);
                }
            };

            function getSearchCriteria() {
                var searchCriteria = {
                    //sort: uiGridHelper.getSortExpression($scope),
                    keyword: filter.keyword,
                    skip: ($scope.pageSettings.currentPage - 1) * $scope.pageSettings.itemsPerPageCount,
                    take: $scope.pageSettings.itemsPerPageCount
                };
                return searchCriteria;
            }

            function showMore() {
                if ($scope.hasMore) {

                    ++$scope.pageSettings.currentPage;
                    $scope.gridApi.infiniteScroll.saveScrollPercentage();
                    blade.isLoading = true;

                    var searchCriteria = getSearchCriteria();

                    registrationApi.searchRegistrationRequests(
                        searchCriteria,
                        function (data) {
                            blade.isLoading = false;
                            $scope.pageSettings.totalItems = data.totalCount;
                            $scope.listEntries = $scope.listEntries.concat(data.results);
                            $scope.hasMore = data.results.length === $scope.pageSettings.itemsPerPageCount;
                            $scope.gridApi.infiniteScroll.dataLoaded();
                        });
                }
            }

            function resetStateGrid() {
                if ($scope.gridApi) {
                    $scope.items = [];
//                    $scope.gridApi.selection.clearSelectedRows();
                    $scope.gridApi.infiniteScroll.resetScroll(true, true);
                    $scope.gridApi.infiniteScroll.dataLoaded();
                }
            }

            $scope.setGridOptions = function (gridOptions) {
                bladeUtils.initializePagination($scope, true);

                $scope.pageSettings.itemsPerPageCount = 30;

                uiGridHelper.initialize($scope, gridOptions, function (gridApi) {
                    $scope.gridApi = gridApi;

                    //uiGridHelper.bindRefreshOnSortChanged($scope);
                    $scope.gridApi.infiniteScroll.on.needLoadMoreData($scope, showMore);
                });
                $scope.$watch('blade.filter.showUnread', blade.refresh);
            };

            //blade.refresh();
        }
    ]);
