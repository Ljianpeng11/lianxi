var template = require('./facilitySummary.html');
var eventHelper = require('../../utils/eventHelper');
var facilitySummaryCtrl = require('controllers/facilitySummaryController');
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            pageSize: 100,
            pipeDialogTitle: '',
            showQueryResult: false,
            pipeDetailMapMode: false,
            showPipeDetail: false,
            showQueryPanel: true,
            searchContent: '',
            regionDescription: '',
            region: [],
            owner: [],
            staticData: {
                totalRoadLength: 0,//道路总长
                totalRainLength: 0,//雨水管渠总长
                totalDirtyLength: 0,//污水管渠总长
                totalMixinLength: 0,//雨污合流管渠总长
                totalPipeCanalLength: 0,//管渠总长
                totalPipeLength: 0,//管道总长
                totalCanalLength: 0,//沟渠总长
                totalRainPipeLength: 0,//雨水管总长
                totalDirtyPipeLength: 0,//污水管总长
                totalMixinPipeLength: 0,//雨污合流管总长
                totalRainCanalLength: 0,//雨水沟总长
                totalDirtyCanalLength: 0,//污水沟总长
                totalMixinCanalLength: 0,//雨污合流沟总长
                area: 0,//面积
                rows: []
            },
            regions: [{
                value: '370322',
                label: '高青县',
                district:[370322]
            }
            ],
            owners: [
                {
                    value: '1',
                    label: '高青住建局'
                }
            ],
            rows: [],
            currentPage: 1
        }
    },
    methods: {
        formatRow: function (formatArr) {
            var result = [];
            formatArr.forEach(function (formatStr) {
                var tmpArr = formatStr.split(',');
                var tempObj = {};
                tempObj.owner = tmpArr[0];
                tempObj.road = tmpArr[1];
                tempObj.roadLength = tmpArr[2];
                tempObj.rainPipeLength = tmpArr[3];
                tempObj.dirtyPipeLength = tmpArr[4];
                tempObj.mixinPipeLength = tmpArr[5];
                tempObj.totalPipeLength = tmpArr[6];
                tempObj.rainCanalLength = tmpArr[7];
                tempObj.dirtyCanalLength = tmpArr[8];
                tempObj.mixinCanalLength = tmpArr[9];
                tempObj.totalCanalLength = tmpArr[10];
                tempObj.well = tmpArr[11];
                tempObj.totalPipeCanalLength = tmpArr[12];
                result.push(tempObj);
            });
            return result;
        },
        handleCurrentChange: function () {
            this.rows.splice(0);
            this.rows.push(...this.formatRow(this.staticData.rows.slice((this.currentPage - 1) * this.pageSize + 1, (this.currentPage + 1) * this.pageSize)));
        }, handleSearch: function () {

        },
        filterTag(value, row) {
            return row.owner === value;
        },
        query: function () {
            this.staticData = facilitySummaryCtrl.getPipeList(this.region);
            this.rows.splice(0);
            this.rows.push(...this.formatRow(this.staticData.rows).slice(0, this.pageSize));
            var regionDescription = '统计区域为:';
            this.region.forEach(function (selectedRegion) {
                regionDescription += selectedRegion.label + ',';
            });
            this.regionDescription = regionDescription.substring(0, regionDescription.length - 1);
            this.showQueryPanel = false;
            this.showQueryResult = true;
            this.$nextTick(function () {
                facilitySummaryCtrl.initPipeChart($('#pipeChart')[0], 'pipe', this.staticData.totalDirtyPipeLength, this.staticData.totalRainPipeLength, this.staticData.totalMixinPipeLength);
                facilitySummaryCtrl.initPipeChart($('#pipeChart2')[0], 'canal', this.staticData.totalDirtyCanalLength, this.staticData.totalRainCanalLength, this.staticData.totalMixinCanalLength);
                facilitySummaryCtrl.initRadarChart($('#pipeRadar')[0], this.staticData.totalPipeLength, this.staticData.totalCanalLength, this.staticData.totalRainPipeLength, this.staticData.totalDirtyPipeLength, this.staticData.totalMixinPipeLength, this.staticData.totalRainCanalLength, this.staticData.totalDirtyCanalLength, this.staticData.totalMixinCanalLength);
            }.bind(this));
        }
    },
    mounted: function () {
        var district = {
            district:[370322],
            label: '高青县',
            value: 370322
        };
        this.owner = {
            value: '1',
            label: '高青住建局'
        };
        this.region = [district];
        this.query();
    },
    components: {}
});
module.exports = comm;