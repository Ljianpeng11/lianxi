var template = require('./noticeBox.html');
var eventHelper = require('../../utils/eventHelper');
//var mapHelper = require('utils/mapHelper');
var points = [[108.30710438476564, 22.887789013671878],
    [108.24873951660157, 22.789255383300784],
    [108.45644978271486, 22.74839997558594],
    [108.3709624169922, 22.730547192382815],
    [108.32598713623048, 22.79955506591797],
    [108.4475233911133, 22.740846875000003]];
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            msgItems: [{
                mainImgSrc: 'img/icon/pollution.png',
                detailImgSrc1: 'img/icon/PM2.5.png',
                detailImgSrc2: 'img/icon/PM10.png',
                title: '环保',
                detailMsg1: 'PM2.5超标',
                detailMsg2: 'PM10超标',
                detailTips1: '2',
                detailTips2: '1',
            }, {
                mainImgSrc: 'img/icon/info.png',
                detailImgSrc1: 'img/icon/overweight.png',
                detailImgSrc2: 'img/icon/blackmenu.png',
                title: '源头',
                detailMsg1: '车辆超载',
                detailMsg2: '黑名单上路',
                detailTips1: '3',
                detailTips2: '1',
            }, {
                mainImgSrc: 'img/icon/bus.png',
                detailImgSrc1: 'img/icon/speedCar.png',
                detailImgSrc2: 'img/icon/overline.png',
                title: '运输线路',
                detailMsg1: '车辆超速',
                detailMsg2: '线路偏离',
                detailTips1: '5',
                detailTips2: '1',
            }, {
                mainImgSrc: 'img/icon/notice.png',
                detailImgSrc1: 'img/icon/wifi.png',
                detailImgSrc2: 'img/icon/over.png',
                title: '末端',
                detailMsg1: '消纳场超范围弃土',
                detailMsg2: '消纳场超负荷',
                detailTips1: '3',
                detailTips2: '1',
            }, {
                mainImgSrc: 'img/icon/music.png',
                detailImgSrc1: 'img/icon/dute.png',
                detailImgSrc2: 'img/icon/road.png',
                title: '巡查上报',
                detailMsg1: '车身带泥',
                detailMsg2: '路面撒漏',
                detailTips1: '5',
                detailTips2: '3',
            },],
            isLoginSuccess: false,
            showMessageBox: false,
            showAlertBoxDetail: false,
            showAlertBox: false,
            activeName: 'first',
            selectedDepartments: ['交警', '环保', '城管', '建委', '国土', '工信委'],
            alertItems: [{
                status: 0,
                alertType: '建筑工地',
                alertDetail: 'XXX路噪声超标',
                owner: '环保局XXX区分队',
                alertTitle: '噪声超标',
                alertGrade: '严重'
            },
                {
                    status: 1,
                    alertType: '消纳场',
                    alertDetail: 'XXX路PM2.5超标',
                    owner: '环保局XXX区分队',
                    alertTitle: 'PM2.5超标',
                    alertGrade: '严重'
                }, {
                    status: 2,
                    alertType: '采石场',
                    alertDetail: 'XX采石场违章作业',
                    owner: '环保局XXX区分队',
                    alertTitle: '违章作业',
                    alertGrade: '严重'
                }],
            departments: [{
                name: '交警',
                isChecked: false
            }, {
                name: '城管',
                isChecked: true
            }, {
                name: '建委',
                isChecked: false
            }, {
                name: '环保',
                isChecked: false
            }, {
                name: '国土',
                isChecked: false
            }, {
                name: '工信委',
                isChecked: false
            }],
            messageList: [
                {
                    title: '收到建委XXXX执法信息',
                    detail: '凌晨2点，市民举报河堤的一处工地缺少降尘设备，同时在五一路和江南大道上发现共有三辆泥头车行驶过程中发生撒漏，严重污染道路。为及时打击在扬尘污染专项治理行动中“越线者”的嚣张气焰，指挥中心立即启动紧急处置预案，立即将案件派遣至相应的城管特勤大队和城区住建局，同时协调城区环卫部门清洗被污染的城市路面',
                    showDetail: false
                },
                {
                    title: '收到交警上报XXXX执法信息',
                    detail: '凌晨2点，市民举报河堤的一处工地缺少降尘设备，同时在五一路和江南大道上发现共有三辆泥头车行驶过程中发生撒漏，严重污染道路。为及时打击在扬尘污染专项治理行动中“越线者”的嚣张气焰，指挥中心立即启动紧急处置预案，立即将案件派遣至相应的城管特勤大队和城区住建局，同时协调城区环卫部门清洗被污染的城市路面',
                    showDetail: false
                },
                {
                    title: '收到环保xxx共享信息',
                    detail: '凌晨2点，市民举报河堤的一处工地缺少降尘设备，同时在五一路和江南大道上发现共有三辆泥头车行驶过程中发生撒漏，严重污染道路。为及时打击在扬尘污染专项治理行动中“越线者”的嚣张气焰，指挥中心立即启动紧急处置预案，立即将案件派遣至相应的城管特勤大队和城区住建局，同时协调城区环卫部门清洗被污染的城市路面',
                    showDetail: false
                },
                {
                    title: '收到消纳场XXXX共享信息',
                    detail: '凌晨2点，市民举报河堤的一处工地缺少降尘设备，同时在五一路和江南大道上发现共有三辆泥头车行驶过程中发生撒漏，严重污染道路。为及时打击在扬尘污染专项治理行动中“越线者”的嚣张气焰，指挥中心立即启动紧急处置预案，立即将案件派遣至相应的城管特勤大队和城区住建局，同时协调城区环卫部门清洗被污染的城市路面',
                    showDetail: false
                },
                {
                    title: '收到公众上报XXXX污染信息',
                    detail: '凌晨2点，市民举报河堤的一处工地缺少降尘设备，同时在五一路和江南大道上发现共有三辆泥头车行驶过程中发生撒漏，严重污染道路。为及时打击在扬尘污染专项治理行动中“越线者”的嚣张气焰，指挥中心立即启动紧急处置预案，立即将案件派遣至相应的城管特勤大队和城区住建局，同时协调城区环卫部门清洗被污染的城市路面',
                    showDetail: false
                },
                {
                    title: '交警已接受AXDDXXX案件',
                    detail: '凌晨2点，市民举报河堤的一处工地缺少降尘设备，同时在五一路和江南大道上发现共有三辆泥头车行驶过程中发生撒漏，严重污染道路。为及时打击在扬尘污染专项治理行动中“越线者”的嚣张气焰，指挥中心立即启动紧急处置预案，立即将案件派遣至相应的城管特勤大队和城区住建局，同时协调城区环卫部门清洗被污染的城市路面',
                    showDetail: false
                },
                {
                    title: 'XXX案件已处理完成',
                    detail: '凌晨2点，市民举报河堤的一处工地缺少降尘设备，同时在五一路和江南大道上发现共有三辆泥头车行驶过程中发生撒漏，严重污染道路。为及时打击在扬尘污染专项治理行动中“越线者”的嚣张气焰，指挥中心立即启动紧急处置预案，立即将案件派遣至相应的城管特勤大队和城区住建局，同时协调城区环卫部门清洗被污染的城市路面',
                    showDetail: false
                }
            ]
        }
    },
    methods: {
        handleClick: function (tab, event) {
            console.log(tab, event);
        },
        checkDepartment: function (dept) {
            this.$nextTick(function () {
                dept.isChecked = true;
            });
        }
    },
    mounted: function () {
        eventHelper.on('loginSuccess', function () {
            this.isLoginSuccess = true;
        }.bind(this));
        eventHelper.on('showMessageBox', function () {
            this.showMessageBox = !this.showMessageBox;
        }.bind(this));
        eventHelper.on('mapCreated', function (map) {
            this.map = map;
        }.bind(this));
        this.layerArr = [];
        eventHelper.on('showAlertBox', function () {
            this.showAlertBox = !this.showAlertBox;
            var size = 30;
            if (!this.showAlertBox) {
                mapHelper.removeLayers(this.map, this.layerArr);
                clearInterval(this.showPointer);
                clearInterval(this.hidePointer);
            } else {
                this.showPointer = setInterval(function () {
                    this.layerArr.push(mapHelper.createSymbol(this.map, points[0][0], points[0][1], './img/icon/PM2.5.png', '', size, size, false, true));
                    this.layerArr.push(mapHelper.createSymbol(this.map, points[1][0], points[1][1], './img/icon/speedCar.png', '', size, size, false, true));
                    this.layerArr.push(mapHelper.createSymbol(this.map, points[2][0], points[2][1], './img/icon/road.png', '', size, size, false, true));
                    this.layerArr.push(mapHelper.createSymbol(this.map, points[3][0], points[3][1], './img/icon/overweight.png', '', size, size, false, true));
                    this.layerArr.push(mapHelper.createSymbol(this.map, points[4][0], points[4][1], './img/icon/overline.png', '', size, size, false, true));
                    this.layerArr.push(mapHelper.createSymbol(this.map, points[5][0], points[5][1], './img/icon/dute.png', '', size, size, false, true));
                }.bind(this), 900);
                this.hidePointer = setInterval(function () {
                    mapHelper.removeLayers(this.map, this.layerArr);
                }.bind(this), 2000);
            }
        }.bind(this));

        this.$refs.departmentGroup.$on('change', function () {
            console.log('change', this.selectedDepartments);
        }.bind(this));
    },
    components: {}
});
module.exports = comm;