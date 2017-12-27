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
                localIP : "192.168.43.32",
                sipPort : "5060"//5064
            },
            groupUserArray:[],
            gpsInterval : null,
            groupUsers:[],
            ocxStatus:"eLTE控件加载中",
            traceObj :null
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
                if(result!=0){
                    this.ocxStatus="eLTE控件加载失败";
                }
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
                    if(result!=0){
                        this.ocxStatus="eLTE控件登录失败";
                    }
                    if(!this.gpsInterval){
                        this.gpsInterval = setInterval(function(){
                            this.getGroupUsers();
                        }.bind(this),2000);
                    }
                }.bind(this));
            }
        },
        startRealPlay : function (resId) {
            if (this.ocxObj) {
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
                this.SetTitleText(resId);
                if(result==0){
                    setTimeout(function(){
                        this.showRealPlay(resId);
                    }.bind(this),800)
                } else if(result == -40006){
                    setTimeout(function(){
                        this.StopRealPlay(resId);
                    }.bind(this),800)
                }
            }
        },
        showRealPlay : function (resId) {
            if (this.ocxObj) {
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
                    this.setVideoPos(resId);
                }.bind(this),800)
            }
        },
        setVideoPos : function (resId){
            if (this.ocxObj){
                var realPostion = this.getGraphicPosition(resId);
                var left = realPostion[0];
                var top = realPostion[1];
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
            this.ocxStatus="eLTE控件加载成功";
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
                    //alert("Call request:" + caller);
                    this.ocxObj.ELTE_OCX_P2PRecv(caller);
                } else if (status == 2003) {
                    //指示调度台（做主叫时）对端已接听
                    //alert("P2P accepted");
                } else if (status == 2009 || status == 2010) {
                    // 指示对端已挂断
                    //alert("P2P hangup");
                } else if (status == 2011) {
                    //指示点呼请求已取消
                    //alert("P2P canceled");
                } else if (status == 2013) {
                    //指示对端忙
                    //alert("P2P busy");
                } else if (status == 2017) {
                    //指示对端无应答
                    //alert("P2P no answer");
                } else if (status == 2020) {
                    //指示音频流组织失败
                    //alert("P2P failed");
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
            this.startRealPlay(resId);
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
        SDSSendMessageAll:function(content){
            for(var i=0,len=this.groupUsers.length;i<len;i++){
                var strSDSParam = "<Content>";
                strSDSParam +=    "<SDSType>";
                strSDSParam +=    "0001";
                strSDSParam +=    "</SDSType>";
                strSDSParam +=    "<MsgBody>";
                strSDSParam +=    content
                strSDSParam +=    "</MsgBody>";
                strSDSParam +=    "<Receiver>";
                strSDSParam +=    this.groupUsers[i].userId
                strSDSParam +=    "</Receiver>";
                strSDSParam +=    "<AttachFileList>";
                strSDSParam +=    "</AttachFileList>";
                strSDSParam +=    "</Content>";

                var resultXml = this.ocxObj.ELTE_OCX_SDSSendMessage("8889", strSDSParam);

                var xmlDoc = $.parseXML(resultXml);
                var result = $(xmlDoc).find("ResultCode").text();
                console.log("ELTE_OCX_SDSSendMessage:" +result)
            }
            ;
        },
        StopRealPlay : function (resId) {
            var resultXml = this.ocxObj.ELTE_OCX_StopRealPlay(resId);
            var xmlDoc = $.parseXML(resultXml);
            var result = $(xmlDoc).find("ResultCode").text();
            console.log(" ELTE_OCX_StopRealPlay:" +result);
            this.startRealPlay(resId);
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
                var graphic = ep820VideoLayer.graphics.find(function(item){
                    return item.attributes&&item.attributes.userId === userId;
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
                        content: "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('initeLTEVideo','{userId}');\"><span>打开视频</span></button>" +
                                "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('SDSSendMessage','{userId}');\"><span>发短信</span></button>"+
                                "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('p2p','{userId}');\"><span>语音</span></button>"+
                                "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('eLTEtrace','{userId}');\"><span>展示轨迹</span></button>"+
                                "<p>用户编号：{userId}</p>"+
                                "<p>语音状态：{p2pstatus}</p>"+
                                "<p>GPS上报时间：{time}</p>"+
                                "<p>高程：{altitude}</p>"+
                                "<p>经度：{longtitude}</p>"+
                                "<p>纬度：{latitude}</p>"
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
                            content: "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('initeLTEVideo','{userId}');\"><span>打开视频</span></button>" +
                                    "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('SDSSendMessage','{userId}');\"><span>发短信</span></button>"+
                                    "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('p2p','{userId}');\"><span>语音</span></button>"+
                                    "<button type=\"button\" class=\"el-button detailBtn el-button--primary\" onclick=\"eventHelper.emit('eLTEtrace','{userId}');\"><span>展示轨迹</span></button>"+
                                    "<p>用户编号：{userId}</p>"+
                                    "<p>语音状态：{p2pstatus}</p>"+
                                    "<p>GPS上报时间：{time}</p>"+
                                    "<p>高程：{altitude}</p>"+
                                    "<p>经度：{longtitude}</p>"+
                                    "<p>纬度：{latitude}</p>"
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
            var resultXml = this.ocxObj.ELTE_OCX_SetTitleText(userObj.userName?userObj.userName:""+"实时回传视频");
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
        },
        getGraphicPosition : function (resId){
            var ep820VideoLayer = this.baseView.map.findLayerById("ep820Video");
            var graphic = null;
            var graphic = ep820VideoLayer.graphics.find(function(graphic){
                return graphic.attributes&&graphic.attributes.userId === resId;
            });
            if(graphic!=null){
                var screenPoint = this.baseView.toScreen(graphic.geometry);
                return [screenPoint.x,screenPoint.y-240];
                debugger;
            } else {
                return [0,0];
            }
        },
        eLTEtrace : function (resId){
            var ep820VideoLayer = this.baseView.map.findLayerById("ep820Video");
            if(this.traceObj){
                ep820VideoLayer.remove(this.traceObj);
                this.traceObj = null;
            } else {
                var graphic = null;
                var graphic = ep820VideoLayer.graphics.find(function(graphic){
                    return graphic.attributes&&graphic.attributes.userId === resId;
                });
                if(graphic!=null){
                    var points = [[37.16078158522525,117.81400013975333],
                        [37.16074587770515,117.8141280984407],
                        [37.16074888897242,117.81418424076709],
                        [37.1607935393567,117.81417695695299],
                        [37.16102850350542,117.81419978340911],
                        [37.1610475483038,117.81421037864804],
                        [37.161070900816625,117.81418172600505],
                        [37.161096899650616,117.81414094469105],
                        [37.1610836787862,117.81411498596941],
                        [37.16119627518448,117.81411001662183],
                        [37.161205114880595,117.81410818753363],
                        [37.16126327184435,117.8141191390979],
                        [37.16135662939532,117.81412899670694],
                        [37.161457949337915,117.814131308204],
                        [37.1615380202964,117.81413361781583],
                        [37.16161645333695,117.81411977998056],
                        [37.16168398353028,117.81412090990743],
                        [37.16175577027065,117.81410897065686],
                        [37.16185020227207,117.81410772676587],
                        [37.162015808306734,117.81409272450219],
                        [37.16209385263507,117.8140948476217],
                        [37.162181347626735,117.81407841370505],
                        [37.16228538388643,117.81408488881539],
                        [37.16236405114765,117.81409024110502],
                        [37.16246146015366,117.81409131841058],
                        [37.16253988520383,117.81407545704121],
                        [37.162617653139556,117.81409080769323],
                        [37.16269327861203,117.8141747511878],
                        [37.16276369354736,117.81417729781211],
                        [37.16280246874191,117.81417244836167],
                        [37.162841575558296,117.81408505383133],
                        [37.162946644801835,117.81406212256103],
                        [37.16304443740392,117.81405307344043],
                        [37.163140261561054,117.81404383851068],
                        [37.16320771904871,117.81402065417394],
                        [37.16329938506756,117.81404914725066],
                        [37.16338449906765,117.81406907529538],
                        [37.163443371814516,117.81415709355424],
                        [37.16345461502476,117.81424728891254],
                        [37.1634383055143,117.81436462470755],
                        [37.163457798149444,117.81447214716638],
                        [37.163473548310364,117.8146047668387],
                        [37.163482269513615,117.81472726239771],
                        [37.16351239408901,117.81482591613536],
                        [37.163534309185195,117.81491460373724],
                        [37.16354820847493,117.8150527224036],
                        [37.16354336067367,117.81519845962603],
                        [37.163541895596644,117.81533257697973],
                        [37.16355487421709,117.81545701172585],
                        [37.1635328232259,117.81547216789643],
                        [37.16346636731724,117.81548617245996],
                        [37.16334999677576,117.81540798516444],
                        [37.16394538647302,117.8157284231508],
                        [37.16394538647302,117.8157284231508],
                        [37.163225019262065,117.81542539865904],
                        [37.16328774972514,117.81545000293711],
                        [37.16333815508235,117.81550191089045],
                        [37.16333815508235,117.81550191089045],
                        [37.1633613640947,117.81547143623544],
                        [37.16336031578723,117.81550736331818],
                        [37.16336031578723,117.81550736331818],
                        [37.16343435633892,117.81541375685886],
                        [37.16341688850374,117.81542356172542],
                        [37.16341688850374,117.81542356172542],
                        [37.16341688850374,117.81542356172542],
                        [37.163281988061954,117.81548068524695],
                        [37.163281988061954,117.81548068524695],
                        [37.163192600874304,117.81567044560134],
                        [37.163165233419825,117.81554235197663],
                        [37.16316815320486,117.81553606327621],
                        [37.16350449190376,117.81537215297837],
                        [37.163526181692596,117.8154765933411],
                        [37.16351873273486,117.81547633521777],
                        [37.163359987031114,117.81547781649346],
                        [37.1634207913685,117.81547035620915],
                        [37.163487993117855,117.81542618462178],
                        [37.16346981414402,117.81541950380337],
                        [37.163432897161776,117.81542847683423],
                        [37.16339678303287,117.81541440094556],
                        [37.16339610154788,117.81541373151556],
                        [37.16319761337835,117.81559700700771],
                        [37.16340429533117,117.81541138681182],
                        [37.163527562749586,117.81527678441724],
                        [37.16340810366018,117.81537484053466],
                        [37.16330331468871,117.81551051810365],
                        [37.16337513324103,117.81549480539674],
                        [37.16344997308281,117.81550015227255],
                        [37.16349618890008,117.81550366690253],
                        [37.16354022622144,117.81537037259243],
                        [37.16353117804502,117.81528794111051],
                        [37.16354307238356,117.81518906443326],
                        [37.163548080817314,117.81506477950279],
                        [37.1634893754099,117.81498916300635],
                        [37.163511199863244,117.8148367464091],
                        [37.16350795341627,117.81470730014782],
                        [37.16347748066312,117.81455708970583],
                        [37.163465650305994,117.8144437205896],
                        [37.16345878833205,117.81432403760944],
                        [37.16344375254366,117.81418540494148],
                        [37.16337210440587,117.81411253742809],
                        [37.16327658386517,117.814085027256],
                        [37.16320349061284,117.81405318208986],
                        [37.163117066103716,117.81405640405109],
                        [37.16301345166632,117.81406873476011],
                        [37.16290625055766,117.8140630474708],
                        [37.16283139935949,117.81414329726869],
                        [37.16281471832957,117.8142066623221],
                        [37.162774615657256,117.81416720194382],
                        [37.1628940270673,117.81420496237668],
                        [37.16281840520765,117.81417655027042],
                        [37.16278375032819,117.81430612626956],
                        [37.16283014620518,117.81424898647325],
                        [37.162796709619954,117.81421943365456],
                        [37.16277351655381,117.81420801423855],
                        [37.16277907043083,117.81419138925243],
                        [37.16279074142407,117.81420211922146],
                        [37.16279324720823,117.8141918176744],
                        [37.16279301436931,117.81417904289694],
                        [37.162717529267255,117.81420408321411],
                        [37.16265118810647,117.81416822315926],
                        [37.16257839705404,117.81416725638972],
                        [37.16254432830892,117.81414840371797],
                        [37.16245826393334,117.81412342694503],
                        [37.162363546128795,117.81411818171183],
                        [37.162301921752025,117.81412841791287],
                        [37.16225283120054,117.81408504662454],
                        [37.16215103499446,117.81397307304896],
                        [37.16219058196727,117.81412120351682],
                        [37.1621982694548,117.8141635148902]];
                    points.forEach(function(item){
                        var y = item[0];
                        item[0] = item[1];
                        item[1] = y;
                    })
                    points.push([graphic.geometry.x,graphic.geometry.y]);

                    var styleObj = {
                        color: [226, 119, 40],
                        width: 4
                    };
                    this.traceObj = mapHelper.createPolyline(ep820VideoLayer,points,styleObj);
                }
            }
        },
        SDSSendMessageFile:function(content){
            debugger;
            var strSDSParam = "<Content>";
            strSDSParam +=    "<SDSType>";
            strSDSParam +=    "0004";
            strSDSParam +=    "</SDSType>";
            strSDSParam +=    "<MsgBody>";
            strSDSParam +=    content
            strSDSParam +=    "</MsgBody>";
            strSDSParam +=    "<Receiver>";
            strSDSParam +=    "8003"
            strSDSParam +=    "</Receiver>";
            strSDSParam +=    "<AttachFileList>";
            strSDSParam +=    "<AttachFile>";
            strSDSParam +=    "d:\\\\1.jpg";
            strSDSParam +=    "</AttachFile>";
            strSDSParam +=    "</AttachFileList>";
            strSDSParam +=    "</Content>";

            var resultXml = this.ocxObj.ELTE_OCX_SDSSendMessage("8889", strSDSParam);

            var xmlDoc = $.parseXML(resultXml);
            var result = $(xmlDoc).find("ResultCode").text();
            console.log("ELTE_OCX_SDSSendMessage:" +result);
        },
    },
    mounted: function () {
        this.load();
        eventHelper.on("initeLTEVideo",function(param){
            this.startRealPlay(param);
            this.ocxObj.ELTE_OCX_P2PDial(param);
        }.bind(this));
        eventHelper.on("handleELTEOCXEvent",function(eventInfo){
            var ulEventType = eventInfo[0];
            var pEventDataXml = eventInfo[1];
            this.handleELTEOCXEvent(ulEventType,pEventDataXml);
        }.bind(this));
        eventHelper.on("SDSSendMessage",function(param){
            this.SDSSendMessage();
        }.bind(this));
        eventHelper.on("p2p",function(param){
            this.ocxObj.ELTE_OCX_P2PDial(param);
        }.bind(this));
        eventHelper.on("SDSSendMessageAll",function(content){
            this.SDSSendMessageAll(content);
        }.bind(this));
        eventHelper.on("eLTEtrace",function(resId){
            this.eLTEtrace(resId);
        }.bind(this));
        eventHelper.on("SDSSendMessageFile",function(content){
            this.SDSSendMessageFile(content);
        }.bind(this));
    },
    components: {
    }
});
module.exports = comm;