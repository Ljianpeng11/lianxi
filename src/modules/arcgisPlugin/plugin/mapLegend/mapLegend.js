define(['utils/eventHelper'], function (eventHelper) {

    var pluginName = "mapLegend",//插件调用名
        //默认属性
        defaults = {
            type: 1,
            data: " "
        };
    //参数：元素，属性
    function Plugin(element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);//扩展属性，将defaults和options属性添加到第一个参数并返回，有相同属性就覆盖
        this._defauts = defaults;
        this._name = pluginName;
        this.init();
    }

    //面向对象，设置原型
    Plugin.prototype = {
        //初始化函数
        init: function () {
            var $this = this.element,//绑定元素
                data = this.settings.data,
                type = this.settings.type,
                obj = this;//调用对象
            this.initMapLegend(data, type);
        },
        initMapLegend: function (data, type) {
            if (type == 1) {
                this.mapLegendFirst(data);
            } else if (type == 2) {
                this.mapLegendsecond(data);
            }
        },
        mapLegendFirst: function (data) {
            var legend = '<div class="legend">' +
                '<div class="top-legend" status="unflod"><a id="togger_link" href="#">图例<em></em></a></div>' +
                '<div class="content-legend clearfix">' +
                '<ul class="list-legend">';
            //1.遍历父节点，增加一级菜单
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var id = item.facilityTypeId;
                var name = item.name;
                var checked = item.checked;
                var imgSrc = item.imgSrc;
                var ways = item.ways;
                var number = item.number;
                if (checked) {
                    legend += '<li id="li_' + id + '" class="hover">';
                } else {
                    legend += '<li id="li_' + id + '">';
                }
                legend += '<a id="a_' + id + '" href="#"><img src="' + imgSrc + '">' + name + '</a><span onclick=' + ways + '>' + number + '</span></li>';
            }
            legend += '</ul>' +
                '</div>' +
                '</div>';
            $this.append(legend);
            this.mapLegendClickHandler();
            $(".legend").animate({bottom: -$(".legend").height() + 30}, 100);
            $("#togger_link").html("图例<em></em>");
        },
        mapLegendsecond: function (data) {
            var $this = this.element;//绑定元素
            var legend = '<div class="legend">' +
                '<div class="top-legend" status="flod"><a id="togger_link" href="#">图例<em></em></a></div>' +
                '<div class="content-legend clearfix">' +
                '<ul class="list-toptitle">';
            //1.遍历父节点，增加一级菜单
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var id = i;
                var name = item.facilityTypeNameCn;
                var checked = item.checked;
                var ponclick = item.onclick;
                legend += '<li class="oneMenu">';
                legend += '<a class="checkChildbtn" id="' + id + '">' + name + '</a></li>';
            }
            //增加二级菜单，调用childInit方法
            $this.append(legend);
            this.mapLegendClickHandler();
            $(".legend").animate({bottom: -$(".legend").height() + 30}, 100);
            $("#togger_link").html("图例<em1></em1>");
            $(document.body).on('click', '.checkChildbtn,.checkInput', function (event) {
                if ($(this).parent().hasClass('oneMenu')) {
                    //unchecked
                    $(this).parent().removeClass('oneMenu');
                    eventHelper.emit('facility-unchecked', data[this.id]);
                } else {
                    //check
                    $(this).parent().addClass('oneMenu');
                    eventHelper.emit('facility-checked', data[this.id]);
                }
                // $(this).parent().addClass('oneMenu').siblings().removeClass('oneMenu');
            });
            $(document.body).on('click', '.toggleClass', function (event) {
                $(this).parent().toggleClass("hover");
            });
            //初始化显示二级菜单(不是创建)
            function checkChildId(obj) {
                //1.判断是否有高亮的一级菜单
                var oneId = obj;
                for (var i = 0; i < data.items.length; i++) {
                    var item = data.items[i];
                    var itemID = item.id;
                    //2.显示该一级菜单的二级菜单
                    var parentUl = $('#ul_' + itemID);
                    if (oneId == itemID && parentUl.hide()) {
                        parentUl.show().siblings().hide();
                    }
                }
            }
        },
        mapLegendClickHandler: function () {
            $(".top-legend").click(function () {
                if ($(".top-legend").attr("status") == "unflod") {
                    $(".legend").animate({bottom: -$(".legend").height() + 30}, 100);
                    $("#togger_link").html("图例<em1></em1>");
                    $(".top-legend").attr("status", "flod");
                } else if ($(".top-legend").attr("status") == "flod") {
                    $(".legend").animate({bottom: "10"}, 100);
                    $("#togger_link").html("图例<em></em>");
                    $(".top-legend").attr("status", "unflod");
                }
            });
        },
        remove: function () {
            this.element.off("," + pluginName);
            this.element.removeData(pluginName);
        }
    };
    $.fn[pluginName] = function (options) {
        this.each(function () {
            var el = $(this);
            if (el.data(pluginName)) {
                el.data(pluginName).remove();
            }
            el.data(pluginName, new Plugin(this, options));
        });
        return this;
    };

});