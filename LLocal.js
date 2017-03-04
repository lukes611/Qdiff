//Local db module
angular.module('LLocal', [])
.factory('LLocal', function(){
    //get a value given key
    var get = function(key){
        if(window.localStorage[key] !== undefined)
            return JSON.parse(window.localStorage[key]);
        return undefined;
    };
    //set a value for a given key
    var set = function(key, value){
        window.localStorage[key] = JSON.stringify(value);
    };
    
    //clear a key value pair given a key
    var clear = function(key){
        window.localStorage.removeItem(key);
    };
    
    var clearAll = function(){
        window.localStorage.clear();
    };
    
    return {
        get : get,
        set : set,
        clear : clear,
        clearAll : clearAll
    };
});
