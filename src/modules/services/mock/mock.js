define(function () {
    return {
        facilities: [
            {
                "facilityTypeName": "RF",
                "facilityTypeNameCn": "雨量站",
                "name": "雨量站",
                "facilitys": [
                    {
                        "name": "火炉山视频点",
                        "icon": "",
                        "x": 113.38227299438478,
                        "y": 23.187853103205285,
                        "id": 35
                    },
                    {
                        "name": "天远路视频点",
                        "icon": "",
                        "x": 113.3755782006836,
                        "y": 23.12227845720919,
                        "id": 40
                    },
                    {
                        "name": "新村北路视频点",
                        "icon": "",
                        "x": 113.403984,
                        "y": 23.170845,
                        "id": 41
                    },
                    {
                        "name": "钟楼村视频点",
                        "icon": "",
                        "x": 113.43,
                        "y": 23.006845,
                        "id": 42
                    },
                    {
                        "name": "新田村委视频点",
                        "icon": "",
                        "x": 113.4960844873047,
                        "y": 23.047262435480675,
                        "id": 43
                    },
                    {
                        "name": "七星水库视频点",
                        "icon": "",
                        "x": 113.133984,
                        "y": 23.076845,
                        "id": 44
                    },
                    {
                        "name": "东沙街视频点",
                        "icon": "",
                        "x": 113.33984,
                        "y": 23.076845,
                        "id": 45
                    },
                    {
                        "name": "大夫田村视频点",
                        "icon": "",
                        "x": 113.31984,
                        "y": 23.04,
                        "id": 46
                    },
                    {
                        "name": "城郊小学视频点",
                        "icon": "",
                        "x": 113.833984,
                        "y": 23.176845,
                        "id": 47
                    }
                ]
            },
            {
                "facilityTypeName": "RV",
                "facilityTypeNameCn": "窨井",
                "name": "窨井",
                "facilitys": [
                    {
                        "name": "岭南视频点",
                        "icon": "",
                        "x": 113.42536,
                        "y": 23.176147,
                        "id": 36
                    },
                    {
                        "name": "天寿路视频点",
                        "icon": "",
                        "x": 113.42536,
                        "y": 23.116147,
                        "id": 50,
                        type:'warn'
                    },
                    {
                        "name": "员村视频点",
                        "icon": "",
                        "x": 113.43325642333986,
                        "y": 23.13755631975802,
                        "id": 51
                    },
                    {
                        "name": "民主直街视频点",
                        "icon": "",
                        "x": 113.92536,
                        "y": 23.116147,
                        "id": 52
                    },
                    {
                        "name": "茅岗视频点",
                        "icon": "",
                        "x": 113.6,
                        "y": 23.116147,
                        "id": 53
                    },
                    {
                        "name": "开发大道视频点",
                        "icon": "",
                        "x": 113.21,
                        "y": 23.116147,
                        "id": 54
                    },
                    {
                        "name": "建阳路视频点",
                        "icon": "",
                        "x": 113.42536,
                        "y": 23.78,
                        "id": 55
                    },
                    {
                        "name": "大南路视频点",
                        "icon": "",
                        "x": 113.29489735351564,
                        "y": 23.128629928156457,
                        "id": 56
                    },
                    {
                        "name": "江燕路视频点",
                        "icon": "",
                        "x": 113.26468495117189,
                        "y": 23.185621505304894,
                        "id": 57
                    }
                ]
            },
            {
                "facilityTypeName": "RC",
                "facilityTypeNameCn": "河道",
                "name": "河道",
                "facilitys": [
                    {
                        "name": "思成视频点",
                        "icon": "",
                        "x": 113.3477690576172,
                        "y": 23.1803,
                        "id": 37
                    },
                    {
                        "name": "珠江视频点",
                        "icon": "",
                        "x": 113.42536,
                        "y": 23.0803,
                        "id": 60,
                        type:'warn'
                    },
                    {
                        "name": "车陂视频点",
                        "icon": "",
                        "x": 113.34124592529297,
                        "y": 23.11146379046114,
                        "id": 61
                    },
                    {
                        "name": "开发大道视频点",
                        "icon": "",
                        "x": 113.12536,
                        "y": 23.2803,
                        "id": 62,
                        type:'warn'
                    },
                    {
                        "name": "猎德视频点",
                        "icon": "",
                        "x": 113.12536,
                        "y": 23.1803,
                        "id": 63
                    },
                    {
                        "name": "童心路视频点",
                        "icon": "",
                        "x": 113.5536,
                        "y": 23.1803,
                        "id": 64,
                        type:'warn'
                    },
                    {
                        "name": "天源路视频点",
                        "icon": "",
                        "x": 113.46758869873047,
                        "y": 23.085199599787313,
                        "id": 65,
                        type:'warn'
                    }
                ]
            }
        ],
        rfDevices: [
            {
                "name": "雨量计",
                "deviceTypeName": "RF_pluviometer",
                "items": [
                    {
                        "itemID": "YLJ",
                        "name": "雨量",
                        "itemTypeName": "RF_pluviometer_rainfall"
                    }
                ]
            }],
        rvDevices: [
            {
                "name": "液位仪",
                "deviceTypeName": "RV_levelMeter",
                "items": [
                    {
                        "itemID": "waterLevel_CSB",
                        "name": "水位",
                        "itemTypeName": "RV_levelMeter_waterLevel",
                        "alarmHeight": "1"
                    }
                ]
            },
            {
                "name": "水质监测仪",
                "deviceTypeName": "RV_waterQualityMonitor",
                "items": [
                    {
                        "itemID": "RV_WQM_waterTemperature",
                        "name": "水温",
                        "itemTypeName": "RV_WQM_waterTemperature",
                        "unit":"°C"
                    },
                    {
                        "itemID": "RV_WQM_ph",
                        "name": "PH值",
                        "itemTypeName": "RV_WQM_ph",
                        "unit":""
                    },
                    {
                        "itemID": "RV_WQM_dissolvedOxygen",
                        "name": "溶解氧",
                        "itemTypeName": "RV_WQM_dissolvedOxygen",
                        "unit":"mg/L"
                    },
                    {
                        "itemID": "RV_WQM_permanganateIndex",
                        "name": "高锰酸盐指数",
                        "itemTypeName": "RV_WQM_permanganateIndex",
                        "unit":"mg/L"
                    },
                    {
                        "itemID": "RV_WQM_chemicalOxygenDemand",
                        "name": "化学需氧量",
                        "itemTypeName": "RV_WQM_permanganateIndex",
                        "unit":"mg/L"
                    },
                    {
                        "itemID": "RV_WQM_fiveDayOxygenDemand",
                        "name": "五日生化需氧量",
                        "itemTypeName": "RV_WQM_fiveDayOxygenDemand",
                        "unit":"mg/L"
                    },
                    {
                        "itemID": "RV_WQM_ammoniaNitrogen",
                        "name": "氨氮",
                        "itemTypeName": "RV_WQM_ammoniaNitrogen",
                        "unit":"mg/L"
                    },
                    {
                        "itemID": "RV_WQM_totalPhosphorus",
                        "name": "总磷",
                        "itemTypeName": "RV_WQM_totalPhosphorus",
                        "unit":"mg/L"
                    }
                ]
            }
        ],
        rcDevices: [
            {
                "name": "液位仪",
                "deviceTypeName": "RC_levelMeter",
                "items": [
                    {
                        "itemID": "waterLevel_DZSC",
                        "name": "水位",
                        "itemTypeName": "RC_levelMeter_waterLevel",
                        "alarmHeight": "1"
                    }
                ]
            },
            {
                "name": "水质监测仪",
                "deviceTypeName": "RC_waterQualityMonitor",
                "items": [
                    {
                        "itemID": "RC_WQM_waterTemperature",
                        "name": "水温",
                        "itemTypeName": "RC_WQM_waterTemperature",
                        "unit":"°C"
                    },
                    {
                        "itemID": "RC_WQM_ph",
                        "name": "PH值",
                        "itemTypeName": "RC_WQM_ph",
                        "unit":""
                    },
                    {
                        "itemID": "RC_WQM_dissolvedOxygen",
                        "name": "溶解氧",
                        "itemTypeName": "RC_WQM_dissolvedOxygen",
                        "unit":"mg/L"
                    },
                    {
                        "itemID": "RC_WQM_permanganateIndex",
                        "name": "高锰酸盐指数",
                        "itemTypeName": "RC_WQM_permanganateIndex",
                        "unit":"mg/L"
                    },
                    {
                        "itemID": "RC_WQM_chemicalOxygenDemand",
                        "name": "化学需氧量",
                        "itemTypeName": "RC_WQM_permanganateIndex",
                        "unit":"mg/L"
                    },
                    {
                        "itemID": "RC_WQM_fiveDayOxygenDemand",
                        "name": "五日生化需氧量",
                        "itemTypeName": "RC_WQM_fiveDayOxygenDemand",
                        "unit":"mg/L"
                    },
                    {
                        "itemID": "RC_WQM_ammoniaNitrogen",
                        "name": "氨氮",
                        "itemTypeName": "RC_WQM_ammoniaNitrogen",
                        "unit":"mg/L"
                    },
                    {
                        "itemID": "RC_WQM_totalPhosphorus",
                        "name": "总磷",
                        "itemTypeName": "RC_WQM_totalPhosphorus",
                        "unit":"mg/L"
                    }
                ]
            }
        ]

    }
});