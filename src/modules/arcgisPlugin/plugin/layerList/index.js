var Vue = require('vue');
var template = require('./layerList.html');
var eventHelper = require('utils/eventHelper');
var facilityController = require('controllers/facilityController');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            data3: [{
                id: 1,
                label: '一级 2',
                children: [{
                    id: 3,
                    label: '二级 2-1',
                    children: [{
                        id: 4,
                        label: '三级 3-1-1'
                    }, {
                        id: 5,
                        label: '三级 3-1-2',
                        disabled: true
                    }]
                }, {
                    id: 2,
                    label: '二级 2-2',
                    disabled: true,
                    children: [{
                        id: 6,
                        label: '三级 3-2-1'
                    }, {
                        id: 7,
                        label: '三级 3-2-2',
                        disabled: true
                    }]
                }]
            }],
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
                this.checkList.push(facility.id);
                legendItem.push(facility);
                this.$parent.$emit('openMapLegend', facility);
            }.bind(this));
            this.legendList = [{
                id:1,
                label:'测站',
                disabled: true,
                children:legendItem
            }];
        },
    },
    components: {}
});
module.exports = comm;