define([
    'modules/arcgisPlugin',
    'modules/appUnknown',
    'modules/appSys/dict',
    'modules/appFacilityManager/facilityType',
    'modules/appFacilityManager/facilityManager',
    'modules/appIotDeviceManager/iotDevice',
    'modules/appIotDeviceManager/iotDeviceType',
    'modules/appIotDeviceManager/iotPlatformDevice',
    'modules/facilityManageGraph',
    'modules/appIotDeviceManager/deviceCommand',
    'modules/appIotDeviceManager/eiotMaintenance',
    'modules/emergencyRescue',
    'modules/appSys/syslog',
    'modules/appIotDeviceManager/monitorUser',
    'modules/auth/userManager',
    'modules/auth/roleManager',
    'modules/auth/menuManager',
    'modules/auth/orgManager',
    'modules/map/layerManager',
    'modules/map/projectManager',
    'modules/map/dataRoleManager',
    'modules/se/serviceRouterManager',
    'modules/se/seServiceManager',
    'modules/se/roleServiceManager',
    'modules/se/serviceLogManager',
    'modules/se/serviceInvokeCountStats',
    'modules/se/serviceUserInvokeCountStats',
    'modules/se/userServiceInvokeCountStats',
    'modules/se/networkEnvironmentManager',
    'modules/se/userServiceManager',
    'modules/se/currentUserServiceManager',
    'modules/emergencyRescue/emergenCommand/dispatcheCenter',
    'modules/appFacilityManager/facilityTypeRoleManager',
    'modules/appFacilityManager/dataRoleFacilityManager',
    'modules/onlineMonitor/statisticsPanel',
    'modules/onlineMonitor/facilityInfoTable',
    'modules/onlineMonitor/dataScreen',
    'modules/onlineMonitor/eLTEVideo',
    'modules/facilitySummary'
], function (
             arcgisPlugin,
             appInterfaceTest,
             dict,
             facilityType,
             facilityManage,
             iotDevice,
             iotDeviceType,
             iotPlatformDevice,
             facilityManageGraph,
             deviceCommand,
             eiotMaintenance,
             emergencyRescue,
             syslog,
             monitorUser,
             userManager,
             roleManager,
             menuManager,
             orgManager,
             layerManager,
             projectManager,
             dataRoleManager,
             serviceRouterManager,
             seServiceManager,
             roleServiceManager,
             serviceLogManager,
             serviceInvokeCountStats,
             serviceUserInvokeCountStats,
             userServiceInvokeCountStats,
             networkEnvironmentManager,
             userServiceManager,
             currentUserServiceManager,
             dispatcheCenter,
             facilityTypeRoleManager,
             dataRoleFacilityManager,
             statisticsPanel,
             facilityInfoTable,
             dataScreen,
             eLTEVideo,
             facilitySummary) {
    return {
        'arcgis-plugin': arcgisPlugin,
        'appInterfaceTest': appInterfaceTest,
        'dict': dict,
        'facilityType': facilityType,
        'facilityManager': facilityManage,
        'iotDevice': iotDevice,
        'iotDeviceType': iotDeviceType,
        'iotPlatformDevice': iotPlatformDevice,
        'facility-manage-graph': facilityManageGraph,
        'deviceCommand': deviceCommand,
        'eiotMaintenance': eiotMaintenance,
        'emergency-rescue': emergencyRescue,
        'syslog': syslog,
        'monitorUser': monitorUser,
        'userManager': userManager,
        'roleManager': roleManager,
        'menuManager': menuManager,
        'orgManager': orgManager,
        'layerManager': layerManager,
        'projectManager': projectManager,
        'dataRoleManager': dataRoleManager,
        'serviceRouterManager': serviceRouterManager,
        'seServiceManager': seServiceManager,
        'roleServiceManager': roleServiceManager,
        'serviceLogManager': serviceLogManager,
        'serviceInvokeCountStats': serviceInvokeCountStats,
        'serviceUserInvokeCountStats': serviceUserInvokeCountStats,
        'userServiceInvokeCountStats': userServiceInvokeCountStats,
        'networkEnvironmentManager': networkEnvironmentManager,
        'userServiceManager': userServiceManager,
        'currentUserServiceManager': currentUserServiceManager,
        'dispatche-center': dispatcheCenter,
        'facilityTypeRoleManager': facilityTypeRoleManager,
        'dataRoleFacilityManager': dataRoleFacilityManager,
        'statisticsPanel':statisticsPanel,
        'facility-info-table':facilityInfoTable,
        'dataScreen':dataScreen,
        'elte-video':eLTEVideo,
        'facility-summary': facilitySummary
    }
});