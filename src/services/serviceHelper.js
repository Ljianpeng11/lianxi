define(['config'], function (config) {
    var userToken = '';
    var basicUrl = config.basicURL;
    var serviceEndpoint = {
        basicPath: basicUrl,
        login: basicUrl + '/login/loginValid',
        userRole: basicUrl + '/user/getRole',
        userMenu: basicUrl + '/user/getMenu',
        getAllFacilityType: basicUrl + '/facility/getAllFacilitysType',
        deviceDetail: basicUrl + '/device/getDeviceInfosByFacilityId',
        makeOrder: basicUrl + '/orders/save',
        queryMenu: basicUrl + '/orders/menu',
        queryEmployee: basicUrl + '/employee',
        refreshToken: basicUrl + '/login/updateToken',
        monitorRealTimeValue:basicUrl+'/dataReal/getDataRealByItemIds',
        getHistoricalDate:basicUrl+'/dataHistory/getDataHistoryByItemId',
        getFacilityByType:basicUrl+'/facility/getOneTypeFacilitys',
        getAllFeatures: basicUrl + '/feature/getFeatureByCurrentUser',
        getFeatureDetail: basicUrl + '/feature/getFeatureById',
        addFeature: basicUrl + '/feature/addEditFeature',
        deleteFeature: basicUrl +  '/feature/deleteFeatureById',
        updateBuilding: basicUrl +  '/drainageFamily/addEditDrainageFamily',
        addSetUpPipe: basicUrl +  '/pipePoint/addSetUpPipe',
        addPipePoint: basicUrl +  '/pipePoint/addPipePoint',
        addPreFacilities: basicUrl +  '/pipePoint/addPreFacilities',
        formatLocation: basicUrl +  '/coordTrans/wgs84ToGz',
        uploadFile: basicUrl +  '/uploadFile/uploadFileByBase64',
        addPipeLine:basicUrl+'/pipeLine/addPipeLine',
        getUploadFile:basicUrl+'/uploadFile/getUploadFilesByBizId',
        downloadFile:basicUrl+'/uploadFile/downloadFileById',
        getUserRoleList:basicUrl+'/role/list',
        getUserByRoleId:basicUrl+'/user/getUserByRoleId',
        listUserByRole:basicUrl+'/app/listUserByRole',
        removeAuthUser:basicUrl+'/user/removeAuthUser',
        authUser:basicUrl+'/user/authUser',
        getMonitorDetail:basicUrl+'/psJkDataHis/getItemDimHistoryData',
        getMonitorPoint:basicUrl+'/agsupport_nn/rest/pscomb/getStationByCoordinate',
        queryFacilityByArea:basicUrl+'/pipeAnalyze/boxSelectStatistics',
        queryOrder: basicUrl + '/orders/query',
        getAllFacilityType: basicUrl + '/facility/getAllFacilitysType',
        getCarList:basicUrl+'/truck/getTruckList',
        getFacilityByType:basicUrl+'/facility/getOneTypeFacilitys',
        getFacilityDetail:basicUrl+'/facility/getOneFacilityInfo',
        deviceDetail:basicUrl+'/device/getDeviceInfosByFacilityId',
        getCarHistoryCount:basicUrl+'/truck/getTruckHistoryTrackCount',
        getDeviceList:basicUrl+'/iotDevice/list',
        getDeviceObject:basicUrl+'/iotDevice/get',
        getDeviceInfo:basicUrl+'/iotDevice/getDeviceInfo',
        getAllFacilities:basicUrl+'/facility/list',
        getDevicesByFacility:basicUrl+'/device/list',
        getMonitorsByDevice:basicUrl+'/item/list',
        getMonitorDetailByDevice:basicUrl+'/item/get',
        saveMonitor:basicUrl+'/item/save',
        getItemFieldByItemTypeId:basicUrl+'/itemType/getItemFieldByItemTypeId',
        saveIotDeviceInfo:basicUrl+'/iotDevice/save',
        sendDataCommand:basicUrl+'/iotDevice/registerSendDataCommand'
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
        getPicUrl: function (picId){
            return basicUrl + '/uploadFile/downloadFileById?id='+picId+'&token='+userToken;
        }
    }
});