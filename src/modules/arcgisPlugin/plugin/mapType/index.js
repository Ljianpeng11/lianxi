var template = require('./content.html');
var eventHelper = require('utils/eventHelper');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            isExpand: false,
            indexId: 1,
            hoverMargin: 5,
            mapTypeList: [
                {
                    layer: {icon1:'TDT'}
                }
            ]
        }
    },
    methods: {
        toggleClass: function (status) {
            this.isExpand = status;
        },
        highLight: function (item, index) {
            eventHelper.emit('change-map-type', item.id);
            this.indexId = item.id;
        }
    },
    mounted: function () {
        var currentAction = '';
        eventHelper.on('init-map-type', function (data) {
            this.mapTypeList = data;
            this.$nextTick(function () {
                $("#mapType-wrapper").hover(
                    function () {
                        $("#mapType-wrapper").addClass("expand");
                    },
                    function () {
                        $("#mapType-wrapper").removeClass("expand");
                    }
                );
                $("[data-name]").on("click", function () {
                    var actionName = $(this).data("name");
                    currentAction = actionName;
                    eventHelper.emit('change-map-type', actionName);
                    $(this).addClass("active").siblings().removeClass("active");
                });
                if (data.length == 1) {
                    $('.mapTypeCard').addClass('active')
                } else {
                    var displayIndex = '.mapTypeCard:eq(' + 0 + ')';
                    $(displayIndex).addClass('active');
                }
            }.bind(this))
        }.bind(this));
    },
    components: {}
});
module.exports = comm;