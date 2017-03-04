angular.module('index', ['ldiff']);
angular.module('index').controller('index',
['$scope', 'ldiff', function($scope, ldiff){
    $scope.appName = 'q-diff';
    $scope.input1 = 'hello';
    $scope.input2 = 'hello\nworld';
    
    $scope.output = [];
    
    $scope.swap = function(){
        var tmp = $scope.input1;
        $scope.input1 = $scope.input2;
        $scope.input2 = tmp;
    };
    
    $scope.process = function(){
        var lines1 = ($scope.input1 + '\n').split('\n');
        var lines2 = ($scope.input2 + '\n').split('\n');
        $scope.output = ldiff(lines1, lines2);
    };
    
    $scope.getLineCSS = function(type){
        var color = 'green';
        if(type == 'del') color = 'red';
        else if(type == 'keep') color = 'white'
        return {'background-color' : color, border: '1px solid pink'};
    };
    //$scope.swap();
    //$scope.process();
    
    
}]);