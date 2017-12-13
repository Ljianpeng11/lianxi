define(function () {
    var facilityTypeObjs = {}


    return {
        getFacilityByTypeName: function (facilityByTypeName) {
            return facilityTypeObjs[facilityByTypeName];
        },
        getAllFacilityTypes: function () {
            var keys = [];
            for (var key in facilityTypeObjs) {
                keys.push(key);
            }
            return keys;
        },
        addFacility: function (facilityConfig, subFacilities) {
            facilityTypeObjs[facilityConfig.facilityTypeName] = facilityConfig;
            facilityTypeObjs[facilityConfig.facilityTypeName].facilities = subFacilities;
        }
    }
});