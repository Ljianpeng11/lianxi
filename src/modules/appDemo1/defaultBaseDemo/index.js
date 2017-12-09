/**
 * 最简单功能demo
 */

var template = require('./defaultBaseDemo.html');
var serviceHelper = require('services/serviceHelper.js');
//默认（最简）功能基类
var defaultBase = require('modules/common/defaultBase');

module.exports = defaultBase.extend({
    template: template,
    // data: function () {
    //     return {
    //
    //     }
    // },
    // methods: {
    //
    // }
});
