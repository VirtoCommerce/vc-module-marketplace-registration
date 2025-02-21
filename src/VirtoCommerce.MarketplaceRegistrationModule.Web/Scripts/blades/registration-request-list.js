angular.module('virtoCommerce.marketplaceRegistrationModule')
    .controller('virtoCommerce.marketplaceRegistrationModule.registrationRequestListController',
        ['$scope', '$localStorage',
        'platformWebApp.bladeUtils', 'platformWebApp.bladeNavigationService',
        'platformWebApp.metaFormsService',
        'virtoCommerce.marketplaceRegistrationModule.webApi', 'virtoCommerce.marketplaceModule.webApi',
        'platformWebApp.uiGridHelper', 'platformWebApp.ui-grid.extension',
        function ($scope, $localStorage,
            bladeUtils, bladeNavigationService,
            metaFormsService,
            registrationApi, marketplaceApi,
            uiGridHelper, gridOptionExtension) {
            $scope.uiGridConstants = uiGridHelper.uiGridConstants;

            var blade = $scope.blade;
            blade.headIcon = 'fa fa-address-card';
            blade.title = 'marketplaceRegistration.blades.registration-request-list.title';
            $scope.hasMore = true;

            // notification
            var notificationRegistrationRequestId = undefined;
            if (blade.notification) {
                notificationRegistrationRequestId = blade.notification.registrationRequestId;
                blade.notification = null;
            }

            // filtering
            var filter = blade.filter = $scope.filter = {};
            $scope.$localStorage = $localStorage;

            if (!$localStorage.registrationRequestFilters) {
                $localStorage.registrationRequestFilters = [{
                    name: 'marketplaceRegistration.blades.registration-request-list.filters.add-new'
                }];
            }

            if ($localStorage.registrationRequestFilterId) {
                filter.current = $localStorage.registrationRequestFilters.find(x => x.id == $localStorage.registrationRequestFilterId);
            }

            blade.refresh = function (needRefreshChildBlade) {
                blade.isLoading = true;

                if ($scope.pageSettings.currentPage !== 1)
                    $scope.pageSettings.currentPage = 1;

                    var searchCriteria = getSearchCriteria();

                    if (filter.current) {
                        angular.extend(searchCriteria, filter.current);
                    }

                    if (blade.searchCriteria) {
                        angular.extend(searchCriteria, blade.searchCriteria);
                    }

                    registrationApi.searchRegistrationRequests(searchCriteria, function (data) {
                        blade.isLoading = false;

                        $scope.listEntries = [];
                        blade.selectedItem = undefined;

                        if (data.results) {
                            $scope.listEntries = data.results;
                            if (notificationRegistrationRequestId) {
                                $scope.selectedNodeId = notificationRegistrationRequestId;
                            }
                            if ($scope.selectedNodeId) {
                                blade.selectedItem = $scope.listEntries.find(x => x.id === $scope.selectedNodeId);
                            }
                            if (notificationRegistrationRequestId) {
                                $scope.showDetails(blade.selectedItem)
                            }
                        }

                        $scope.pageSettings.totalItems = data.totalCount;
                        $scope.hasMore = data.results.length === $scope.pageSettings.itemsPerPageCount;

                        if (blade.childBlade && blade.selectedItem) {
                            blade.childBlade.currentEntity = blade.selectedItem;
                            if (needRefreshChildBlade) {
                                blade.childBlade.refresh();
                            };
                        }
                    });

                marketplaceApi.getSettings((settings) => {
                    blade.vendorPortalUrl = settings.vendorPortalUrl;
                    correctRegistrationFormUrl();
                });

                registrationApi.getSettings((settings) => {
                    blade.registrationFormUrl = settings.registrationFormUrl;
                    correctRegistrationFormUrl();
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
                },
                {
                    name: "marketplaceRegistration.blades.registration-request-list.commands.add",
                    icon: 'fas fa-plus',
                    executeMethod: redirectToRegistrationForm,
                    canExecuteMethod: function () {
                        return blade.registrationFormUrl;
                    }
                }
            ];

            function correctRegistrationFormUrl() {
                if (blade.registrationFormUrl && blade.registrationFormUrl.length > 1
                    && !(blade.registrationFormUrl.startsWith("http://") || blade.registrationFormUrl.startsWith("https://"))
                    && blade.vendorPortalUrl && blade.vendorPortalUrl.length > 1) {
                        let vendorPortalUrl = blade.vendorPortalUrl;
                        if (vendorPortalUrl.endsWith("/")) {
                            vendorPortalUrl = vendorPortalUrl.substring(0, vendorPortalUrl.length - 1);
                        }

                    let registrationFormUrl = blade.registrationFormUrl;
                        if (registrationFormUrl.startsWith("/")) {
                            registrationFormUrl = registrationFormUrl.substring(1, registrationFormUrl.length);
                        }

                        blade.registrationFormUrl = vendorPortalUrl + "/" + registrationFormUrl;
                }
            }

            function redirectToRegistrationForm() {
                if (blade.registrationFormUrl && blade.registrationFormUrl.length > 1) {
                    window.open(blade.registrationFormUrl, '_blank');
                }
            }

            var setSelectedItem = function (listItem) {
                $scope.selectedNodeId = listItem.id;
                blade.selectedItem = listItem;
            };

            $scope.selectItem = function (e, listItem) {
                setSelectedItem(listItem);

                $scope.showDetails(listItem);
            }

            $scope.showDetails = function (listItem) {
                var registrationRequestTemplate = metaFormsService.getMetaFields('RegistrationRequest');
                var newBlade = {
                    id: 'registrationRequest',
                    currentEntity: listItem,
                    controller: 'virtoCommerce.marketplaceRegistrationModule.regisrationRequestDetailsController',
                    template: 'Modules/$(VirtoCommerce.MarketplaceRegistration)/Scripts/blades/registration-request-details.tpl.html',
                    metaFields: registrationRequestTemplate,
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

            filter.change = function () {
                $localStorage.registrationRequestFilterId = filter.current ? filter.current.id : null;
                if (filter.current && !filter.current.id) {
                    filter.current = null;
                    showFilterDetailBlade({ isNew: true });
                } else {
                    bladeNavigationService.closeBlade({ id: 'filterDetail' });
                    filter.criteriaChanged();
                }
            };

            filter.edit = function () {
                if (filter.current) {
                    showFilterDetailBlade({ data: filter.current });
                }
            };

            function showFilterDetailBlade(bladeData) {
                var newBlade = {
                    id: 'filterDetail',
                    controller: 'virtoCommerce.marketplaceRegistrationModule.RegistrationRequestFilterController',
                    template: 'Modules/$(VirtoCommerce.MarketplaceRegistration)/Scripts/blades/registration-request-filter.tpl.html'
                };
                angular.extend(newBlade, bladeData);
                bladeNavigationService.showBlade(newBlade, blade);
            }

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
