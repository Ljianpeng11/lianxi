var template = require('./content.html');
var mapHelper = require('utils/mapHelper');
// 定义组件
var comm = Vue.extend({
    template: template,
    props:["baseView"],
    data: function () {
        return {
            selectItem: "",
            restaurants: []
        }
    },
    methods: {
        querySearch:function(queryStr, cb) {
            var queryParam = {
                "getFeatureMode":"SQL",
                "datasetNames":["dimingdizhi:行政其他区域","dimingdizhi:居民点","dimingdizhi:单位","dimingdizhi:纪念地旅游胜地","dimingdizhi:水利电力通讯设施","dimingdizhi:建筑物","dimingdizhi:水系","dimingdizhi:重点企业","dimingdizhi:交通运输设施"],
                "maxFeatures":10,
                "queryParameter":{
                    "sortClause":null,
                    "ids":null,
                    "name":"Capital",
                    "attributeFilter":"标准地名 like '%"+queryStr+"%'",
                    "groupClause":null,
                    "linkItems":null,
                    "joinItems":null,
                    "fields":null
                }
            };
            $.ajax({
                type:"POST",
                url:"http://223.99.169.187:20071/iserver/services/data-dimingdizhi/rest/data/featureResults.json?returnContent=true",
                data:JSON.stringify(queryParam),
                dataType:"json",
                success:this.handleSearchSuccess,
                error:this.handleSearchError
            })
        },
        handleSearchError:function(erro,info,obj){
            this.$message.error('地名地址查询失败！');
        },
        handleSearchSuccess:function(data){
            for(var i in data.features){
                data.features[i].value=data.features[i].fieldValues[9];
            }
            this.$children[0].loading = false;
            if (Array.isArray(data.features)) {
                this.$children[0].suggestions = data.features;
            } else {
                console.error('autocomplete suggestions must be an array');
            }
        },
        handleSelect:function(item) {
            console.log(item);
            var mapPoint = mapHelper.createPoint(item.geometry.center.x,item.geometry.center.y);
            mapHelper.setCenter(this.baseView,item.geometry.center.x,item.geometry.center.y,16);

            var content = item.fieldNames[10]+":"+item.fieldValues[10]+"<br/>"+item.fieldNames[11]+":"+item.fieldValues[11]+"<br/>"+item.fieldNames[10]+":"+item.fieldValues[11];
            this.baseView.popup.open({
                location: mapPoint,
                title: item.value,
                content: content
            });
        }
    },
    mounted: function () {

    },
    components: {

    }
});
module.exports = comm;