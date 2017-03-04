angular.module('ldiff', []);
angular.module('ldiff').factory('ldiff', function(){
    
    var gen2DArray = function(rows, cols, defaultValue){
        defaultValue = defaultValue || 0;
        var ret = Array(rows), i;
        for(i = 0; i < ret.length; i++)
            ret[i] = Array.apply(undefined, Array(cols)).map(x=>defaultValue);
        return ret;
    };
    
    
    return function(lines1, lines2){
        var N = Math.max(lines1.length, lines2.length);
        var output = [], i = 0;
        
        var l1 = 0, l2 = 0, index, j;
        var states = gen2DArray(N, N, Number.MAX_VALUE);
        var right, down, diag, tmp;
        
        //console.log(N);
        
        for(l1 = N-1; l1 >= 0; l1--){
            for(l2 = N-1; l2 >= 0; l2--){
                
                var h1 = l1 < lines1.length;
                var h2 = l2 < lines2.length;
                var eq = h1 && h2 && lines1[l1] == lines2[l2];
                var cc = eq ? 0 : 1;
                
                if(l1 + 1 >= N && l2 + 1 >= N){ //bottom corner
                    //console.log('pre', h1, h2, lines1, lines2);
                    if(h1 && h2 && eq) tmp = 'keep';
                    else if(h1 && !h2) tmp = 'del';
                    else if(!h1 && h2) tmp = 'add';
                    states[l1][l2] = {cost : cc, next : undefined, op : tmp};
                    continue;
                }
                var dflt = {cost:Number.MAX_VALUE, next:undefined, op:undefined};
                
                //get old cost and next
                right = (l2 + 1 >= N) ? dflt
                : {cost:states[l1][l2+1].cost + cc, next:states[l1][l2+1], op:'add'};
                down = (l1 + 1 >= N) ? dflt
                : {cost:states[l1+1][l2].cost + cc, next:states[l1+1][l2], op:'del'};
                diag = (l1 + 1 >= N || l2 + 1 >= N) ? dflt
                : {cost:states[l1+1][l2+1].cost + cc, next:states[l1+1][l2+1], op:'keep'};
                
                
                
                if(eq)
                    states[l1][l2] = diag;
                else if(right.cost < down.cost)
                    states[l1][l2] = right;
                else
                    states[l1][l2] = down;
            }
        }
        
        /*for(i = 0; i < states.length; i++){
            var out = i + '.: ';
            for(var j = 0; j < states[i].length; j++){
                out += states[i][j].cost + ' . ';
            }
            console.log(out);
        }*/
        
        var start = states[0][0];
        while(start){
            output.push(start);
            start = start.next;
        }
        
        //output.forEach(x => console.log('? ',x));
        
        l1 = 0, l2 = 0;
        var ret = [{type:'none'}];
        
        for(i = 0; i < output.length; i++){
            var o = output[i];
            var h1 = l1 < lines1.length;
            var h2 = l2 < lines2.length;
            var ln1 = lines1[l1];
            var ln2 = lines2[l2];
            var prev = ret[ret.length-1];
            if(o.op == 'del'){
                if(prev.type == 'del' && h1)
                    prev.lines.push({line:ln1, number:l1, from:0});   
                else if(h1) ret.push({type:'del', lines:[{line:ln1, number: l1, from : 0}]});
                l1++;  
            }else if(o.op == 'add'){ 
                if(prev.type == 'add')
                    prev.lines.push({line:ln2, number:l2, from : 1});   
                else ret.push({type:'add', lines:[{line:ln2, number:l2, from:1}]});
                l2++;
            }else{
                var l = h1 ? ln1 : ln2;
                var ln = h1 ? l1 : l2;
                var from = h1 ? 0 : 1;
                
                if(!h1 || !h2){
                    console.log('hickup: ', o);
                    console.log(l1, l2);
                }
                
                if(l != undefined){
                    if(prev.type == 'keep')
                        prev.lines.push({line:l, number:ln, from:from});   
                    else ret.push({type:'keep', lines:[{line:l, number:ln, from:from}]});
                    //console.log('keep', l);
                }
                l1++;l2++;
            } 
        }
        ret.shift();
        return ret;
    };
});