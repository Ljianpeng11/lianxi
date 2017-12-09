//moment.js（日期时间第三方js库） demo
//其他使用方法可以baidu或者访问moment.js的官网http://momentjs.cn/docs/
var moment = require('moment');

module.exports = {
    main: function () {
        //debugger方便看变量值，不要删
        debugger;

        //js自带的Date类获取当前时间
        var d1 = new Date();

        //moment获取当前时间
        var d2 = moment();

        //js Date转moment Date
        d2 = moment(new Date());

        //moment Date转js Date
        d1 = d2.toDate();

        //按指定格式输出字符串
        //输出年月日时分秒
        //PS：注意区分大小写，例如代表月的MM不能是小写，格式跟java不完全相同
        var s1 = moment().format("YYYY-MM-DD HH:mm:ss");
        //输出年月日
        s1 = moment().format("YYYY-MM-DD");

        //创建指定的日期时间
        //创建指定日期，参数1指具体日期，参数2是参数1的格式
        d2 = moment('2012-05-25', 'YYYY-MM-DD');
        //创建指定日期时间
        d2 = moment('2012-05-25 13:23:20', 'YYYY-MM-DD HH:mm:ss');

        //通过js Date创建
        //注意参数2也就是月份从0开始，例如9代表的是10月
        d2 = moment(new Date(2011, 9, 16));

        //获取具体的值
        //以下分别是年月日是分秒
        var v1 = moment().year();
        var v2 = moment().month();
        var v3 = moment().date();
        var v4 = moment().hour();
        var v5 = moment().minute();
        var v6 = moment().second();

        //修改具体的值
        d2 = moment();
        //以下分别修改年月日时分秒，注意看修改后的日期时间
        d2.set('year', 2013);
        d2.set('month', 3);
        d2.set('date', 1);
        d2.set('hour', 13);
        d2.set('minute', 20);
        d2.set('second', 30);
        s1 = d2.format("YYYY-MM-DD HH:mm:ss");
    }
};