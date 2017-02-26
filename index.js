
angular.module('LDiff', []);

angular.module('LDiff').controller('LDiff',
['$scope', function($scope){
    $scope.appName = 'q-diff';
    $scope.input1 = 'hi\nthere\nyou are cool';
    $scope.input2 = 'hi\nthere2\nyou are cool';
    
}]);