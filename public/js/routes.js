angular.module('Routes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  // Admin
  .when('/admin/authorize', {
    templateUrl: '../views/admin/authorize.html',
    controller: 'AuthorizeController'
  })
  .when('/admin/publish', {
    templateUrl: '../views/admin/publish.html',
    controller: 'PublishController'
  })
  // Home
  .when('/', {
    templateUrl: '../views/home.html',
    controller: 'HomeController'
  })
  .when('/home', {
    templateUrl: '../views/home.html',
    controller: 'HomeController'
  })
  // Activities
  .when('/feed', {
    templateUrl: '../views/feed/feed.html',
    controller: 'FeedController'
  })
  .when('/feed/view/:id', {
    templateUrl: '../views/view.html',
    controller: 'ViewController'
  })
  // Projects
  .when('/projects', {
    templateUrl: '../views/projects/projects.html',
    controller: 'ProjectsController'
  })
  .when('/projects/type/:type', {
    templateUrl: '../views/projects/type.html',
    controller: 'TypeController'
  })
  .when('/projects/view/:id', {
    templateUrl: '../views/view.html',
    controller: 'ViewController'
  })
  // About
  .when('/about', {
    templateUrl: '../views/about.html',
    controller: 'AboutController'
  })
  // Contact
  .when('/contact', {
    templateUrl: '../views/contact.html',
    controller: 'ContactController'
  })
  // Not found
  .when('/404', {
    templateUrl: '../views/404.html'
  })
  // Otherwise
  .otherwise({
    redirectTo: '/404',
  })

  $locationProvider.html5Mode(true);
}]);
