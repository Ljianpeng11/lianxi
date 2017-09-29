var template = require('./infoWindow.html');
var eventHelper = require('utils/eventHelper');
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            infoBoxes: [],
            fcEvents: [],
            showInput: false,
        }
    },
    methods: {
        relocate: function () {
            for (var i = 0; i < this.infoBoxes.length; i++) {
                var screenPoint = this.map.toScreen(this.infoBoxes[i]);

                var boxID = '#infoBox-' + i;
                //console.log(boxID, screenPoint);
                var x = screenPoint.x - 100;
                var y = screenPoint.y - 92;
                $(boxID).css('top', y);
                $(boxID).css('left', x);
                if(x > 0 && y >0){
                    $(boxID).show();
                }else{
                    $(boxID).hide();
                }
            }
        },
        display: function (flag) {
            for (var i = 0; i < this.infoBoxes.length; i++) {
                var boxID = '#infoBox-' + i;
                if(flag){
                    $(boxID).show();

                }else{
                    $(boxID).hide();

                }
            }
        },
        highLight: function (infoID) {
            $('#' + infoID).css('z-index', 9999);
        },
        normalize: function (infoID) {
            $('#' + infoID).css('z-index', 1);
        }
    },
    mounted: function () {
        /* y:-85
         x:-106*/
        this.map = {};
        // eventHelper.on('mapCreated', function (map) {
        //     this.map = map;
        //     this.map.on('extent-change', function () {
        //         setTimeout(function () {
        //             this.relocate();
        //         }.bind(this), 10);
        //     }.bind(this));
        //     this.map.on('zoom-end', function () {
        //         setTimeout(function () {
        //             this.display(true)
        //         }.bind(this), 10);
        //     }.bind(this));
        //     this.map.on('pan-end', function () {
        //         setTimeout(function () {
        //             this.display(true)
        //         }.bind(this), 10);
        //     }.bind(this));
        //     this.map.on('zoom-start', function () {
        //         setTimeout(function () {
        //             this.display(false);
        //         }.bind(this), 10);
        //     }.bind(this));
        //     this.map.on('pan-start', function () {
        //         setTimeout(function () {
        //             this.display(false)
        //         }.bind(this), 10);
        //     }.bind(this));
        // }.bind(this));

        eventHelper.on('alert-point', function (points, isReplace) {
            if (!!isReplace) {
                this.infoBoxes = points;
            }
            else {
                this.infoBoxes.push(...points.slice(0));
            }
            this.$nextTick(function () {
                this.relocate();
            }.bind(this));
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