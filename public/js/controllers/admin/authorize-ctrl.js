angular.module('AuthorizeCtrl', []).controller('AuthorizeController', function($scope, Authorization, UserInterface) {

  // Initialization

  $scope.user;

  // Actions

  $scope.login = function(){
    Authorization.login($scope.user).then(function(){
      UserInterface.gotoLocation('admin/publish');
    },function(){
      alert("Wrong username / password!");
    });
  };
});
