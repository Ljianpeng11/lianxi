var Vue = require('vue');
var template = require('./flexMapLegend.html');
var eventHelper = require('utils/eventHelper');
var facilityController = require('controllers/facilityController');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            isActive: false,
            isOpen: false,
            isHorizontal: false,
            isShowSubLegend: false,
            legendList: []
        }
    },
    mounted: function () {

    },
    methods: {
        init: function (list) {
            list.forEach(function (type) {
                var facility = {
                    title: type.nameCn,
                    facilityTypeName: type.name,
                    icon: type.icon,
                    id: type.id,
                    showIcon: true,
                    showSub: false
                };
                this.legendList.push(facility);
                this.$parent.$emit('openMapLegend', facility);
            }.bind(this));
        },
        openMapLegend: function () {
            this.isActive = !this.isActive;
            this.isOpen = !this.isOpen;
            this.isShowSubLegend = false;
        },
        changeDirection: function () {
            this.isHorizontal = !this.isHorizontal;
        },
        showSubLegend: function (index, list) {
            // this.$emit('openMapLegend',)
            list.showIcon = !list.showIcon;
            this.$parent.$emit('openMapLegend', list);
        },
        showSub: function (index) {
            if (index + 1) {
                this.isShowSubLegend = true;
                this.legendList[index].showSub = true;
                for (var i = 0; i < this.legendList.length; i++) {
                    if (i != index) {
                        this.legendList[i].showSub = false;
                    }
                }
            } else {
                this.isShowSubLegend = false;
            }
        }
    },
    components: {}
});
module.exports = comm;