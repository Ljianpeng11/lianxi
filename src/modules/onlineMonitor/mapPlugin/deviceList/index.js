var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var mapHelper = require('utils/mapHelper');
var facilityController = require('controllers/facilityController');
var iotController = require('controllers/iotController');

var currentThread;

// 定义组件
var comm = Vue.extend({
    template: template,
    props:["baseView"],
    data: function () {
        return {
            isOpenList:true,
            highLightIndex:-1,
            showDiv:false,
            typeOption1:{
                value:'状态',
                options: [{
                    value: null,
                    label: '全部'
                },{
                    value: '0',
                    label: '正常'
                }, {
                    value: '1',
                    label: '预警'
                }, {
                    value: '2',
                    label: '报警'
                }]
            },
            typeOption2:{
                value:'地区',
                options: []
            },
            typeOption3:{
                value:'是否收藏',
                options: [{
                    value: null,
                    label: '全部'
                },{
                    value: '1',
                    label: '已收藏'
                }, {
                    value: '0',
                    label: '未收藏'
                }]
            },
            deviceList:[],
            selectIitem:{},
            queryString:{
                name:'',
                collection:null,
                state:null
            },
            queryList:[]
        }
    },
    // computed:{
    //     queryList:function(){
    //         var results = this.queryString ? this.deviceList.filter(this.createStateFilter(this.queryString)) : this.deviceList;
    //         return results;
    //     }
    // },
    watch:{
        queryString:{
            handler: function(val){
                if(!!val.name || !!val.collection || !!val.state){
                    this.queryList = this.deviceList.filter(this.createStateFilter(val));
                }else{
                    this.queryList = this.deviceList;
                }
            },
            deep: true
        }
    },
    created:function(){
        this.loadData();
    },
    methods: {
        toggleList:function(){
            this.isOpenList = !this.isOpenList;
            if(!!this.isOpenList){
                var parentHeight = $(".deviceListBox").parent().height();
                $(".deviceListBox").animate({'height':(parentHeight - 20) +'px'},1000);
            }else{
                $(".deviceListBox").animate({'height':'11.5em'},1000);
            }
        },
        openMapWindow:function(index,item){
            this.loadData();
            this.selectIitem = item;
            this.highLightIndex = index;
            if(this.baseView === 'detailView'){
                this.isOpenList = true;
                this.toggleList();
                this.highLightIndex = 0;
                eventHelper.emit('openDevicePanel',this.selectIitem);
            }else{
                //地图定位
                eventHelper.emit('openDevicePanel',this.selectIitem);
                var mapPoint = mapHelper.createPoint(this.deviceList[index].x,this.deviceList[index].y);
                mapHelper.setCenter(this.baseView,this.deviceList[index].x,this.deviceList[index].y,16,function(){
                    //显示地图popup信息框
                    this.$parent.$refs.infoWindow.detailView(index);
                }.bind(this));
                if($('#chartPanel').css('display') === 'block'){
                    this.$parent.$refs.infoWindow.showDevicePanel(item);
                }
            }
        },
        detailView:function(selectItem){
            eventHelper.emit('openDevicePanel',selectItem);
        },
        openStatisticsPanel:function(){
            eventHelper.emit('openStatistics');
        },
        renderList:function(list){
            var originList = [];
            list.forEach(function(item){
                item.facilityDevice.devices.forEach(function(val,index){
                    //井盖要单独配置一下
                    var wellState = 0;
                    for(var i = 0;i<val.items.length;i++){
                        var monitorData = val.items[i];
                        if(monitorData.dValue == null){
                            monitorData.dValue = '-';
                        }
                        if(Number(monitorData.dValue) != parseInt(Number(monitorData.dValue))){
                            monitorData.dValue = parseFloat(monitorData.dValue).toFixed(2);
                        }
                        switch(monitorData.name){
                            case '电压':
                                // middle
                                if(monitorData.dValue < monitorData.lowAlarm){item.voltage = 'low'}
                                else if(monitorData.dValue > monitorData.highAlarm){item.voltage = 'high'}
                                else{item.voltage = 'high'}
                                monitorData.dValue = monitorData.dValue + 'V';
                                item.onlineState = monitorData.onlineState;
                                val.items.splice(i,1);
                                i --;
                                break;
                            case '电量':
                                monitorData.dValue = monitorData.dValue ? monitorData.dValue * 100 + '%':"-";
                                val.items.splice(i,1);
                                i --;
                                break;
                            case '信号强度':
                                val.items.splice(i,1);
                                i --;
                                break;
                            case '水位':
                                monitorData.dValue = monitorData.dValue ? monitorData.dValue:'-';
                                item.state = monitorData.state;
                                break;
                            case '积水深度':
                                monitorData.dValue = monitorData.dValue ? (monitorData.dValue * 100).toFixed(2):'-';
                                item.state = monitorData.state;
                                break;
                            case '雨量':
                                monitorData.dValue = monitorData.dValue ? monitorData.dValue:'-';
                                item.state = monitorData.state;
                                break;
                            case '浊度':
                                monitorData.dValue = monitorData.dValue ? monitorData.dValue:'-';
                                break;
                            case '是否溢出':
                                item.state = monitorData.state;
                                if(item.state==2){
                                    wellState = 2;
                                }
                                monitorData.dValue = (monitorData.dValue===1) ? '水位溢出' : '未溢出';
                                break;
                            case '井盖状态':
                                item.state = monitorData.state;
                                if(wellState==2){
                                    item.state = wellState;
                                }
                                monitorData.dValue = (monitorData.dValue===1) ? '被开启' : '闭合';
                                break;
                            default:break;
                        }
                        if(!!monitorData.sysUpdateTime){
                            item.sysUpdateTime = monitorData.sysUpdateTime;
                        }else{
                            item.sysUpdateTime = '-';
                        }
                    }
               });
                var optionValue = {
                    value:item.name,
                    label:item.name
                };
                this.typeOption2.options.push(optionValue);
            }.bind(this));
            originList = list;
            originList.forEach(function(item,index){
                if(item.state === 2){
                    originList.splice(index,1);
                    originList.unshift(item);
                }
            });
            this.deviceList = originList;
            this.queryList = list;
        },
        loadData:function(){
            $.ajaxSettings.async = false;
            facilityController.getCurrentUserFacilitysMonitor(function (list) {
                //设备列表加载测站数据
                this.renderList(list);
            }.bind(this));
            $.ajaxSettings.async = true;
        },
        createStateFilter(queryString) {
            return (queryItem) => {
                var a = queryItem.name.indexOf(queryString.name) !== -1;
                var b,c;
                if(!!queryString.collection){
                    b = queryItem.collection === parseInt(queryString.collection);
                }else{
                    b = true;
                }
                if(!!queryString.state){
                    c = queryItem.state === parseInt(queryString.state);
                }else{
                    c = true;
                }
                return (a && b && c);
            };
        },
        handleSelect:function(type,value) {
           if(type === 'state'){
               this.queryString.state = value;
           }else if(type === 'collection'){
               this.queryString.collection = value;
           }
        },
        collectItem:function(facilityItem){
            iotController.collectFacilities(facilityItem.facilityId,function(data){
                this.loadData();
            }.bind(this));
        }
    },
    mounted: function () {
        currentThread = setInterval(function () {
            this.loadData();
        }.bind(this), 10000);
    },
    components: {}
});
module.exports = comm;