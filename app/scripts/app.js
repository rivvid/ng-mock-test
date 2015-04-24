'use strict';

angular.module('ngmockTestAppWrapper',['ngmockTestApp','ngMockE2E'])
  .run(function($httpBackend) {
    // $httpBackend.whenGET('data.json')
    //   .respond(function (method, url, data) {
    //     console.log('get json mock');
    //     return [200, JSON.stringify({ from: 'mockBackend' })];
    //   });
    $httpBackend.whenGET(/.*/).passThrough();
  });

angular
  .module('ngmockTestApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          something: function (TestService) {
            return TestService.getSomething();
          }
        }
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .service('TestService', function($http) {
    return {
      getSomething: function () {
        return $http.get('data.json');
      }
    }
  });
