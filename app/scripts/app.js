'use strict';

// module to assist with adding $httpBackend mocks on the fly
// it first sets up passthrough() on all possible routes
// then allows you to declare specific route mocks
// note - ng-mocks must be customized for this to work
// see fork of ng-mocks at git@github.com:rivvid/bower-angular-mocks.git
angular.module('httpBackendMockHelper',['ngMockE2E','ui.router'])
  .run(function($httpBackend) {
    // set catchall route for passthrough
    angular.forEach(['GET', 'DELETE', 'JSONP', 'HEAD', 'PUT', 'POST', 'PATCH'], function (verb) {
      $httpBackend.when(verb, /.*/).passThrough();
    });
  })
  .service('HttpBackendMockService', function($httpBackend, $urlMatcherFactory) {
    return {
      addMock: function (method, url, response) {
        var um = $urlMatcherFactory.compile(url, {});
        $httpBackend.when(method.toUpperCase(), um.regexp)
          .respond(function(method, url, data, headers) {
            return response;
          });
      }
    };
  });

angular.module('ngmockTestAppWrapper',['ngmockTestApp','httpBackendMockHelper'])
  .run(function(HttpBackendMockService) {
    HttpBackendMockService.addMock('GET','data.json',[200,{hi:'from mock'}]);
    HttpBackendMockService.addMock('GET','/api/v1/:dbid/foo',[200,{foo:'bar baz'}]);
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
      get: function (url) {
        return $http.get(url);
      }
    };
  });
