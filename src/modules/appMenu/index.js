var template = require('./menu.html');
var eventHelper = require('../../utils/eventHelper');
var appMenuController = require('controllers/appMenuController');
var menuData = require('services/mockMenu');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');

// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            menuList: [],
            isMenuToggleOff: false,
            isLoginSuccess: false,
            showToggle: false,
            showTertiaryMenu: false,
            tertiaryMenus: [{
                title: 'Menu A'
            },
                {
                    title: 'Menu B'
                },
                {
                    title: 'Menu C'
                },
                {
                    title: 'Menu D'
                },
                {
                    title: 'Menu E'
                },
                {
                    title: 'Menu F'
                },
                {
                    title: 'Menu G'
                },
                {
                    title: 'Menu H'
                },
                {
                    title: 'Menu I'
                }


            ]
        }
    },
    methods: {
        changeMenu: function (child) {
            eventHelper.emit('change-menu', child);

            //记录点击菜单的系统日志
            var formData = serviceHelper.getDefaultAjaxParam();
            formData.type = "3";//执行功能
            //功能名称
            formData.funName = child.title;

            serviceHelper.getJson( serviceHelper.getBasicPath() + "/systemLog/saveSystemLog", formData, null);
        },
        toggleOffMenu: function () {
            this.isMenuToggleOff = !this.isMenuToggleOff;
            eventHelper.emit('toggle-menu', this.isMenuToggleOff);
        },
        startPlan: function () {
            eventHelper.emit('startPlan');
            eventHelper.emit('change-menu-success', {funUrl: 'arcgis-plugin'});
            var h = this.$createElement;
            this.$notify({
                title: '实时接收预警',
                message: h('div', [h('span', {style: 'color: #f7ba2a'}, '【暴雨黄色预警信号】'), h('span', {}, '深圳市气象台2017年8月17日14时30分发布龙岗区暴雨黄色预警信号，请注意防范强降水后可能额引发的次生灾害。')]),
                type: 'warning',
                offset: 300,
                duration: 50000
            });
        },
        stopPlan: function () {
            eventHelper.emit('stopPlan');
            eventHelper.emit('change-menu-success', {funUrl: 'arcgis-plugin'});
            this.$notify({
                title: '预警结束',
                message: '暴雨黄色预警信号已解除',
                type: 'success'
            });
        },
        openTertiaryMenu: function (event, menu) {
            if (menu.customid == 'plan-start') {
                this.startPlan();
            } else if (menu.customid == 'plan-end') {
                this.stopPlan();
            } else if(menu.operType === '执行js'){
                eventHelper.emit(menu.funUrl);
            } else {
                if(menu.children.length != 0){
                    this.showTertiaryMenu = true;
                    this.currentMenu = menu;
                    this.tertiaryMenus = this.currentMenu.children;
                    $('.tertiaryMenu').css('top', event.clientY - 110);
                }else{
                    eventHelper.emit('change-menu',menu);
                }
            }

        },
        initMenu: function () {
            (function ($, sr) {
                // debouncing function from John Hann
                // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
                var debounce = function (func, threshold, execAsap) {
                    var timeout;

                    return function debounced() {
                        var obj = this, args = arguments;

                        function delayed() {
                            if (!execAsap)
                                func.apply(obj, args);
                            timeout = null;
                        }

                        if (timeout)
                            clearTimeout(timeout);
                        else if (execAsap)
                            func.apply(obj, args);

                        timeout = setTimeout(delayed, threshold || 100);
                    };
                };

                // smartresize
                jQuery.fn[sr] = function (fn) {
                    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
                };

            })(jQuery, 'smartresize');
            var $MENU_TOGGLE = $('#menu_toggle'),
                $SIDEBAR_MENU = $('#sidebar-menu'),
                $SIDEBAR_FOOTER = $('.sidebar-footer'),
                $SIDEBAR_MENU = $('#sidebar-menu');
            // TODO: This is some kind of easy fix, maybe we can improve this
            var setContentHeight = function () {
                // reset height
                $RIGHT_COL.css('min-height', $(window).height());

                var bodyHeight = $BODY.outerHeight(),
                    footerHeight = $BODY.hasClass('footer_fixed') ? 0 : $FOOTER.height(),
                    leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
                    contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

                // normalize content
                contentHeight -= $NAV_MENU.height() + footerHeight;
                contentHeight -= 50;
                $RIGHT_COL.css('min-height', contentHeight);
            };

            $SIDEBAR_MENU.find('a').on('click', function (ev) {
                var $li = $(this).parent();

                if ($li.is('.active')) {
                    $li.removeClass('active active-sm');
                    $('ul:first', $li).slideUp(function () {
                        setContentHeight();
                    });
                } else {
                    // prevent closing menu if we are on child menu
                    if (!$li.parent().is('.child_menu')) {
                        $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                        $SIDEBAR_MENU.find('li ul').slideUp();
                    }

                    $li.addClass('active');

                    $('ul:first', $li).slideDown(function () {
                        setContentHeight();
                    });
                }
            });

            // toggle small or large menu
            $MENU_TOGGLE.on('click', function () {
                if ($BODY.hasClass('nav-md')) {
                    $SIDEBAR_MENU.find('li.active ul').hide();
                    $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
                } else {
                    $SIDEBAR_MENU.find('li.active-sm ul').show();
                    $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
                }

                $BODY.toggleClass('nav-md nav-sm');

                setContentHeight();
            });

            // check active menu
            $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

            $SIDEBAR_MENU.find('a').filter(function () {
                return this.href == CURRENT_URL;
            }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
                setContentHeight();
            }).parent().addClass('active');

            // recompute content when resizing
            $(window).smartresize(function () {
                setContentHeight();
            });
            setContentHeight();
            // fixed sidebar
            if ($.fn.mCustomScrollbar) {
                $('.menu_fixed').mCustomScrollbar({
                    autoHideScrollbar: true,
                    theme: 'minimal',
                    mouseWheel: {preventDefault: true}
                });
            }
        }
    },
    mounted: function () {
        eventHelper.on('loginSuccess', function (token) {
            this.isLoginSuccess = true;
            this.$nextTick(function () {
                appMenuController.getAppMenuByUser(token, function (menus) {
                    //console.log(menus);
                    menus.forEach(function (menu) {
                        menu.openSecondary = false;
                    });
                    this.menuList.splice(0);
                    this.menuList = this.menuList.concat(menus);
                    this.$nextTick(function () {
                        this.initMenu();
                    }.bind(this));
                }.bind(this));

            }.bind(this));
        }.bind(this));
    },
    components: {}
});
module.exports = comm;