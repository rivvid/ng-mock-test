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
    // patch regex maker, pulled from ng-route:
    // https://github.com/angular/angular.js/blob/master/src/ngRoute/route.js#L194
    function pathRegExp(path, opts) {
      var insensitive = false,
          ret = {
            originalPath: path,
            regexp: path
          },
          keys = ret.keys = [];

      path = path
        .replace(/([().])/g, '\\$1')
        .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option) {
          var optional = option === '?' ? option : null;
          var star = option === '*' ? option : null;
          keys.push({ name: key, optional: !!optional });
          slash = slash || '';
          return ''
            + (optional ? '' : slash)
            + '(?:'
            + (optional ? slash : '')
            + (star && '(.+?)' || '([^/]+)')
            + (optional || '')
            + ')'
            + (optional || '');
        })
        .replace(/([\/$\*])/g, '\\$1');

      ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
      return ret;
    }

    return {
      addMock: function (method, url, response) {
        var r = pathRegExp(url).regexp;
        $httpBackend.when(method.toUpperCase(), r)
          .respond(function(method, url, data, headers) {
            return response;
          });
      }
    };

  });

angular.module('ngmockTestAppWrapper',['ngmockTestApp','httpBackendMockHelper'])
  .run(function(HttpBackendMockService) {
    HttpBackendMockService.addMock('GET','data.json',[200,{hi:'from mock'}]);
    HttpBackendMockService.addMock('GET','/api/v1/:dbid/foo',[200,{foo:'bar'}]);
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
