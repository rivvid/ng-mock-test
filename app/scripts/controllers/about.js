'use strict';

/**
 * @ngdoc function
 * @name ngmockTestApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ngmockTestApp
 */
angular.module('ngmockTestApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
