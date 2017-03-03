
angular.module('LDiff', []);

function solveStates(grid){
    console.log(grid);
    //put initial state into a stack
    var stack = [{x:0,y:0,prev:undefined, cost:grid[0][0]}];
    var hash = function(p){return p.x + ':' + p.y;};
    //create history
    var history = {};
    var final = undefined, i;
    
    while(stack.length > 0){//while goal not reached,
        //get current state
        stack.sort((a,b) => a.cost-b.cost);
        var current = stack.shift();
        //if goal: end
        if(current.x == grid.length-1 && current.y == grid.length-1){
            final = current;
            break;
        }
        //for each next state:
        var nextStates = [{x:current.x+1, y:current.y, prev:current}, {x:current.x, y:current.y+1, prev:current},{x:current.x+1, y:current.y+1, prev:current}];
        //if not in history, add and explore
        for(i = 0; i < nextStates.length; i++){
            var ns = nextStates[i];
            if(ns.x >= grid.length || ns.y >= grid.length) continue;
            if(history[hash(ns)] === undefined){
                ns.cost = grid[ns.y][ns.x] + current.cost + 1;
                history[hash(ns)] = true;
                stack.unshift(ns);
            }
        }
    }
    var ret = [];
    while(final != undefined){
        ret.unshift(final);
        final = final.prev;
    }
    ret.forEach(function(x){
        console.log(x.x, x.y);
    });
}


angular.module('LDiff').controller('LDiff',
['$scope', function($scope){
    $scope.appName = 'q-diff';
    $scope.input1 = 'hi\nthere\nyou are cool\nand\ni am\ngreat';
    $scope.input2 = 'hi\nthere2\nyou are cool\nand\ni am\ngreat2\nandFresh\ncucumber';
    $scope.output = [];
    
    var gen2DArray = function(rows, cols, defaultValue){
        defaultValue = defaultValue || 0;
        var ret = Array(rows), i;
        for(i = 0; i < ret.length; i++)
            ret[i] = Array.apply(undefined, Array(cols)).map(x=>defaultValue);
        return ret;
    };
    
    $scope.swap = function(){
        var tmp = $scope.input1;
        $scope.input1 = $scope.input2;
        $scope.input2 = tmp;
    };
    
    $scope.swap();
    
    $scope.process = function(){
        var lines1 = $scope.input1.split('\n');
        var lines2 = $scope.input2.split('\n');
        var output = [];
        /*
            either, lines are same
            or: this line is missing from lines2
            or: this lines1 is missing the line from line2
        */
        var _ = function(l1, l2){
            var output = [];
            if(l1 >= lines1.length && l2 >= lines2.length){
                return { cost : 0, output : output};   
            }else if(l1 >= lines1.length){//l2 has added lines
                //console.log('l2 has added lines');
                while(l2 < lines2.length)
                    output.push({type : 'add', str : lines2[l2++]});
                return { cost : lines2.length - l2, output : output};   
            }else if(l2 >= lines2.length){
                //console.log('l1 has added lines');
                while(l1 < lines1.length)
                    output.push({type : 'keep', str : lines1[l1++]});
                return { cost : lines1.length - l1, output : output};   
            }
            
            var tmp1, tmp2;
            
            if(lines1[l1] == lines2[l2]){
                //console.log(tmp1, 'equal');
                output.push({type : 'same', str : lines1[l1]});
                var ret = _(l1+1, l2+1);
                return {cost : ret.cost, output : output.concat(ret.output) };
            }else{
                //test l1 is missing from l2
                tmp1 = lines1[l1];
                var ret1 = _(l1+1, l2);
                var cost1 = ret1.cost + 1;
                //test l2[0] is missing from l1
                tmp2 = lines2[l2];
                var ret2 = _(l1, l2+1);
                var cost2 = ret2.cost + 1;
                if(cost1 <= cost2){
                    //console.log('c1');
                    output.push({type : 'del', str : tmp1});
                    return {cost : cost1, output : output.concat(ret1.output)};
                }else{
                    //console.log('c2');
                    output.push({type : 'add', str : tmp2});
                    return {cost : cost2, output : output.concat(ret2.output)};
                }
            }
            
        };
        
        output = _(0, 0).output;
        output = output.map(x => {return {type:x.type, str:[x.str]}});
        var tmp = output;
        output = [];
        for(var i =0; i < tmp.length; i++){
            if(output.length == 0 || output[output.length-1].type != tmp[i].type) output.push(tmp[i]);
            else{
                output[output.length-1].str = output[output.length-1].str.concat(tmp[i].str);
            } 
        }
        //console.log(output);
        output.forEach(function(x){
            console.log(x.type + ' : ' + x.str);
        });
        
        
        $scope.output = output;
        
    };
    
    $scope.process2 = function(){
        var lines1 = $scope.input1.split('\n');
        var lines2 = $scope.input2.split('\n');
        var N = Math.max(lines1.length, lines2.length);
        var output = [], i = 0;
        
        var l1 = 0, l2 = 0, lowestScore, index, j;
        var states = gen2DArray(N, N, Number.MAX_VALUE);
        
        /*for each y state
            for each x state
                get smallest dist + my cost -> set output. record output
        */
        var minDist = 0, minIndex = 0, tmp;
        var right, down, diag;
        
        for(l1 = states.length-1; l1 >= 0; l1--){
            for(l2 = states[l1].length-1; l2 >= 0; l2--){
                
                var h1 = l1 < lines1.length;
                var h2 = l2 < lines2.length;
                var eq = h1 && h2 && lines1[l1] == lines2[l2];
                var cc = eq ? 0 : 1;
                
                if(l1 + 1 >= N && l2 + 1 >= N){
                    if(h1 && h2) tmp = 'keep';
                    else if(h1 && !h2) tmp = 'keep';
                    else if(!h1 && h2) tmp = 'add';
                    states[l1][l2] = {cost : cc, next : undefined, op : tmp};
                    continue;
                }
                
                //get old cost and next
                right = (l2 + 1 >= states[l1].length) ? {cost:Number.MAX_VALUE, next:undefined, op:undefined}
                : {cost:states[l1][l2+1].cost + cc, next:states[l1][l2+1], op:'add'};
                down = (l1 + 1 >= states.length) ? {cost:Number.MAX_VALUE, next:undefined, op:undefined}
                : {cost:states[l1+1][l2].cost + cc, next:states[l1+1][l2], op:'del'};
                diag = (l1 + 1 >= states.length || l2 + 1 >= states[l1].length) ? {cost:Number.MAX_VALUE, next:undefined, op:undefined}
                : {cost:states[l1+1][l2+1].cost + cc, next:states[l1+1][l2+1], op:'keep'};
                
                if(eq)
                    states[l1][l2] = diag;
                else if(right.cost < down.cost)
                    states[l1][l2] = right;
                else
                    states[l1][l2] = down;
            }
        }
        
        
        
        
        for(i = 0; i < states.length; i++){
            var out = i + '.: ';
            for(var j = 0; j < states[i].length; j++){
                out += states[i][j].cost + ' . ';
            }
            console.log(out);
        }
        
        var start = states[0][0];
        while(start){
            output.push(start);
            start = start.next;
        }
        
        
        l1 = 0, l2 = 0;
        var ret = [{type:'none'}];
        
        for(i = 0; i < output.length; i++){
            var o = output[i];
            //console.log(o)
            if(o.op == 'del' && l1 < lines1.length){
                console.log('del', lines1[l1]);
                if(ret[ret.length-1].type == 'del')
                    ret[ret.length-1].str.push(lines1[l1]);   
                else ret.push({type:'del', str:[lines1[l1]]});
                l1++;  
            } 
            else if(o.op == 'add' && l2 < lines2.length){ 
                console.log('add', lines2[l2]);
                if(ret[ret.length-1].type == 'add')
                    ret[ret.length-1].str.push(lines2[l2]);   
                else ret.push({type:'add', str:[lines2[l2]]});
                l2++;
            }
            else{
                var l = l1 < lines1.length ? lines1[l1] : lines2[l2];
                if(l != undefined){
                    if(ret[ret.length-1].type == 'keep')
                        ret[ret.length-1].str.push(l);   
                    else ret.push({type:'keep', str:[l]});
                    console.log('keep', l);
                }
                l1++;l2++;
            } 
        }
        ret.shift();
        $scope.output = ret;
        ret.forEach(x => console.log(x));
        //solveStates(states);
    };
    
    $scope.getLineCSS = function(type){
        var color = 'green';
        if(type == 'del') color = 'red';
        else if(type == 'keep') color = 'white'
        return {'background-color' : color, border: '1px solid pink'};
    };

    
    //$scope.process2();
    
}]);