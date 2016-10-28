/**
 * This file contains all necessary Angular controller definitions for 'frontend.admin.login-history' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function() {
  'use strict';

  angular.module('frontend.admin.apis')
    .controller('AddApiPluginController', [
        '_','$scope','$rootScope',
        '$log','MessageService','KongPluginsService',
        'AddPluginHandler',
        '$uibModalInstance','_api','_plugin','_schema',
      function controller(_,$scope,$rootScope,
                          $log,MessageService,KongPluginsService,
                          AddPluginHandler,
                          $uibModalInstance,_api,_plugin,_schema) {

          $scope.plugin = {
              name : _plugin,
              options : new KongPluginsService().pluginOptions(_plugin)

          }

          $scope.description = $scope.plugin.options.meta ? $scope.plugin.options.meta.description : 'Configure the Plugin according to your specifications and add it to the API'

          $scope.api = _api
          $scope.close = function() {
              $uibModalInstance.dismiss()
          }

          $scope.filterMeta = function(items) {
              var result = {};

              angular.forEach(items, function(value, key) {
                  if (key !== 'meta') {
                      result[key] = value;
                  }
              });

              return result;
          }

          $scope.filterOutMeta = function(item) {
              //return Object.keys(item).indexOf('meta') < 0
              console.log(item)
              return true
          }

          $scope.addPlugin = function() {

              $log.debug($scope.plugin.config)


              $scope.busy = true;

              var data = AddPluginHandler.makeData($scope.plugin);

              AddPluginHandler.add(
                  _api.id,data,
                  function success(resp){
                      $scope.busy = false;
                      $rootScope.$broadcast('plugin.added')
                      MessageService.success('"' + $scope.plugin.name + '" plugin added successfully!')
                      $uibModalInstance.dismiss()
                  },function(err){
                      $log.error(err)
                      $scope.busy = false;
                      $scope.errors = err.data.customMessage || {}
                  },function evt(evt){
                      // Only used for ssl plugin certs upload
                      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                      $log.debug('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                  })
          }
      }
    ])
  ;
}());
