define(['./serviceHelper'], function (serviceHelper) {
    return {
        getHistoricalData:function(itemIds, start, end, cb){
            var parameter = {
                id:'dataHistory',
                parameter:{
                    itemId:JSON.stringify(itemIds),
                    dateStart:start,
                    dateEnd:end
                }
            };
            $.get(serviceHelper.getPath(parameter),function(result,errorCb){
                if(!!result){
                    if(!!result.success){
                        cb(result.data);
                    }
                }
                else{
                    errorCb(result);
                }
            });
        }

    }
});