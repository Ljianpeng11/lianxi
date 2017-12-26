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
                localIP : "192.168.43.31",
                sipPort : "5060"//5064
            },
            groupUserArray:[],
            gpsInterval : null,
            groupUsers:[]
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
                    //this.loginInfo.localIP = data.remoteIp;
                    var resultXml = this.ocxObj.ELTE_OCX_Login(this.loginInfo.userName, this.loginInfo.password, this.loginInfo.serverIP, this.loginInfo.localIP, this.loginInfo.sipPort);
                    var xmlDoc = $.parseXML(resultXml);
                    var result = $(xmlDoc).find("ResultCode").text();
                    console.log(" ELTE_OCX_Login:" +result);
                    this.isLogin = true;
                    if(!this.gpsInterval){
                        this.gpsInterval = setInterval(function(){
                            this.getGroupUsers();
                        }.bind(this),2000);
                    }
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
                this.SetTitleText("8003");
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
            strGisParam +=    resId;
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
                        this.GetUserInfo($(userInfos[i]).find("UserID").text());
                        this.setGISSubscribe($(userInfos[i]).find("UserID").text());
                    }
                    console.log(" ELTE_OCX_GetGroupUsersContent:" + this.groupUserArray.join(","));
                    //this.setGISSubscribe(this.groupUserArray.join(","));
                }
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
                clearInterval(this.gpsInterval);
                this.redrawMapGraphic(pEventDataXml);
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
            } else if (ulEventType == 5) {
                var xmlDoc = $.parseXML(pEventDataXml);
                var status = $(xmlDoc).find("P2pcallStatus").text();
                var caller = $(xmlDoc).find("Caller").text();
                var callee = $(xmlDoc).find("Callee").text();

                if (status == 2002) {
                    //指示调度台收到点呼请求
                    alert("Call request:" + caller);
                    this.ocxObj.ELTE_OCX_P2PRecv(caller);
                } else if (status == 2003) {
                    //指示调度台（做主叫时）对端已接听
                    alert("P2P accepted");
                } else if (status == 2009 || status == 2010) {
                    // 指示对端已挂断
                    alert("P2P hangup");
                } else if (status == 2011) {
                    //指示点呼请求已取消
                    alert("P2P canceled");
                } else if (status == 2013) {
                    //指示对端忙
                    alert("P2P busy");
                } else if (status == 2017) {
                    //指示对端无应答
                    alert("P2P no answer");
                } else if (status == 2020) {
                    //指示音频流组织失败
                    alert("P2P failed");
                }
            }
            //$("#eventType").val(msg);
        },
        RecvVideoPlay : function (resId){
            var resultXml = this.ocxObj.ELTE_OCX_RecvVideoPlay(resId, "0");
            var xmlDoc = $.parseXML(resultXml);
            var result = $(xmlDoc).find("ResultCode").text();
            console.log("ELTE_OCX_RecvVideoPlay:" +result);
            this.SetTitleText(resId);
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
        },
        GetUserInfo : function (userId){
            var resultXml = this.ocxObj.ELTE_OCX_GetUserInfo(userId);
            var xmlDoc = $.parseXML(resultXml);
            var result = $(xmlDoc).find("ResultCode").text();
            var user = null;
            for(var i=0,len=this.groupUsers.length;i<len;i++){
                if(this.groupUsers[i].userId == userId){
                    user = this.groupUsers[i];
                    break;
                }
            }
            if(result==0&&user==null){
                var userObj = {};
                userObj.userId=$(xmlDoc).find("UserID").text();
                userObj.userName=$(xmlDoc).find("UserName").text();
                userObj.userCategory=$(xmlDoc).find("UserCategory").text();
                userObj.userPriority=$(xmlDoc).find("UserPriority").text();
                userObj.p2pstatus="未连接";
                userObj.time=0;
                userObj.altitude =0;
                userObj.latitude =  0;
                userObj.longtitude = 0;
                this.groupUsers.push(userObj);
            }
        },
        redrawMapGraphic : function (pEventDataXml){
            var Content = $($.parseXML(pEventDataXml));
            var userId =  Content.find("ResourceID").text();
            var time =  Number(Content.find("Time").text());
            var altitude =  Number(Content.find("Altitude").text());
            var latitude =  Number(Content.find("Latitude").text());
            var longtitude =  Number(Content.find("Longtitude").text());

            if(latitude>0&&longtitude>0){
                var ep820VideoLayer = this.baseView.map.findLayerById("ep820Video");
                var graphic = null;
                var graphic = ep820VideoLayer.graphics.find(function(graphic){
                    return graphic.attributes&&graphic.attributes.userId === userId;
                });
                if(graphic!=null) {
                    var point = mapHelper.createPoint(longtitude,latitude);
                    graphic.attributes.time = this.fmtDate(time);
                    graphic.attributes.altitude = altitude;
                    graphic.attributes.latitude = latitude;
                    graphic.attributes.longtitude = longtitude;
                    graphic.geometry = point;
                    var imgObj = {
                        url: './img/toolbar/buliding-video.png',
                        width: "24px",
                        height: "24px"
                    };
                    var popupTemplate = {
                        title: graphic.attributes.userName,
                        content: "<p>用户编号：{userId}</p>"+
                        "<p>语音状态：{p2pstatus}</p>"+
                        "<p>GPS上报时间：{time}</p>"+
                        "<p>高程：{altitude}</p>"+
                        "<p>经度：{longtitude}</p>"+
                        "<p>纬度：{latitude}</p>"+
                        "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('initeLTEVideo','1');\"><span>打开视频</span></button>" +
                        "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('SDSSendMessage');\"><span>发短信</span></button>"+
                        "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('p2p');\"><span>语音</span></button>"
                    };
                    var graphic_new = mapHelper.createPictureMarkSymbol(ep820VideoLayer, longtitude,latitude, imgObj, graphic.attributes, popupTemplate);

                    ep820VideoLayer.remove(graphic);
                } else {
                    var userObj = null;
                    for(var i=0,len=this.groupUsers.length;i<len;i++){
                        if(this.groupUsers[i].userId == userId){
                            userObj = this.groupUsers[i];
                            break;
                        }
                    }
                    if(userObj!=null) {
                        userObj.time = this.fmtDate(time);
                        userObj.altitude = altitude;
                        userObj.latitude = latitude;
                        userObj.longtitude = longtitude;
                        var imgObj = {
                            url: './img/toolbar/buliding-video.png',
                            width: "24px",
                            height: "24px"
                        };
                        var popupTemplate = {
                            title: userObj.userName,
                            content: "<p>用户编号：{userId}</p>"+
                                    "<p>语音状态：{p2pstatus}</p>"+
                                    "<p>GPS上报时间：{time}</p>"+
                                    "<p>高程：{altitude}</p>"+
                                    "<p>经度：{longtitude}</p>"+
                                    "<p>纬度：{latitude}</p>"+
                                    "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('initeLTEVideo','1');\"><span>打开视频</span></button>" +
                                    "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('SDSSendMessage');\"><span>发短信</span></button>"+
                                    "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('p2p');\"><span>语音</span></button>"
                        };

                        var graphic = mapHelper.createPictureMarkSymbol(ep820VideoLayer, longtitude, latitude, imgObj, userObj, popupTemplate);
                    } else {
                        debugger;
                    }
                }
            }
        },
        SetTitleText : function (userId) {
            var userObj = null;
            for(var i=0,len=this.groupUsers.length;i<len;i++){
                if(this.groupUsers[i].userId == userId){
                    userObj = this.groupUsers[i];
                    break;
                }
            }
            var resultXml = this.ocxObj.ELTE_OCX_SetTitleText(userObj.userName+"实时回传视频");
            var xmlDoc = $.parseXML(resultXml);
            var result = $(xmlDoc).find("ResultCode").text();
            console.log(" ELTE_OCX_SetVideoWindowPos:" +result);
        },
        fmtDate : function (obj){
            var date =  new Date(obj);
            var y = 1900+date.getYear();
            var m = "0"+(date.getMonth()+1);
            var d = "0"+date.getDate();
            return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
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
        eventHelper.on("p2p",function(){
            this.ocxObj.ELTE_OCX_P2PDial("8003");
        }.bind(this));
    },
    components: {
    }
});
module.exports = comm;