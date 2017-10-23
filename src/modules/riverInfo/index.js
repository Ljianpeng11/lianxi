var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
/*var clickPipePlugin = require('../../utils/skyLine/clickPipePlugin');
 var skyLineClient = require('../../utils/skyLine/skyLineClient');*/
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            gqRiver:'',
            riverData:[{
                riverName:'黄河',
                riverArea:'高青县',
                riverStart:'高青县黑里寨镇官庄村',
                riverEnd:'高青县芦湖街道吴家',
                riverTown:'黑里寨镇',
                riverMaster:'王其凯',
                job:'书记',
                phone:'13732332373',
            },{
                riverName:'黄河',
                riverArea:'高青县',
                riverStart:'高青县黑里寨镇官庄村',
                riverEnd:'高青县芦湖街道吴家',
                riverTown:'黑里寨镇',
                riverMaster:'吴  涛',
                job:'镇长',
                phone:'13746563433',
            },{
                riverName:'黄河',
                riverArea:'高青县',
                riverStart:'高青县黑里寨镇官庄村',
                riverEnd:'高青县芦湖街道吴家',
                riverTown:'黑里寨镇',
                riverMaster:'蔡亮',
                job:'副书记',
                phone:'13573439438',
            },{
                riverName:'黄河',
                riverArea:'高青县',
                riverStart:'高青县黑里寨镇官庄村',
                riverEnd:'高青县芦湖街道吴家',
                riverTown:'青城镇',
                riverMaster:'孙秀娟',
                job:'书记',
                phone:'13732323443',
            },{
                riverName:'黄河',
                riverArea:'高青县',
                riverStart:'高青县黑里寨镇官庄村',
                riverEnd:'高青县芦湖街道吴家',
                riverTown:'青城镇',
                riverMaster:'王仕军',
                job:'镇长',
                phone:'13732322313',
            },],
            pipeDetailMapMode: false,
            showPipeDetail: false,
            showQueryPanel: true,
            searchContent: '',
            regionDescription: '',
            gqAreas: [{
                value: '高青县 ',
                label: '高青县'
            }, {
                value: '木李镇',
                label: '木李镇'
            }, {
                value: '田镇街道',
                label: '田镇街道'
            }, {
                value: '高城镇',
                label: '高城镇'
            }, {
                value: '常家镇',
                label: '常家镇'
            }, {
                value: '芦湖街道',
                label: '芦湖街道'
            }, {
                value: '唐坊镇',
                label: '唐坊镇'
            }, {
                value: '青城镇',
                label: '青城镇'
            }, {
                value: '花沟镇',
                label: '花沟镇'
            }, {
                value: '黑里寨镇',
                label: '黑里寨镇'
            }, {
                value: '全部',
                label: '全部'
            }],
            gqArea: '高青县',
            displayData:[],
        }
    },
    methods: {
        //点击搜索触发
        search: function () {
            //通过过滤条件返回搜索后的数组对象(this.dataBySearch是指经过过滤后的数据集合)
            //item => (~item.name.indexOf(this.tableSearch) || ~item.date.indexOf(this.tableSearch) || ~item.address.indexOf(this.tableSearch))这个是根据字段返回过滤结果
            this.dataBySearch = this.riverData.filter( item => (~item.riverName.indexOf(this.gqRiver) || ~item.riverArea.indexOf(this.gqRiver) || ~item.riverTown.indexOf(this.gqRiver)));
            //初始化展示的数据
            this.displayData.splice(0);
            this.displayData.push(...this.dataBySearch);
        },
        initTable: function () {
            this.displayData.push(...this.riverData);
        },
    },
    mounted: function () {
        this.initTable();
        /*  this.$refs.pipeMapToggle.$on('change', function (newValue) {
         this.underGroundMode();
         }.bind(this));*/
    },
    components: {}
});
module.exports = comm;