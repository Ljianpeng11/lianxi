var Vue = require('vue');
var template = require('./layerList.html');
var eventHelper = require('utils/eventHelper');
var facilityController = require('controllers/facilityController');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            legendList:[],
            checkList:[]
        }
    },
    mounted: function () {

    },
    methods: {
        init: function (list) {
            var legendItem = [];
            list.forEach(function (type,index) {
                var facility = {
                    id: type.id,
                    label: type.nameCn,
                    facilityTypeName: type.name,
                    icon: type.icon,
                    showIcon: true,
                    showSub: false
                };
                if(facility.showIcon){
                    this.checkList.push(facility.id);
                }
                legendItem.push(facility);
                eventHelper.emit('openMapLegend', facility);
            }.bind(this));
            this.legendList = [{
                id:1,
                label:'测站',
                disabled: true,
                showIcon: true,
                showSub: false,
                children:legendItem
            }];
        },
        handleCheckChange:function(data,checked,indeterminate){
            data.showIcon = checked;
            if(!indeterminate){
                eventHelper.emit('openMapLegend', data);
            }
        }
    },
    components: {}
});
module.exports = comm;