//默认（最简）功能基类

module.exports = Vue.extend({
    data: function () {
        return {
            //当前最大html元素的id，因为jquery经常用id查询，为防止不同功能间id重号，因此在查询时限制在本功能范围，id随机生成，保证不重复
            mainContentDivId: "mainContentDiv" + Math.random().toString(36).substr(2),
        }
    },
    methods: {},
});