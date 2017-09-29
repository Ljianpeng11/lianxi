var mapHelper = require('utils/mapHelper');
define(function(){
    return{
        createPoints:function(map,facilitys,legend){
            debugger;
            var apiInstance = mapHelper.getInstance();
            apiInstance.createGraphicsLayer(map,facilitys.id);
        }
    }
});