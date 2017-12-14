define(['./serviceHelper'], function (serviceHelper) {
    return {
        getCurrentUserFacilitysMonitor: function (cb) {
            $.get(serviceHelper.getPath('getCurrentUserFacilitysMonitor'), function (result) {
                //console.log(result);
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });
        },
        getAllFacilityType: function (cb) {
            $.get(serviceHelper.getPath('getAllFacilityType'), function (result) {
                //console.log(result);
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });
        },
        getAllFacilities: function (cb) {
            var parameter = {
                id: 'getAllFacilities',
                parameter: {
                    pageNumber: 1,
                    pageSize: 100
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
        getDevicesByFacility: function (facility, cb) {
            var parameter = {
                id: 'getDevicesByFacility',
                parameter: {
                    facilityId: facility,
                    pageNumber: 1,
                    pageSize: 100
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
        getMonitorsByDevice: function (device, cb) {
            var parameter = {
                id: 'getMonitorsByDevice',
                parameter: {
                    deviceId: device,
                    pageNumber: 1,
                    pageSize: 100
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
        getDeviceDetailByFacility: function (facilityId, cb) {
            var param = {
                id: 'deviceDetail',
                parameter: {
                    facilityId: facilityId
                }
            };
            $.get(serviceHelper.getPath(param), function (result) {
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });

        },
        getItemFieldByItemTypeId: function (itemTypeId, itemId, cb) {
            var param = {
                id: 'getItemFieldByItemTypeId',
                parameter: {
                    itemTypeId: itemTypeId,
                    itemId: itemId
                }
            };
            $.get(serviceHelper.getPath(param), function (result) {
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });

        },
        getMonitorDetailByDevice: function (itemId, cb) {
            var param = {
                id: 'getMonitorDetailByDevice',
                parameter: {
                    id: itemId
                }
            };
            $.get(serviceHelper.getPath(param), function (result) {
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });

        },
        saveMonitor: function (monitor, cb) {
            var url = serviceHelper.getPath('saveMonitor');
            $.ajax({
                type: 'post', dataType: 'json', url: url, data: monitor, success: function (result) {
                    if (result) {
                        if (!!result.success) {
                            cb(result.data);

                        }
                    }
                }
            })
        },
        getFacilityByTypeName: function (facilityType, url, cb) {
            var parameter = {
                facilityTypeName: facilityType,
                token: serviceHelper.getToken()
            };
            var requireURL = serviceHelper.getBasicPath() + url;
            serviceHelper.getJson(requireURL, parameter, function (result) {
                cb(result);
                return;
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
        getAlarmInfoByFacility: function (facilityId, cb, errorcb) {
            setTimeout(function () {
                cb([]);
            }, 1000);
        },
        getDeviceList: function (cb) {
            var parameter = {
                id: 'getDeviceList',
                parameter: {
                    pageNumber: 1,
                    pageSize: 50
                }
            };
            $.get(serviceHelper.getPath(parameter), function (result) {
                console.log(result);
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });
        },
        getDeviceObject: function (id, cb) {
            var parameter = {
                id: 'getDeviceObject',
                parameter: {
                    id: id
                }
            };
            $.get(serviceHelper.getPath(parameter), function (result) {
                console.log(result);
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });
        },
        getDeviceInfo: function (iotDeviceId, cb) {
            var parameter = {
                id: 'getDeviceInfo',
                parameter: {
                    iotDeviceId: iotDeviceId
                }
            };
            $.get(serviceHelper.getPath(parameter), function (result) {
                console.log(result);
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });
        },
        saveIotDeviceInfo: function (IotData, cb) {
            var parameter = {
                id: 'saveIotDeviceInfo',
                parameter: {
                    pageNumber: 1,
                    pageSize: 50
                }
            };
            var url = serviceHelper.getPath(parameter);
            $.ajax({
                type: 'post', dataType: 'json', url: url, data: IotData, success: function (result) {
                    if (result) {
                        if (!!result.success) {
                            cb(result.data);
                        }
                    }
                }
            })
        },
        sendDataCommand: function (iotDeviceId, commandAddress, commandValue, cb) {
            var parameter = {
                id: 'sendDataCommand',
                parameter: {
                    r: Math.random(),
                    iotDeviceId: iotDeviceId,
                    commandAddress: commandAddress,
                    commandValue: commandValue

                }
            };
            $.get(serviceHelper.getPath(parameter), function (result) {
                console.log(result);
                if (!!result.success) {
                    cb(result.data);
                    return;
                }
                console.log('Error:', result);
            });
        }
    }

});