var template = require('./infoWindow.html');
var eventHelper = require('utils/eventHelper');
var mapHelper = require('utils/mapHelper');
// 定义组件
var comm = Vue.extend({
    template: template,
    props:["baseView"],
    data: function () {
        return {
            infoBoxes: [],
            fcEvents: [],
            showInput: false,
            registerEvents:[]
        }
    },
    methods: {
        relocate: function (item) {
            for (var i = 0; i < item.length; i++) {
                item.show=true;
                var boxID = '#infoBox-' + item[i].id;
                if(this.isNumber(item[i].x)&&this.isNumber(item[i].y)){
                    var screenPoint =this.baseView.toScreen(item[i]);
                    var x = screenPoint.x - 100;
                    var y = screenPoint.y - 192;
                    $(boxID).css('top', y);
                    $(boxID).css('left', x);
                    if(x > 0 && y >0){
                        item.show=true;
                    }
                } else {
                    item.show=false;
                }
            }
        },
        highLight: function (infoID) {
            $('#' + infoID).css('z-index', 9999);
        },
        normalize: function (infoID) {
            $('#' + infoID).css('z-index', 1);
        },
        registerToView:function(){
            if(this.registerEvents.length==0){
                var instance = mapHelper.getInstance();
                this.registerEvents.push(
                    instance.dojoOn(
                        this.baseView, "resize", instance.dojoHitct(this,function(){
                            this.relocate(this.infoBoxes);
                        })
                    )
                );

                this.registerEvents.push(
                    instance.dojoOn(
                        this.baseView, "mouse-wheel", instance.dojoHitct(this, function(){
                            this.relocate(this.infoBoxes);
                        })
                    )
                );
                this.registerEvents.push(
                    instance.dojoOn(
                        this.baseView, "pan-end", instance.dojoHitct(this, function(){
                            this.relocate(this.infoBoxes);
                        })
                    )
                );

                this.registerEvents.push(
                    instance.dojoOn(
                        this.baseView.root, "mousemove", instance.dojoHitct(this, function(){
                            this.relocate(this.infoBoxes);
                        })
                    )
                );
                this.registerEvents.push(
                    instance.dojoOn(
                        this.baseView.root, "mouseup", instance.dojoHitct(this, function(){
                            this.relocate(this.infoBoxes);
                        })
                    )
                );
            }
        },
        isNumber:function (value) {
            var patrn = /^(-)?\d+(\.\d+)?$/;
            if (patrn.exec(value) == null || value == "") {
                return false;
            } else {
                return true;
            }
        },
        closePopup:function(index){
            this.infoBoxes[index].show=false;
        },
        detailView:function(index){
            alert(index);
        }
    },
    mounted: function () {
        eventHelper.on('alert-point', function (points, isReplace) {
            if (!!isReplace) {
                this.infoBoxes = points;
            } else {
                this.infoBoxes.push(...points.slice(0));
            }
            if(this.baseView&&this.baseView.ready) {
                this.$nextTick(function(){
                    this.relocate(points);
                    this.registerToView();
                }.bind(this));
            }
        }.bind(this));
        eventHelper.on('alert-point-close', function (point, isAll) {
            if (!!isAll) {
                this.infoBoxes = [];
            }
            else {
                for (var i = 0; i < this.infoBoxes.length; i++) {
                    var item = this.infoBoxes[i];
                    if (item.x == point.x && item.y == point.y) {
                        this.infoBoxes.splice(i, 1);
                    }
                }
            }
        }.bind(this));
    },
    components: {}
});
module.exports = comm;