define(function () {
    return {
        init: function () {
            String.prototype.startsWith = function (str) {
                var reg = new RegExp("^" + str);
                return reg.test(this);
            }
//测试ok，直接使用str.endWith("abc")方式调用即可
            String.prototype.endsWith = function (str) {
                var reg = new RegExp(str + "$");
                return reg.test(this);
            }
        }
    }
})