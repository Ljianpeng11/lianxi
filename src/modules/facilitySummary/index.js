var template = require('./facilitySummary.html');
var eventHelper = require('../../utils/eventHelper');
/*var clickPipePlugin = require('../../utils/skyLine/clickPipePlugin');
var skyLineClient = require('../../utils/skyLine/skyLineClient');*/
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
                value: '440100',
                label: '广州市',
                district:[440112,440104,440103,440111,440106,440105]
            }, {
                value: '440105',
                label: '海珠区'
            }, {
                value: '440106',
                label: '天河区'
            }, {
                value: '440111',
                label: '白云区'
            }, {
                value: '440103',
                label: '荔湾区'
            }, {
                value: '440104',
                label: '越秀区'
            }, {
                value: '440112',
                label: '黄埔区'
            }
            ],
            owners: [
                {
                    value: '3',
                    label: '其他权属单位'
                }, {
                    value: '2',
                    label: '广州市污水治理有限责任公司'
                }, {
                    value: '1',
                    label: '区属单位（含广州市市政园林局、区建设和市政局）'
                }
            ],
            rows: [],
            currentPage: 1
        }
    },
    methods: {
        underGroundMode: function () {
            skyLineClient.client.activePlugin('UndergroundModeCommand');
        },
        viewPipe: function (index, row) {
            this.pipeDialogTitle = row.road + '管渠立体图';
            this.showPipeDetail = true;
            setTimeout(function () {

                var rootPath = '';
                var sgworld = document.getElementById('SGWorld');
                //默认打开的fly文件路径，可以为本地磁盘路径
                var flyPath = "C:\\Users\\Thz-02\\Desktop\\gzpsgx201708(1)\\default.FLY";
                console.log(sgworld.Project);
                sgworld.Project.Open(flyPath);
                skyLineClient.client.init(sgworld);
                //web路径的前缀，如/ads2/
                skyLineClient.client.ctx = rootPath;
                //放图片的路径，要包括整条路径，就是从http开始
                //tefw.imagePath = "<%=webRootPath%>resources/tdImage/";
                //初始化后激活平移操作的插件，使得默认是平移操作
                skyLineClient.client.activePlugin('NavModeDragCommand');
            }.bind(this), 1000);
        },
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
      /*  this.$refs.pipeMapToggle.$on('change', function (newValue) {
            this.underGroundMode();
        }.bind(this));*/
    },
    components: {}
});
module.exports = comm;