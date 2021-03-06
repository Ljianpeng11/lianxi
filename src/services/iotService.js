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
            })
        },
        getIotDeviceRunningState:function(cb){
            $.get(serviceHelper.getPath('getIotDeviceRunningState'),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
            });
        },
        getIotDeviceOnlineState:function(cb){
            $.get(serviceHelper.getPath('getIotDeviceOnlineState'),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
            });
        },
        getRainFacility:function(cb){
            $.get(serviceHelper.getPath('getRainFacility'),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
            });
        },
        getCurRequestInfo:function(cb){
            $.get(serviceHelper.getPath('getCurRequestInfo'),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
            });
        },
        getCollectionFacilityList:function(cb){
            $.get(serviceHelper.getPath('getCollectionFacilityList'),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
            })
        },
        uploadGpsInfo:function(param,cb){
            var ajaxParam = {
                id: 'uploadGpsInfo',
                parameter: param
            }
            $.get(serviceHelper.getPath(ajaxParam),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
            })
        },
        queryeLTEtrace:function(param,cb){
            var ajaxParam = {
                id: 'queryeLTEtrace',
                parameter: param
            }
            $.get(serviceHelper.getPath(ajaxParam),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
            })
        },
        gainTemperatureData:function(param,cb){
            var ajaxParam = {
                id: 'gainTemperatureData',
                parameter: param
            }
            $.get(serviceHelper.getPath(ajaxParam),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
            })
        }
    }
});