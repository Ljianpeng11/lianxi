//eWater表单验证

module.exports = Vue.extend({
    data: function () {
        return {
            //当前最大html元素的id
            mainContentDivId: "",
            //表单验证规则
            rules: [],
        }
    },
    methods: {
        /**
         * 添加不能为空规则
         * @param controlId 控件元素id
         * @param title 字段中文名
         */
        addNotNullRule: function (controlId, title) {
            var rule = {};
            //规则类型，notNull=不能为空
            rule.type = "notNull";
            rule.controlId = controlId;
            rule.title = title;
            this.rules.push(rule);
        },
        /**
         * 验证，通常在保存前调用
         * 验证不通过的字段会在界面标识出
         * @returns {boolean} 验证通过返回true，不通过返回false
         */
        valid: function () {
            var rules = this.rules;
            //遍历规则，逐个验证
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];

                //不能为空
                if (rule.type === "notNull") {
                    //获取控件的值
                    var $control = $("#" + rule.controlId, $("#" + this.mainContentDivId));
                    var value = $control.val();

                    if (!!value) {
                        if (rule.validResult !== true) {
                            //删除验证错误信息
                            this.clearNotNullResult($control);
                        }
                        //此规则验证结果
                        rule.validResult = true;
                    }
                    else {
                        if (rule.validResult !== false) {
                            //添加验证错误信息
                            var $formGroup = $control.parent().parent();
                            $formGroup.addClass("has-error");

                            $control.after('<span class="help-block">请输入 ' + rule.title + '</span>');
                        }
                        //此规则验证结果
                        rule.validResult = false;
                    }
                }
            }

            //如果所有规则验证都通过，那验证通过，否则不通过
            if (rules.filter(t => t.validResult === false).length > 0) {
                return false;
            }
            else {
                return true;
            }
        },
        /**
         * 清除验证结果在界面的痕迹
         */
        clearValidResult: function () {
            var rules = this.rules;
            //遍历规则，逐个验证
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];

                //不能为空
                if (rule.type === "notNull") {
                    //获取控件的值
                    var $control = $("#" + rule.controlId, $("#" + this.mainContentDivId));

                    //删除验证错误信息
                    this.clearNotNullResult($control);

                    //此规则验证结果
                    rule.validResult = null;
                }
            }
        },
        //清除不能为空验证的痕迹
        clearNotNullResult: function ($control) {
            //删除验证错误信息
            var $formGroup = $control.parent().parent();
            $formGroup.removeClass("has-error");

            $control.nextAll('.help-block').remove();
        }
    }
});