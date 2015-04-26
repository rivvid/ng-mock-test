'use strict';

// module to assist with adding $httpBackend mocks on the fly
// it first sets up passthrough() on all possible routes
// then allows you to declare specific route mocks
// note - ng-mocks must be customized for this to work
// see 
angular.module('httpBackendMockHelper',['ngMockE2E'])
  .run(function($httpBackend) {
    // set catchall route for passthrough
    angular.forEach(['GET', 'DELETE', 'JSONP', 'HEAD', 'PUT', 'POST', 'PATCH'], function (verb) {
      $httpBackend.when(verb, /.*/).passThrough();
    });
  })
  .service('HttpBackendMockService', function($httpBackend) {
    return {
      addMock: function (method, url, response) {
        $httpBackend.when(method.toUpperCase(), url)
          .respond(function(method, url, data, headers) {
            return response;
          });
      }
    };
  });

angular.module('ngmockTestAppWrapper',['ngmockTestApp','httpBackendMockHelper'])
  .run(function(HttpBackendMockService) {
    HttpBackendMockService.addMock('GET','data.json',[200,{hi:'from mock'}]);
  })
  ;

angular
  .module('ngmockTestApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
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
    };
  });
