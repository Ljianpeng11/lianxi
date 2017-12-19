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
        }
    }
});