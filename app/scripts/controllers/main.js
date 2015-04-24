'use strict';

/**
 * @ngdoc function
 * @name ngmockTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngmockTestApp
 */
angular.module('ngmockTestApp')
  .controller('MainCtrl', function ($scope, something) {
    console.info(something);
    $scope.something = something;
  });
