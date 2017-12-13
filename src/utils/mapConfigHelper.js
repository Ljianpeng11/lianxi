define(['services/mapService'], function (mapService) {
    var centerAndZoom, baseMaps = [],
        tomcatLayers = [],
        customLayers = [],
        facilities = [];
    var analyzeProjectConfig = function (projectConfigs) {
        projectConfigs.forEach(function (projectConfig) {
            if (projectConfig.type == 'Group') {
                analyzeProjectConfig(projectConfig.children);
            } else if (projectConfig.type == 'Layer') {
                if (projectConfig.layer.type == 'TDT' || projectConfig.layer.bizType == 'map') {
                    baseMaps.push(projectConfig);
                }
                else if (projectConfig.layer.type == 'ArcGISRest') {
                    customLayers.push(projectConfig);
                } else if (projectConfig.layer.type == 'TomcatTile') {
                    tomcatLayers.push(projectConfig);
                } else if (projectConfig.layer.type == 'HTTP' && projectConfig.layer.bizType == 'device') {
                    facilities.push(projectConfig);
                }
            }
        })
    };

    return {
        init: function (cb) {
            mapService.getUserProjects(function (projects) {
                var defaultProject = projects[0];//todo 用戶可自定義project
                centerAndZoom = {
                    x: defaultProject.centerX,
                    y: defaultProject.centerY,
                    zoom: defaultProject.zoom
                };
                mapService.getProjectById(defaultProject.id, function (config) {
                    console.log(config);
                    analyzeProjectConfig(config);
                    cb(config);
                })
            });
        },
        getCenterAndZoom: function () {
            return centerAndZoom;
        },
        getFacilityConfig: function () {
            return facilities;
        },
        getTomcatLayerConfig: function () {
            return tomcatLayers;
        },
        getCustomLayerConfig: function () {
            return customLayers;
        },
        getBaseMapConfig: function () {
            return baseMaps;
        }

    }
});