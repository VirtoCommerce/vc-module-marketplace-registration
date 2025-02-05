angular.module('virtoCommerce.marketplaceRegistrationModule')
    .controller('virtoCommerce.marketplaceRegistrationModule.RegistrationRequestFilterController',
        ['$scope', '$localStorage',
        'virtoCommerce.marketplaceRegistrationModule.webApi',
        function (
            $scope, $localStorage,
            registrationApi
        ) {
        var blade = $scope.blade;

        blade.statuses = [];

        $scope.applyCriteria = function () {
            angular.copy(blade.currentEntity, blade.origEntity);
            if (blade.isNew) {
                $localStorage.registrationRequestFilters.push(blade.origEntity);
                $localStorage.registrationRequestFilterId = blade.origEntity.id;
                blade.parentBlade.filter.current = blade.origEntity;
                blade.isNew = false;
            }

            initializeBlade(blade.origEntity);
            blade.parentBlade.filter.criteriaChanged();
            // $scope.bladeClose();
        };
        
        $scope.saveChanges = function () {
            $scope.applyCriteria();
        };

        function initializeBlade(data) {
            blade.currentEntity = angular.copy(data);
            blade.origEntity = data;
            blade.isLoading = false;

            blade.title = blade.isNew ? 'marketplaceRegistration.blades.registration-request-filter.title-new' : data.name;
            blade.subtitle = blade.isNew ? 'marketplaceRegistration.blades.registration-request-filter.subtitle-new' : 'marketplaceRegistration.blades.registration-request-filter.subtitle';

            registrationApi.allStates({}, function (data) {
                blade.statuses = data.map(x => x.name);
            });
            
        };

        var formScope;
        $scope.setForm = function (form) { formScope = form; }

        function isDirty() {
            return !angular.equals(blade.currentEntity, blade.origEntity);
        };

        blade.headIcon = 'fa fa-filter';

        blade.toolbarCommands = [
                {
                    name: "core.commands.apply-filter", icon: 'fa fa-filter',
                    executeMethod: function () {
                        $scope.saveChanges();
                    },
                    canExecuteMethod: function () {
                        return formScope && formScope.$valid;
                    }
                },
                {
                    name: "platform.commands.reset", icon: 'fa fa-undo',
                    executeMethod: function () {
                        angular.copy(blade.origEntity, blade.currentEntity);
                    },
                    canExecuteMethod: isDirty
                },
                {
                    name: "platform.commands.delete", icon: 'fas fa-trash-alt',
                    executeMethod: deleteEntry,
                    canExecuteMethod: function () {
                        return !blade.isNew;
                    }
                }];


        function deleteEntry() {
            blade.parentBlade.filter.current = null;
            $localStorage.registrationRequestFilters.splice($localStorage.registrationRequestFilters.indexOf(blade.origEntity), 1);
            delete $localStorage.registrationRequestFilterId;
            blade.parentBlade.refresh();
            $scope.bladeClose();
        }

        // actions on load
        if (blade.isNew) {           
                initializeBlade({ id: new Date().getTime() });
           
        } else {
            initializeBlade(blade.data);
        }
    }]);
