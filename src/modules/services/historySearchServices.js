define(['./serviceHelper'], function (serviceHelper) {
    return {
        getCarListData:function( cb){//查询车辆列表
            var parameter = {
                id:'getCarList',
                parameter:{
                    truckNum:''
                }
            };
            $.get(serviceHelper.getPath('getCarList'),function(result,errorCb){
                if(!!result){
                    if(!!result.success){
                        cb(result.data);
                    }
                }
                else{
                    errorCb(result);
                }
            });
        },
        getCarHistoryData:function(terminalNum,startDate,endDate,pageNum,cb){//获取车辆历史轨迹分页信息
            var parameter = {
                id:'getCarHistory',
                parameter:{
                    terminalNum:terminalNum,
                    startDate:startDate,
                    endDate:endDate,
                    pageNum:pageNum
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
        },
        getCoordinateData:function(terminalNum,cb){//获取车辆坐标信息(用于画车辆图标)
            var parameter = {
                id:'getCoordinate',
                parameter:{
                    terminalNum:terminalNum
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
        },
        getCarHistoryCountData:function(terminalNum,startDate,endDate,cb){//车辆历史轨迹总数
            var parameter = {
                id:'getCarHistoryCount',
                parameter:{
                    terminalNum:terminalNum,
                    startDate:startDate,
                    endDate:endDate,
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