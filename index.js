angular.module('index', ['ldiff', 'LLocal']);
angular.module('index').controller('index',
['$scope', 'ldiff', 'LLocal', function($scope, ldiff, LLocal){
    $scope.appName = 'q-diff';
    $scope.input1 = '';
    $scope.input2 = '';
    
    $scope.output = [];
    
    $scope.swap = function(){
        var tmp = $scope.input1;
        $scope.input1 = $scope.input2;
        $scope.input2 = tmp;
    };
    
    $scope.save = function(input){
        LLocal.set('input' + input, $scope['input' + input]);
    };
    
    $scope.load = function(input){
        var x = LLocal.get('input' + input);
        if(x !== undefined)
            $scope['input' + input] = x;
        else $scope['input' + input] = '';
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
    
    $scope.load(1);
    $scope.load(2);
    
    //$scope.swap();
    //$scope.process();
    
    
}]);