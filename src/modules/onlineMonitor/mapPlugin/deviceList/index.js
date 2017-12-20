var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var mapHelper = require('utils/mapHelper');
var facilityController = require('controllers/facilityController');

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
                    value: '',
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
                    value: '',
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
                collection:'',
                status:''
            }
        }
    },
    computed:{
        queryList:function(){
            var results = this.queryString ? this.deviceList.filter(this.createStateFilter(this.queryString)) : this.deviceList;
            return results;
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
                var mapPoint = mapHelper.createPoint(this.deviceList[index].x,this.deviceList[index].y);
                mapHelper.setCenter(this.baseView,this.deviceList[index].x,this.deviceList[index].y,16,function(){
                    //显示地图popup信息框
                    this.$parent.$refs.infoWindow.detailView(index);
                }.bind(this));
            }
        },
        detailView:function(selectItem){
            eventHelper.emit('openDevicePanel',selectItem);
        },
        renderList:function(list){
            list.forEach(function(item){
                var sysUpdateTime;
                item.status = 0;
                item.signal = 'on';
                item.facilityDevice.devices.forEach(function(val){
                    for(var i = 0;i<val.items.length;i++){
                        var monitorData = val.items[i];
                        switch(monitorData.name){
                            case '电压':
                                monitorData.dValue = monitorData.dValue + 'V';
                                if(monitorData.dValue < monitorData.lowAlarm){item.voltage = 'low'}
                                else if(monitorData > monitorData.highAlarm){item.voltage = 'high'}
                                else{item.voltage = 'middle'}
                                val.items.splice(i,1);
                                i --;
                                break;
                            case '电量':
                                monitorData.dValue = monitorData.dValue*100 + '%';
                                val.items.splice(i,1);
                                i --;
                                break;
                            case '信号强度':
                                val.items.splice(i,1);
                                i --;
                                break;
                            case '水位':
                                monitorData.dValue = parseFloat(monitorData.dValue).toFixed(2) + '(m)';
                                break;
                            default:break;
                        }
                        sysUpdateTime = monitorData.sysUpdateTime;
                    }
                   // val.items.forEach(function(monitorData,index){
                   //
                   // });
               });
                item.sysUpdateTime = sysUpdateTime;
                var optionValue = {
                    value:item.name,
                    label:item.name
                };
                this.typeOption2.options.push(optionValue);
            }.bind(this));
            this.deviceList = list;
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
                return (queryItem.name.indexOf(queryString.name.toLowerCase()) !== -1 || queryItem.collection === queryString.collection || queryItem.status === queryString.status);
            };
        },
        handleSelect:function(type,value) {
           if(type === 'status'){
               this.queryString.status = value;
           }else if(type === 'collection'){
               this.queryString.collection = value;
           }
        }
    },
    mounted: function () {

    },
    components: {}
});
module.exports = comm;