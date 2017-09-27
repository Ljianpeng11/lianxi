define(function () {
    var defaultTab = {
        id: 'arcgis-plugin',
        name: '主页',
        showClose: false,
        active: true
    }
    var currentTab = {};
    var openedTabs = [];
    return {
        getDefaultTab: function () {
            return defaultTab;
        },
        setCurrentTab: function (newTab) {
            currentTab = newTab;
        },
        setTabs: function (tabs) {
            openedTabs = tabs;
        },
        getAllTabs: function () {
            return openedTabs.slice(0);
        },
        getCurrentTab: function () {
            return $.extend(currentTab, {});
        }
    }
});