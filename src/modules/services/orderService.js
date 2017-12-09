define(['./serviceHelper','moment'], function (serviceHelper,moment) {
    return {
        getOrders:function (cb) {
            var parameter = {
                id:'queryOrder',
                parameter:{
                    createDate:moment().format('YYYY-MM-DD')
                }
            };
            $.get(serviceHelper.getPath(parameter), function (result) {
                if(!!result.status){
                    cb(result.data);
                }
            });
        },
        getMenus:function (cb) {
            $.get(serviceHelper.getPath('queryMenu'), function (result) {
                if(!!result.status){
                    cb(result.data);
                }
            });
        },
        makeOrder:function (order,totalPrice,cb) {
            var createDate = moment().format('YYYY-MM-DD');
            var parameter = {
                id:'makeOrder',
                parameter:{
                    options:order.menu.join(','),
                    name:order.name,
                    price:totalPrice,
                    createDate:createDate
                }
            };
      /*      $.ajax({
                type: "post",
                url: serviceHelper.getPath(parameter),
                dataType: "json",
                data: {name:123},
                success: function (data) {
                    alert("success");
                },
                error: function (err) {
                    alert("error : " + err);
                }
            });*/
            $.get(serviceHelper.getPath(parameter), function (result) {
                if (!!result) {
                    if (result.result) {
                        cb(true);
                    }
                }
                else {
                    errorCb();
                }
            });

        }
    }
});