define(['./serviceHelper'], function (serviceHelper) {
    return {
        geIotFacilityInfo: function (parameter,cb) {
            var ajaxParam = {
                id: 'iotFacilityInfo',
                parameter: parameter
            }
            $.get(serviceHelper.getPath(ajaxParam), function (result) {
                //console.log(result);
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });
        },
        collectFacilities:function(facilityId,cb){
            var param = {
                id:'collectFacilities',
                parameter:{
                    facilityId:facilityId
                }
            }
            $.get(serviceHelper.getPath(param),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            })
        },
        getIotDeviceRunningState:function(cb){
            $.get(serviceHelper.getPath('getIotDeviceRunningState'),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
            });
            console.log('Error:', result);
        },
        getIotDeviceOnlineState:function(cb){
            $.get(serviceHelper.getPath('getIotDeviceOnlineState'),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
            });
            console.log('Error:', result);
        },
        getRainFacility:function(cb){
            $.get(serviceHelper.getPath('getRainFacility'),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
            });
            console.log('Error:', result);
        },
        getCurRequestInfo:function(cb){
            $.get(serviceHelper.getPath('getCurRequestInfo'),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
            });
        }
    }
});