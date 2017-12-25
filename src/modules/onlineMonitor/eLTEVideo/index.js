var template = require('./content.html');
var eventHelper = require('utils/eventHelper');
var iotController = require('controllers/iotController');
var mapHelper = require('utils/mapHelper');
// 定义组件
var comm = Vue.extend({
    template: template,
    props:["baseView"],
    data: function () {
        return {
            ocxObj:{},
            isLoad:false,
            isLogin:false,
            loginInfo:{
                userName : "8889",
                password : "8889",
                serverIP : "69.8.0.131",//60.210.40.198
                localIP : "192.168.0.107",
                sipPort : "5060"//5064
            },
            groupUserArray:[]
        }
    },
    methods: {
        load : function (){
            this.ocxObj = $("#eLTE_PlayerOCX")[0];
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
                iotController.getCurRequestInfo(function(data){
                    this.loginInfo.localIP = data.remoteIp;
                    var resultXml = this.ocxObj.ELTE_OCX_Login(this.loginInfo.userName, this.loginInfo.password, this.loginInfo.serverIP, this.loginInfo.localIP, this.loginInfo.sipPort);
                    var xmlDoc = $.parseXML(resultXml);
                    var result = $(xmlDoc).find("ResultCode").text();
                    console.log(" ELTE_OCX_Login:" +result);
                    this.isLogin = true;
                    setInterval(function(){
                        this.getGroupUsers();
                    }.bind(this),2000)
                }.bind(this));
            }
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
                        this.showRealPlay();
                    }.bind(this),800)
                } else if(result == -40006){
                    setTimeout(function(){
                        this.StopRealPlay();
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
                var localIP = this.loginInfo.localIP;
                var serverIP = this.loginInfo.serverIP;

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
            }
        },
        setGISSubscribe : function(resId){
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
        getGroupUsers : function() {
            var resultXml = this.ocxObj.ELTE_OCX_GetGroupUsers(8900);
            var xmlDoc = $.parseXML(resultXml);
            var result = $(xmlDoc).find("ResultCode").text();
            this.groupUserArray = [];
            console.log(" ELTE_OCX_GetGroupUsers:" + result);
            if (result == 0) {
                var userInfos = $(xmlDoc).find("GroupUserInfo");
                if (userInfos.length > 0) {
                    for (i = 0, len = userInfos.length; i < len; i++) {
                        this.groupUserArray.push($(userInfos[i]).find("UserID").text());
                    }
                    console.log(" ELTE_OCX_GetGroupUsersContent:" + this.groupUserArray.join(","));
                    this.setGISSubscribe(this.groupUserArray.join(","));
                }
            } else {
                setTimeout(function(){
                    this.getGroupUsers();
                }.bind(this),800);
            }
        },
        handleELTEOCXEvent:function(ulEventType,pEventDataXml){
            var msg = "EventType: ";
            var isLogin = false;
            msg +=    ulEventType;
            console.log(ulEventType+" "+pEventDataXml);
            /*if(ulEventType==4){
                this.getGroupUsers();
            }*/
            /*
            if (ulEventType == 2){
                var xmlDoc = $.parseXML(pEventDataXml);
                xmlDoc = $(xmlDoc);
                var type = xmlDoc.find("StatusType").text();
                var value = xmlDoc.find("StatusValue").text();
                var strResId = xmlDoc.find("ResourceID").text();

                if (type == 15 && value == 4011){
                    if(isLogin == false){
                        alert("login success");
                        isLogin = true;
                    }
                } else if (type == 15 && value != 4011 && value != 4017) {
                    if(isLogin == true) {
                        alert("login failed");
                    }
                } else if (type == 11) {
                    var strOut;
                    if(value == 4003) {
                        strOut = "group[";
                        strOut += strResId;
                        strOut += "]subscribe success.";
                    } else if(value == 4004) {
                        strOut = "group[";
                        strOut += strResId;
                        strOut += "]unsubscribe success.";
                    }
                    alert(strOut);
                } else if (type == 21) {
                    var cause = xmlDoc.find("Cause").text();
                    var group = xmlDoc.find("AttachingGroup").text();
                    var strOut;
                    if(value == 4025) {
                        strOut = "dynamic group[";
                        strOut += group;
                        strOut += "]create failed.failture =";
                        strOut += cause;
                    } else if(value == 4024) {
                        strOut = "dynamic group[";
                        strOut += group;
                        strOut += "]craete success.";
                        $("#DgroupId").val(group);
                    }
                    alert(strOut);
                }

                msg += " type:"
                msg += type;
                msg += " value:"
                msg += value;
            } else if (ulEventType == 1) {
                var xmlDoc = $.parseXML(pEventDataXml);
                xmlDoc = $(xmlDoc);
                var type = xmlDoc.find("CallStatus").text();
                if (type == 3003) {
                    var localVideoPort = xmlDoc.find("LocalVideoPort").text();
                    var localAudioPort = xmlDoc.find("LocalAudioPort").text();
                    var remoteVideoPort = xmlDoc.find("RemoteVideoPort").text();
                    var remoteAudioPort = xmlDoc.find("RemoteAudioPort").text();

                    //$("#localVideoPort").val(localVideoPort);
                    //$("#localAudioPort").val(localAudioPort);
                    //$("#remoteVideoPort").val(remoteVideoPort);
                    //$("#remoteAudioPort").val(remoteAudioPort);
                    //为了与界面按钮状态保持一致这里需要静音
                    var param = "<Content><MuteParam><CallType>2</CallType></MuteParam></Content>";

                    resultXml = eLTE_PlayerOCX.ELTE_OCX_VolMute(xmlDoc.find("Callee").text(), param);
                } else if (type == 3009) {
                    //$("#localVideoPort").val("");
                    //$("#localAudioPort").val("");
                    //$("#remoteVideoPort").val("");
                    //$("#remoteAudioPort").val("");
                } else if (type == 3011) {
                    var strResID = xmlDoc.find("Uri").text();
                    var strMuteType = xmlDoc.find("SoundMute").text();
                    $("#resourceId").val(strResID);
                    $("#muteType").val(strMuteType);
                    if(confirm(strResID + " Video call prompt")) {
                        //RecvVideoPlay();
                    } else {
                        //StopRealPlay();
                    }
                } else if (type == 3006) {
                    //In order to keep in line with the button state of the interface, there is a need for silence.
                    var param = "<Content><MuteParam><CallType>2</CallType></MuteParam></Content>";

                    resultXml = eLTE_PlayerOCX.ELTE_OCX_VolMute(xmlDoc.find("Callee").text(), param);
                }
                if (3021 == type || 3013 == type || 3008 == type) {
                    //alert(type);
                    var strResID = xmlDoc.find("Uri").text();
                    if(3008 == type) {
                        strResID = xmlDoc.find("Uri").text();
                    }
                    //StopCurrentRealPlay(strResID);
                }

                msg += " type:"
                msg += type;
            } else if (ulEventType == 4) {
                //GetDcUsers();
                //TriggerStatusReport();
            } else if (ulEventType == 5) {
                var xmlDoc = $.parseXML(pEventDataXml);
                xmlDoc = $(xmlDoc);
                var status = xmlDoc.find("P2pcallStatus").text();
                var caller = xmlDoc.find("Caller").text();
                var callee = xmlDoc.find("Callee").text();

                if (status == 2002) {
                    $("#p2pResId").val(caller);
                    alert("Call request:" + caller);
                } else if (status == 2003) {
                    alert("P2P accepted");
                } else if (status == 2009 || status == 2010) {
                    alert("P2P hangup");
                } else if (status == 2011) {
                    alert("P2P canceled");
                } else if (status == 2013) {
                    alert("P2P busy");
                } else if (status == 2017) {
                    alert("P2P no answer");
                } else if (status == 2020) {
                    alert("P2P failed");
                }
            } else if (ulEventType == 6) {
                var xmlDoc = $.parseXML(pEventDataXml);
                xmlDoc = $(xmlDoc);
                var grpId = xmlDoc.find("GroupID").text();
                var status = xmlDoc.find("GroupCallStatus").text();
                var speaker = xmlDoc.find("Speaker").text();

                //$("#groupId").val(grpId);
                //$("#speakerId").val(speaker);
            } else if (ulEventType ==0 || ulEventType == 9 || ulEventType == 10 || ulEventType == 11) {
                msg += pEventDataXml;
            } else if (ulEventType ==7) {
                //alert(pEventDataXml);
            } else*/
            if( ulEventType == 8){
                var Content = $($.parseXML(pEventDataXml));
                var Time =  Content.find("Time").text();
                var Altitude =  Content.find("Altitude").text();
                var Latitude =  Content.find("Latitude").text();
                var Longtitude =  Content.find("Longtitude").text();
                var ep820VideoLayer = this.baseView.map.findLayerById("ep820Video");
                //ep820VideoLayer.removeAll();
                var imgObj = {
                    url:  './img/toolbar/buliding-video.png',
                    width: "24px",
                    height: "24px"
                };
                var attribute = {
                    time:Time,
                    altitude:Altitude
                };
                var popupTemplate = {
                    title: "测试",
                    content: "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('initeLTEVideo','1');\"><span>打开视频</span></button><button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('SDSSendMessage');\"><span>发短信</span></button>"
                };

                var graphic = mapHelper.createPictureMarkSymbol(ep820VideoLayer, Number(Longtitude), Number(Latitude), imgObj,attribute,popupTemplate);

            } else if (ulEventType == 1) {
                var xmlDoc = $.parseXML(pEventDataXml);
                var type = $(xmlDoc).find("CallStatus").text();
                if (type == 3011) {
                    var strResID = $(xmlDoc).find("Uri").text();
                    var strMuteType = $(xmlDoc).find("SoundMute").text();
                    if (confirm(strResID + " Video call prompt")) {
                        this.RecvVideoPlay(strResID);
                    } else {
                        //StopRealPlay();
                    }
                }
            }
            //$("#eventType").val(msg);
        },
        RecvVideoPlay : function (resId){
            var resultXml = this.ocxObj.ELTE_OCX_RecvVideoPlay(resId, "0");
            var xmlDoc = $.parseXML(resultXml);
            var result = $(xmlDoc).find("ResultCode").text();
            console.log("ELTE_OCX_RecvVideoPlay:" +result);
            this.startRealPlay();
        },
        SDSSendMessage:function(){
            var content = window.prompt("请输入短信内容", "");
            if(content!=""){
                var strSDSParam = "<Content>";
                strSDSParam +=    "<SDSType>";
                strSDSParam +=    "0001";
                strSDSParam +=    "</SDSType>";
                strSDSParam +=    "<MsgBody>";
                strSDSParam +=    content
                strSDSParam +=    "</MsgBody>";
                strSDSParam +=    "<Receiver>";
                strSDSParam +=    "8003"
                strSDSParam +=    "</Receiver>";
                strSDSParam +=    "<AttachFileList>";
                strSDSParam +=    "</AttachFileList>";
                strSDSParam +=    "</Content>";

                var resultXml = this.ocxObj.ELTE_OCX_SDSSendMessage("8889", strSDSParam);

                var xmlDoc = $.parseXML(resultXml);
                var result = $(xmlDoc).find("ResultCode").text();
                console.log("ELTE_OCX_SDSSendMessage:" +result);
            } else {
                this.$message({
                    type: 'info',
                    message: '发送内容不能为空'
                });
            }

        },
        StopRealPlay : function () {
            var resId = "8003";
            var resultXml = this.ocxObj.ELTE_OCX_StopRealPlay(resId);
            var xmlDoc = $.parseXML(resultXml);
            var result = $(xmlDoc).find("ResultCode").text();
            console.log(" ELTE_OCX_StopRealPlay:" +result);
            this.startRealPlay();
        }
    },
    mounted: function () {
        this.load();
        eventHelper.on("initeLTEVideo",function(param){
            this.startRealPlay();
        }.bind(this));
        eventHelper.on("handleELTEOCXEvent",function(eventInfo){
            var ulEventType = eventInfo[0];
            var pEventDataXml = eventInfo[1];
            this.handleELTEOCXEvent(ulEventType,pEventDataXml);
        }.bind(this));
        eventHelper.on("SDSSendMessage",function(){
            this.SDSSendMessage();
        }.bind(this));
    },
    components: {
    }
});
module.exports = comm;