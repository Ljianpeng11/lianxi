define([ 'services/iotService'], function ( iotService) {
    return {
        geIotFacilityInfo: function (cb) {
            var param = {
                pageNumber: 1,
                pageSize: 20
            }
            iotService.geIotFacilityInfo(param,function (data) {
                cb(data);
            });
        },
        collectFacilities:function(item,cb){
            iotService.collectFacilities(item,function(data){
                cb(data);
            });
        },
        getIotDeviceRunningState:function(cb){
            iotService.getIotDeviceRunningState(function(data){
                cb(data);
            })
        },
        getIotDeviceOnlineState:function(cb){
            iotService.getIotDeviceOnlineState(function(data){
                cb(data);
            })
        },
        getRainFacility:function(cb){
            iotService.getRainFacility(function(data){
                cb(data);
            })
        },
        getCurRequestInfo:function(cb){
            iotService.getCurRequestInfo(function(data){
                cb(data);
            });
        },
        getCollectionFacilityList:function(cb){
            iotService.getCollectionFacilityList(function(data){
                cb(data);
            })
        },
        uploadGpsInfo:function(param,cb){
            iotService.uploadGpsInfo(param,function(data){
                cb(data);
            });
        },
        queryeLTEtrace:function(param,cb){
            iotService.queryeLTEtrace(param,function(data){
                cb(data);
            });
        },
        gainTemperatureData:function(param,cb){
            iotService.gainTemperatureData(param,function(data){
                cb(data);
            });
        }
    }
});