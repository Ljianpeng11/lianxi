var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
// 定义组件
var comm = Vue.extend({
    template: template,
    data: function () {
        return {
            ocxObj:{},
            isLoad:false,
            isLogin:false
        }
    },
    methods: {
        load : function (){
            this.ocxObj = $("#eLTE_PlayerOCX")[0];
            //this.regeisterOCXEvent();
            if (this.ocxObj) {
                var resultXml = this.ocxObj.ELTE_OCX_UnLoad();
                var xmlDoc = $.parseXML(resultXml);
                var result = $(xmlDoc).find("ResultCode").text();
                console.log(" ELTE_OCX_UnLoad:" +result);
                isLoad = false;

                this.ocxObj.ELTE_OCX_SetBypassBuildMedia(0);
                this.ocxObj.ELTE_OCX_SetLogPath("D:\\eLTE_Player_log");
                this.ocxObj.ELTE_OCX_SetLogLevel(0);
                var resultXml = this.ocxObj.ELTE_OCX_Load(1);
                var xmlDoc = $.parseXML(resultXml);
                var result = $(xmlDoc).find("ResultCode").text();
                console.log(" ELTE_OCX_Load:" +result);
                this.isLoad = true;
                setTimeout(function(){
                    this.login();
                }.bind(this),100);
            }
        },
        login : function () {
            if (this.ocxObj){
                var userName = "8889";
                var password = "8889";
                var serverIP = "60.210.40.198";
                var localIP = "192.168.0.107";
                var sipPort = "5064";

                var resultXml = this.ocxObj.ELTE_OCX_Login(userName, password, serverIP, localIP, sipPort);

                var xmlDoc = $.parseXML(resultXml);
                var result = $(xmlDoc).find("ResultCode").text();
                console.log(" ELTE_OCX_Login:" +result);
                this.isLogin = true;
            }
        },
        addScript : function() {
            var script = "var msg = \"EventType:\";" +
                "var isLogin = false;" +
                "msg += ulEventType;" +
                "if (ulEventType == 2) {" +
                "   var xmlDoc = $.parseXML(pEventDataXml);" +
                "   var type = $(xmlDoc).find(\"StatusType\").text();" +
                "   var value = $(xmlDoc).find(\"StatusValue\").text();" +
                "   var strResId = $(xmlDoc).find(\"ResourceID\").text();" +
                "   if (type == 15 && value == 4011){" +
                "       if(isLogin == false) {" +
                "           alert(\"login success\");" +
                "           isLogin = true;" +
                "       }" +
                "   } else if (type == 15 && value != 4011 && value != 4017) {" +
                "       if(isLogin == true) {" +
                "           alert(\"login failed\");" +
                "       }" +
                "   } else if (type == 11) {" +
                "       var strOut;" +
                "       if(value == 4003) {" +
                "           strOut = \"group[\";" +
                "           strOut += strResId;" +
                "           strOut += \"]subscribe success.\";" +
                "       } else if(value == 4004) {" +
                "           strOut = \"group[\";" +
                "           strOut += strResId;" +
                "           strOut += \"]unsubscribe success.\";" +
                "       }" +
                "       alert(strOut);" +
                "   } else if (type == 21) {" +
                "       var cause = xmlDoc.find(\"Cause\").text();" +
                "       var group = xmlDoc.find(\"AttachingGroup\").text();" +
                "       var strOut;" +
                "       if(value == 4025) {" +
                "           strOut = \"dynamic group[\";" +
                "           strOut += group;" +
                "           strOut += \"]create failed.failture =\";" +
                "           strOut += cause;" +
                "       } else if(value == 4024) {" +
                "           strOut = \"dynamic group[\";" +
                "           strOut += group;" +
                "           strOut += \"]craete success.\";" +
                "           $(\"#DgroupId\").val(group);" +
                "       }" +
                "       alert(strOut);" +
                "   }" +
                "   msg += \" type:\";" +
                "   msg += type;" +
                "   msg += \" value:\";" +
                "   msg += value;" +
                "} else if (ulEventType == 1) {" +
                "   var xmlDoc = $.parseXML(pEventDataXml);" +
                "   var type = $(xmlDoc).find(\"CallStatus\").text();" +
                "   if (type == 3003) {" +
                "       var localVideoPort = xmlDoc.find(\"LocalVideoPort\").text();" +
                "       var localAudioPort = xmlDoc.find(\"LocalAudioPort\").text();" +
                "       var remoteVideoPort = xmlDoc.find(\"RemoteVideoPort\").text();" +
                "       var remoteAudioPort = xmlDoc.find(\"RemoteAudioPort\").text();" +
                "       $(\"#localVideoPort\").val(localVideoPort);" +
                "       $(\"#localAudioPort\").val(localAudioPort);" +
                "       $(\"#remoteVideoPort\").val(remoteVideoPort);" +
                "       $(\"#remoteAudioPort\").val(remoteAudioPort);" +
                "       var param = \"<Content><MuteParam><CallType>2</CallType></MuteParam></Content>\";" +
                "       resultXml = ocx.ELTE_OCX_VolMute(xmlDoc.find(\"Callee\").text(), param);" +
                "   } else if (type == 3009) {" +
                "       $(\"#localVideoPort\").val(\"\");" +
                "       $(\"#localAudioPort\").val(\"\");" +
                "       $(\"#remoteVideoPort\").val(\"\");" +
                "       $(\"#remoteAudioPort\").val(\"\");" +
                "   } else if (type == 3011) {" +
                "       var strResID = xmlDoc.find(\"Uri\").text();" +
                "       var strMuteType = xmlDoc.find(\"SoundMute\").text();" +
                "       $(\"#resourceId\").val(strResID);" +
                "       $(\"#muteType\").val(strMuteType);" +
                "       if(confirm(strResID + \" Video call prompt\")) {" +
                "           RecvVideoPlay();" +
                "       } else {" +
                "           StopRealPlay();" +
                "       }" +
                "   } else if (type == 3006) {" +
                "       var param = \"<Content><MuteParam><CallType>2</CallType></MuteParam></Content>\";" +
                "       resultXml = ocx.ELTE_OCX_VolMute(xmlDoc.find(\"Callee\").text(), param);" +
                "   }" +
                "   if (3021 == type || 3013 == type || 3008 == type) {" +
                "       var strResID = xmlDoc.find(\"Uri\").text();" +
                "       if(3008 == type) {" +
                "           strResID = xmlDoc.find(\"Uri\").text();" +
                "       }" +
                "       StopCurrentRealPlay(strResID);" +
                "   }" +
                "   msg += \" type:\";" +
                "   msg += type;" +
                "} else if (ulEventType == 4) {" +
                "} else if (ulEventType == 5) {" +
                "   var xmlDoc = $.parseXML(pEventDataXml);" +
                "   var status = $(xmlDoc).find(\"P2pcallStatus\").text();" +
                "   var caller = $(xmlDoc).find(\"Caller\").text();" +
                "   var callee = $(xmlDoc).find(\"Callee\").text();" +
                "   if (status == 2002) {" +
                "       $(\"#p2pResId\").val(caller);" +
                "       alert(\"Call request:\" + caller);" +
                "   } else if (status == 2003) {" +
                "       alert(\"P2P accepted\");" +
                "   } else if (status == 2009 || status == 2010){" +
                "       alert(\"P2P hangup\");" +
                "   } else if (status == 2011) {" +
                "       alert(\"P2P canceled\");" +
                "   } else if (status == 2013) {" +
                "       alert(\"P2P busy\");" +
                "   } else if (status == 2017) {" +
                "       alert(\"P2P no answer\");" +
                "   } else if (status == 2020) {" +
                "       alert(\"P2P failed\");" +
                "   }" +
                "} else if (ulEventType == 6) {" +
                "   var xmlDoc = $.parseXML(pEventDataXml);" +
                "   var grpId = $(xmlDoc).find(\"GroupID\").text();" +
                "   var status = $(xmlDoc).find(\"GroupCallStatus\").text();" +
                "   var speaker = $(xmlDoc).find(\"Speaker\").text();" +
                "   $(\"#groupId\").val(grpId);" +
                "   $(\"#speakerId\").val(speaker);" +
                "} else if (ulEventType ==0 || ulEventType == 8 || ulEventType == 9 || ulEventType == 10 || ulEventType == 11) {" +
                "   msg += pEventDataXml;" +
                "}" +
                "$(\"#eventType\").val(msg);";
            var testScript = $("<script language=\"javascript\" for=\"eLTE_PlayerOCX\" event=\"ELTE_OCX_Event(ulEventType,pEventDataXml)\">debugger;</script>");
            $("#eLTE_PlayerDiv").append(testScript);
        },
        startRealPlay : function () {
            if (this.ocxObj) {
                var resId = "8003";
                var videoFormat = "D1";
                var cameraType = "0";
                var userConfirm = "0";
                var muteType = "0";

                var videoParam = "<Content>";
                videoParam +=    "<VideoParam>";
                videoParam +=    "<VideoFormat>";
                videoParam +=    videoFormat;
                videoParam +=    "</VideoFormat>";
                videoParam +=    "<CameraType>";
                videoParam +=    cameraType;
                videoParam +=    "</CameraType>";
                videoParam +=    "<UserConfirmType>";
                videoParam +=    userConfirm;
                videoParam +=    "</UserConfirmType>";
                videoParam +=    "<MuteType>";
                videoParam +=    muteType;
                videoParam +=    "</MuteType>";
                videoParam +=    "</VideoParam>";
                videoParam +=    "</Content>";

                var resultXml = this.ocxObj.ELTE_OCX_StartRealPlay(resId, videoParam);
                var xmlDoc = $.parseXML(resultXml);
                var result = $(xmlDoc).find("ResultCode").text();
                console.log(" ELTE_OCX_StartRealPlay:" +result);
                if(result==0){
                    setTimeout(function(){
                        this.startRealPlay();
                    }.bind(this),800)
                } else {
                    setTimeout(function(){
                        this.showRealPlay();
                    }.bind(this),800)
                }
            }
        },
        showRealPlay : function () {
            if (this.ocxObj) {
                var resId = "8003";
                var localVideoPort = "";
                var localAudioPort = "";
                var remoteVideoPort = "";
                var remoteAudioPort = "";
                var localIP = "192.168.0.104";
                var serverIP = "60.210.40.198";

                var localParam = "<Content>";
                localParam    += "<LocalMediaAddr>";
                localParam    += "<LocalIP>";
                localParam    += localIP;
                localParam    += "</LocalIP>";
                localParam    += "<VideoPort>";
                localParam    += localVideoPort;
                localParam    += "</VideoPort>";
                localParam    += "<AudioPort>";
                localParam    += localAudioPort;
                localParam    += "</AudioPort>";
                localParam    += "</LocalMediaAddr>";
                localParam    += "</Content>";

                var remoteParam = "<Content>";
                remoteParam    += "<RemoteMediaAddr>";
                remoteParam    += "<RemoteIP>";
                remoteParam    += serverIP;
                remoteParam    += "</RemoteIP>";
                remoteParam    += "<VideoPort>";
                remoteParam    += remoteVideoPort;
                remoteParam    += "</VideoPort>";
                remoteParam    += "<AudioPort>";
                remoteParam    += remoteAudioPort;
                remoteParam    += "</AudioPort>";
                remoteParam    += "</RemoteMediaAddr>";
                remoteParam    += "</Content>";

                var resultXml = this.ocxObj.ELTE_OCX_ShowRealPlay(resId, localParam, remoteParam);

                var xmlDoc = $.parseXML(resultXml);
                var result = $(xmlDoc).find("ResultCode").text();
                console.log(" ELTE_OCX_ShowRealPlay:" +result);
                setTimeout(function(){
                    this.setVideoPos();
                }.bind(this),800)
                //resultXml = ocx.ELTE_OCX_VolUnMute(resId, param);
                //PlaySound();
            }
        },
        setVideoPos : function (){
            if (this.ocxObj){
                var left = 0;
                var top = 0;
                var width = 500;
                var height = 400;
                var resultXml = this.ocxObj.ELTE_OCX_SetVideoWindowPos(left, top, width, height);
                var xmlDoc = $.parseXML(resultXml);
                var result = $(xmlDoc).find("ResultCode").text();
                console.log(" ELTE_OCX_SetVideoWindowPos:" +result);

                this.setGISSubscribe();
            }
        },
        getGISSubscribe : function(){
            if (this.ocxObj) {
                var resultXml = this.ocxObj.ELTE_OCX_GetGisSubscription(8003);
                alert(resultXml);
            }
        },
        setGISSubscribe : function(){
            var strGisParam = "<Content>";
            strGisParam +=    "<GISParam>";
            strGisParam +=    "<SubType>";
            strGisParam +=    "7";
            strGisParam +=    "</SubType>";
            strGisParam +=    "<ResourceList>";
            strGisParam +=    "8003";
            strGisParam +=    "</ResourceList>";
            strGisParam +=    "<Subscriber>";
            strGisParam +=    "</Subscriber>";
            strGisParam +=    "</GISParam>";
            strGisParam +=    "</Content>";

            var resultXml =  this.ocxObj.ELTE_OCX_GISSubscribe("0", strGisParam);

            var xmlDoc = $.parseXML(resultXml);
            var result = $(xmlDoc).find("ResultCode").text();
            console.log(" ELTE_OCX_GISSubscribe:" +result);
        },
        regeisterOCXEvent : function(){
            this.ocxObj.attachEvent("ELTE_OCX_Event(ulEventType,pEventDataXml)",function(){
                debugger;
            });
        },
        addIFrame : function(){
            var iframeStr = "<iframe frameborder=0 width=800 height=800 marginheight=0 marginwidth=0 scrolling=no src=></iframe>";
            $("#eLTE_PlayerDiv").append($(iframeStr));
        }
    },
    mounted: function () {
        //this.addScript();
        this.load();
        eventHelper.on("initeLTEVideo",function(param){
            this.startRealPlay();
        }.bind(this));
    },
    components: {
    }
});
module.exports = comm;