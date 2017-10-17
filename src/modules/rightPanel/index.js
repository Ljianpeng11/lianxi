var template = require('./rightPanel.html');
var controller = require('controllers/rightPanelController');
var monitor = require('./monitor');
var statistics = require('./statistics');
var dateController = require('./dateControl');
var facilityController = require('controllers/facilityController');
var serviceHelper = require('services/serviceHelper');
var moment = require('moment');
var eventHelper = require('utils/eventHelper');
var realTimeUpdate = function (self, monitorObj) {
    controller.getMonitorItemCurrentValue(monitorObj, function (result) {
        self.lastUpdateTime = moment().format('YYYY-MM-DD hh:mm:ss', new Date());
        self.$refs.monitorPlugin.$emit('update-monitor', result);
        self.$refs.statisticPlugin.$emit('update-statistic', {
            data: result,
            facility: self.facility
        });
    });
};
var refreshTime = 1000;
var currentThread;
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            msgLists: [
                {
                    children: [
                        {
                            name: '证号',
                            value: '201630002'
                        },
                        {
                            name: '所在区',
                            value: '南宁市仙葫经济开发区五合社区消纳场'
                        }
                    ]
                },
                {
                    children: [
                        {
                            name: '地址',
                            value: '南宁市仙葫经济开发区蒲旧公路'
                        },
                        {
                            name: '有效期限',
                            value: '2016.05.20-2017.05.20'
                        }
                    ]
                },
                {
                    children: [
                        {
                            name: '联系人',
                            value: '韦绍陆'
                        },
                        {
                            name: '电话',
                            value: '18878876669'
                        }
                    ]
                },
                {
                    children: [
                        {
                            name: '行政主管部门',
                            value: '市城管局'
                        },
                        {
                            name: '分管领导',
                            value: '李军'
                        }
                    ]
                },
                {
                    children: [
                        {
                            name: '部门联系人',
                            value: '陈明'
                        },
                        {
                            name: '电话',
                            value: '15177925360'
                        }
                    ]
                }
            ],
            rightPanelOpen: false,
            isRealTimeMode: true,
            realTimeName: '实时监测',
            historyName: '历史记录',
            lastUpdateTime: '',
            alarmStatus: 0,
            alertMessage: '',
            activeIndex: '1',
            facilityPic: '../src/img/combImg.png',
            facilityName: '',
            selectedMode: '',
            facilityType: '',
            waterGrade: 1,
            waterGradeTitle: ''
        }
    },
    mounted: function () {
        eventHelper.on('openRightPanel',function(facility, facilityTypeName){
            console.log(123);
            // this.open(facility, facilityTypeName);
        });
        eventHelper.on('monitor-status', function (status) {
            this.alarmStatus = status;
        }.bind(this));
        this.$on('query-history', function (date) {
            // controller.getHistoricalDataByMonitor(this.waterLevelID ,date.startDate,date.endDate,function(result){
            this.$refs.statisticPlugin.$emit('init-statistic-history', {
                facility: this.facility,
                date: date
            });
        });
        eventHelper.on('current-grade', function (grade) {
            this.waterGrade = grade.grade;
            this.waterGradeTitle = grade.title;
        }.bind(this));
        eventHelper.on('close-right-panel', function () {
            this.closePanel();
        }.bind(this));
    },
    methods: {
        handleSelect: function () {
            console.log('select');
        },
        closePanel: function () {
            eventHelper.emit('right-panel-close');
            this.reset();
        },
        reset: function () {
            this.rightPanelOpen = false;
            this.isRealTimeMode = true;
            this.activeIndex = '1';
        },
        open: function (facility, facilityTypeName) {
            debugger;
            eventHelper.emit('isLoading');
            var self = this;
            clearInterval(currentThread);
            if (!this.isRealTimeMode) {
                $('#historicalMode').removeClass('is-active');
                setTimeout(function () {
                    $('#realTimeMode').addClass('is-active');
                }.bind(this), 100);
            }
            this.isRealTimeMode = true;
            this.rightPanelOpen = true;
            this.$nextTick(function () {
                this.activeIndex = '1';
                this.facility = facility;
                if (!!this.$refs.monitorPlugin) {
                    this.$refs.monitorPlugin.$emit('reset');
                }
                var facilityID = facility.id;
                facilityController.getFacilityDetail(facilityID, function (data) {
                    console.log(data);
                    data.devices.forEach(function (device) {
                        if (device.devName.toUpperCase().indexOf('VIDEO') !== -1) {
                            var videoURL = device.items[0].value;
                            if (videoURL.indexOf('dh-video') != -1) {
                                facilityTypeName = 'DH';
                            }
                            this.facilityType = facilityTypeName;
                            if (facilityTypeName == 'DS' || facilityTypeName == 'CMP' || facilityTypeName == 'SQ') {
                                this.initHKVideo(videoURL);
                            } else if (facilityTypeName == 'CS') {
                                this.initGDVideo(videoURL);
                            } else if (facilityTypeName == 'TP') {
                                this.initJJVideo(videoURL);
                            }
                            else if (facilityTypeName == 'DH') {
                                this.initDHVideo(videoURL);
                            }
                            return;
                        }
                    }.bind(this));
                }.bind(this));
                facilityController.getMonitorDetailMsg(facilityID, function (data) {
                    console.log(data);
                    this.msgLists[0].children[0].value = data.licenseNumber;
                    this.msgLists[0].children[1].value = data.district;
                    this.msgLists[1].children[0].value = data.location;
                    this.msgLists[1].children[1].value = data.limitTime;
                    this.msgLists[2].children[0].value = data.contact;
                    this.msgLists[2].children[1].value = data.contactPhone;
                    this.msgLists[3].children[0].value = data.adminDepartment;
                    this.msgLists[3].children[1].value = data.departmentSupervisor;
                    this.msgLists[4].children[0].value = data.adminDepartmentContact
                    this.msgLists[4].children[1].value = data.adminDepartmentPhone;
                }.bind(this));
            }.bind(this));
        },
        switchMode: function (key, keyPath) {
            this.isRealTimeMode = key === '1';
            if (!this.isRealTimeMode) {
                eventHelper.emit('isLoading');
                $('#realTimeMode').removeClass('is-active');
                $('#historicalMode').addClass('is-active');
            }
            else {
                $('#historicalMode').removeClass('is-active');
                $('#realTimeMode').addClass('is-active');
            }
            this.$refs.monitorPlugin.$emit('switchMode', this.isRealTimeMode);
            this.$refs.statisticPlugin.$emit('switchMode', this.isRealTimeMode);
            if (!this.isRealTimeMode) {
                //query by default date
                this.$refs.dateController.queryByDefaultDate();
            }
        }
    },
    components: {
        monitor: monitor,
        statistics: statistics,
        dateControl: dateController
    }
});
module.exports = comm;