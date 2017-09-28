var template = require('./content.html');
var eventHelper = require('../../utils/eventHelper');
var appMenuController = require('controllers/appMenuController');
var facilityService = require('services/facilityService');
//var mapHelper = require('utils/mapHelper');
// var serviceHelper = require('services/serviceHelper');
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            showSearch: false,
            isToggleMenu: false,
            account:6,
            cacheGraphies:[],
            datatheads: ['设备名称', '状态'],
            form: {
                name: '',
                address: '',
                data: '',
                pollute: ''
            },
            datas: [{
                value: '',
                label: ''
            }, {
                value: '易捞点',
                label: '易捞点'
            }, {
                value: '南宁市交警支队',
                label: '南宁市交警支队'
            }],
            pollutions: [{
                value: '',
                label: ''
            },{
                value: '工地',
                label: '工地'
            }, {
                value: '消纳场',
                label: '消纳场'
            }, {
                value: '采石场',
                label: '采石场'
            }, {
                value: '混凝土搅拌站',
                label: '混凝土搅拌站'
            }],
            areas: [{
                value: '',
                label: ''
            },{
                value: '静安区',
                label: '静安区'
            }, {
                value: '兴宁区',
                label: '兴宁区'
            }, {
                value: '江南区',
                label: '江南区'
            }, {
                value: '良庆区',
                label: '良庆区'
            }, {
                value: '邕宁区',
                label: '邕宁区'
            }, {
                value: '高新区',
                label: '高新区'
            }],
            facilityTableData: [],
        }
    },
    methods: {
        getThisVideoPlace:function (data) {
            if(!!this.cacheGraphies){
                this.cacheGraphies.forEach(function (graphic) {
                    mapHelper.removeGraphic(this.map, graphic);
                }.bind(this));
            }
            mapHelper.setCenter(data.x, data.y, this.map, 12);
            this.cacheGraphies.push(...mapHelper.addMarkSymbol(this.map, '', data.x, data.y, 5, [255, 0, 0, 0.8]));
        },
        getFacilityTableData:function () {
            var self =this;
            facilityService.getFacilityLists('','','','',function (result) {
                console.log(45678);
                console.log(result);
                self.account = result.facilityList.length;
                result.facilityList.forEach(function (value) {
                    self.facilityTableData.push({
                        name:value.name,
                        status:'在线',
                        x:value.x,
                        y:value.y
                    })
                })
            });
        },
        searchRecord:function () {
            var self = this;
            self.facilityTableData.splice(0);
            facilityService.getFacilityLists(self.form.name,self.form.address,self.form.data,self.form.pollute,function (result) {
                self.account = result.facilityList.length;
                result.facilityList.forEach(function (value) {
                    self.facilityTableData.push({
                        name:value.name,
                        status:'在线',
                        x:value.x,
                        y:value.y
                    })
                })
            });
        },
        close:function (formName) {
            this.showSearch = false;
            // this.$refs[formName].resetFields();
        },
    },
    mounted: function () {
        eventHelper.on('mapCreated', function (map) {
            this.map = map;
        }.bind(this));
        this.getFacilityTableData();
        eventHelper.on('openPointSearch', function () {
            this.showSearch = !this.showSearch;
        }.bind(this));
        eventHelper.on('toggle-menu', function (flag) {
            this.isToggleMenu = flag;
        }.bind(this));
    },
    computed: {
        //搜索功能（当前是按照名字和在线情况进行过滤）
        // searchEquipment: function () {
        //     // return this.searchFilter();
        //     var that = this;
        //
        //     var search = that.facilityTableData.filter(function (user) {
        //         var addressSearch =user.name.toLowerCase().indexOf(that.form.name.toLowerCase()) !== -1;
        //         var dataSearch = user.name.toLowerCase().indexOf(that.form.data.toLowerCase()) !==-1;
        //         var pollutionSearch = user.name.toLowerCase().indexOf(that.form.pollute.toLowerCase()) !==-1;
        //         var areaSearch = user.name.toLowerCase().indexOf(that.form.address.toLowerCase()) !==-1;
        //         return (addressSearch && dataSearch && pollutionSearch && areaSearch);
        //     });
        //     that.account = search.length;
        //     return search;
        // }
    },
    components: {}
});
module.exports = comm;