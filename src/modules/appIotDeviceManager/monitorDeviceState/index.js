
$(function(){

    $.ajax({
        type: "post",
        dataType: "json",
        url: "http://" + window.location.hostname + ":32204/monitorData/getDeviceState",
        success : function (ajaxResult) {
            if (ajaxResult) {
                if (ajaxResult.success == true) {
                    var result = ajaxResult.data;
                    $("#titleID").append(result.title);
                    $("#healthCountID").append(result.healthCount);
                    $("#illCountID").append(result.illCount);
                    $("#earlyTimeID").append(result.earlyTime);
                    $("#remarkID").append(result.remark);
                } else {
                    //后台操作失败的代码
                    alert(ajaxResult.msg);
                }
            }
        }.bind(this)
    });

});



