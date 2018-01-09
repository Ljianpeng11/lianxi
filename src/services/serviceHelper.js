define(['config'], function (config) {
    var userToken = '';
    var basicUrl = config.basicURL;
    var serviceEndpoint = {
        basicPath: basicUrl,
        login: basicUrl + '/login/loginValid',
        userMenu: basicUrl + '/sysUser/getUserMenu',
        makeOrder: basicUrl + '/orders/save',
        queryMenu: basicUrl + '/orders/menu',
        queryEmployee: basicUrl + '/employee',
        refreshToken: basicUrl + '/login/updateToken',
        queryOrder: basicUrl + '/orders/query',
        getAllFacilityType: basicUrl + '/facility/getAllFacilitysType',
        getCurrentUserFacilitysMonitor: basicUrl + '/facility/getCurrentUserFacilitysMonitor',
        getCarList: basicUrl + '/truck/getTruckList',
        getFacilityByType: basicUrl + '/dataRoleFacilityRlt/getFacilityByFacilityTypeName',
        getFacilityDetail: basicUrl + '/facility/getOneFacilityInfo',
        getHistoricalDate: basicUrl + '/dataHistory/getDataHistoryByItemId',
        deviceDetail: basicUrl + '/device/getDeviceInfosByFacilityId',
        monitorRealTimeValue: basicUrl + '/dataReal/getDataRealByItemIds',
        getProjects: basicUrl + '/project/getUserProjects',
        getProjectById: basicUrl + '/project/getUserProjectLayers',
        getCarHistoryCount: basicUrl + '/truck/getTruckHistoryTrackCount',
        getDeviceList: basicUrl + '/iotDevice/list',
        getDeviceObject: basicUrl + '/iotDevice/get',
        getDeviceInfo: basicUrl + '/iotDevice/getDeviceInfo',
        getAllFacilities: basicUrl + '/facility/list',
        getDevicesByFacility: basicUrl + '/device/list',
        getMonitorsByDevice: basicUrl + '/item/list',
        getMonitorDetailByDevice: basicUrl + '/item/get',
        saveMonitor: basicUrl + '/item/save',
        getItemFieldByItemTypeId: basicUrl + '/itemType/getItemFieldByItemTypeId',
        saveIotDeviceInfo: basicUrl + '/iotDevice/save',
        sendDataCommand: basicUrl + '/iotDevice/registerSendDataCommand',
        iotFacilityInfo: basicUrl + '/iotDevice/InfoList',
        getIotDeviceRunningState:basicUrl + '/iotDevice/iotDeviceRunningState',
        getIotDeviceOnlineState:basicUrl + '/iotDevice/iotDeviceOnlineState',
        getRainFacility:basicUrl + '/iotDevice/getRainFacility',
        getCurRequestInfo:basicUrl + '/elteVideo/getRequestInfo',
        uploadGpsInfo:basicUrl + '/elteVideo/uploadGpsInfo',
        queryeLTEtrace:basicUrl + '/elteVideo/queryGpsInfo',
        collectFacilities:basicUrl + '/userFacilityCollection/updateUserFacilityCollection',
        getCollectionFacilityList:basicUrl + '/facility/getCollectionFacilityList'
    }
    return {
        setToken: function (token) {
            userToken = token;
        },
        getToken: function () {
            return userToken;
        },
        getBasicPath: function () {
            return serviceEndpoint['basicPath'];
        },
        //获取ajax请求默认参数（所有ajax请求都必须有的参数）
        getDefaultAjaxParam: function () {
            var formData = {};
            //token登录用
            formData.token = this.getToken();
            //随机数，防止缓存
            formData.r = Math.random();

            return formData;
        },
        //get请求，获取json格式
        //请求结果格式要求按ewater标准
        getJson: function (url, formData, successHandler, errorHandler) {
            //对jquery的ajax进行封装，主要为了精简代码，业务功能有需要可以用jquery原版的
            $.ajax({
                type: "get",
                dataType: "json",
                url: url,
                data: formData,
                success: function (ajaxResult) {
                    //请求结果格式要求按ewater标准
                    if (ajaxResult) {
                        if (ajaxResult.success === true) {
                            var result = ajaxResult.data;

                            if (successHandler) {
                                successHandler(result);
                            }
                        } else {
                            //后台操作失败的代码
                            alert(ajaxResult.msg);
                            if (!!errorHandler) {
                                errorHandler(ajaxResult);
                            }
                        }
                    }
                }.bind(this)
            });
        },
        //post请求，获取json格式
        //请求结果格式要求按ewater标准
        postJson: function (url, formData, successHandler) {
            //对jquery的ajax进行封装，主要为了精简代码，业务功能有需要可以用jquery原版的
            $.ajax({
                type: "post",
                dataType: "json",
                url: url,
                data: formData,
                success: function (ajaxResult) {
                    //请求结果格式要求按ewater标准
                    if (ajaxResult) {
                        if (ajaxResult.success === true) {
                            var result = ajaxResult.data;

                            if (successHandler) {
                                successHandler(result);
                            }
                        } else {
                            //后台操作失败的代码
                            alert(ajaxResult.msg);
                        }
                    }
                }.bind(this)
            });
        },
        getPath: function (connectionObj) {
            var url;
            if (!(connectionObj instanceof Object) && !!serviceEndpoint[connectionObj]) {
                url = serviceEndpoint[connectionObj];
            }
            else {
                url = serviceEndpoint[connectionObj.id];
            }
            if (!url) {
                console.log('ERROR:Cant get the url with id:', connectionObj.id);
                return serviceEndpoint.basicUrl;
            }
            if (!!userToken) {
                url += '?token=' + userToken;
            }
            if (!!connectionObj.parameter) {
                var parameters = connectionObj.parameter;
                var parameterURL = !!userToken ? '&' : '?';
                for (var key in parameters) {
                    parameterURL += key + '=' + parameters[key] + '&';
                }
                return encodeURI(url + parameterURL.substring(0, parameterURL.length - 1));
            }
            return url;
        },
        getPicUrl: function (picId) {
            return basicUrl + '/uploadFile/downloadFileById?id=' + picId + '&token=' + userToken;
        }
    }
});