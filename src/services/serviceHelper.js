define(['config'], function (config) {
    var userToken = '';
    var basicUrl = config.basicURL;
    var serviceEndpoint = {
        basicPath: basicUrl,
        login: basicUrl + '/login/loginValid',
        userMenu: basicUrl + '/user/getMenu',
        makeOrder: basicUrl + '/orders/save',
        queryMenu: basicUrl + '/orders/menu',
        queryEmployee: basicUrl + '/employee',
        refreshToken: basicUrl + 'login/updateToken',
        queryOrder: basicUrl + '/orders/query',
        getAllFacilityType: basicUrl + '/facility/getAllFacilitysType',
        getCarList:basicUrl+'/truck/getTruckList',
        getFacilityByType:basicUrl+'/facility/getOneTypeFacilitys',
        getFacilityDetail:basicUrl+'/facility/getOneFacilityInfo',
        getHistoricalDate:basicUrl+'/dataHistory/getDataHistoryByItemId',
        deviceDetail:basicUrl+'/device/getDeviceInfosByFacilityId',
        monitorRealTimeValue:basicUrl+'dataReal/getDataRealByItemIds',
        getCarHistoryCount:basicUrl+'/truck/getTruckHistoryTrackCount',
        getMonitorDetailMsg:basicUrl+'/facility/getOneFacilityInfo',
        getFacilityLists:basicUrl+'/facility/filterFacility',
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
        }
    }
});