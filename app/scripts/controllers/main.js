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
      TestService.getSomething().then(function(response) { $scope.something = response; });
    },1000);
    
  });
