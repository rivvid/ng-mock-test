'use strict';

/**
 * @ngdoc function
 * @name ngmockTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngmockTestApp
 */
angular.module('ngmockTestApp')
  .controller('MainCtrl', function ($scope, TestService) {
    setTimeout(function () {
      TestService.get('data.json').then(function(response) { $scope.something = response; });
      TestService.get('/api/v1/:dbid/foo').then(function(response) { $scope.foo = response; });
    },1000);
    
  });
