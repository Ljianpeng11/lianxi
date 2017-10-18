define(['./serviceHelper'], function (serviceHelper) {
    return {
        getAllFacility: function (cb) {
            $.get(serviceHelper.getPath('getAllFacilityType'), function (result) {
                console.log(result);
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });
        },
        getDeviceDetailByFacility: function (facilityId, cb) {
            var param = {
                id:'deviceDetail',
                parameter:{
                    facilityId:facilityId
                }
            };
            $.get(serviceHelper.getPath(param),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                }
                console.log('Error:',result);
            });

        },
        getFacilityByType: function (facilityType, cb) {
            var parameter = {
                id: 'getFacilityByType',
                parameter: {
                    facilityType: facilityType
                }
            }
            $.get(serviceHelper.getPath(parameter), function (result) {
                console.log(result);
                if (!!result.success) {
                    cb(result.data);
                    console.log('get data getFacilityByType');
                    return;
                }
                console.log('Error:', result);
            });
        },
        getFacilityLists:function (address,pollutionSource,dataSource,district,cb) {
            var parameter = {
                id: 'getFacilityLists',
                parameter: {
                    address: address,
                    pollutionSource:pollutionSource,
                    dataSource:dataSource,
                    district:district
                }
            }
            $.get(serviceHelper.getPath(parameter), function (result) {
                console.log(result);
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });
        },
        getFacilityDetail: function (facilityId, cb) {
            var parameter = {
                id: 'getFacilityDetail',
                parameter: {
                    facilityId: facilityId
                }
            }
            $.get(serviceHelper.getPath(parameter), function (result) {
                console.log(result);
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });
        },
        getMonitorDetailMsg:function (facilityId,cb) {
            var parameter = {
                id: 'getMonitorDetailMsg',
                parameter: {
                    facilityId: facilityId
                }
            }
            $.get(serviceHelper.getPath(parameter), function (result) {
                console.log(result);
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });
        },
        getAlarmInfoByFacility: function (facilityId, cb, errorcb) {
            setTimeout(function () {
                cb([]);
            }, 1000);
        }
    }

});