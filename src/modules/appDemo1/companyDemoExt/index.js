//引用组件或视图

//此功能对应的视图（html）
var template = require('./companyDemoExt.html');
//用于获取token，url头部等
var serviceHelper = require('services/serviceHelper.js');
//事件
var eventHelper = require('utils/eventHelper');
//增删改列表基类
var crudBase = require('modules/common/crud/crudBase');
//增删改列表容器（代表一个表格的列表）
var container = require('modules/common/crud/listContainer');

//require进一个vue组件
var componentDemo = require('modules/appDemo1/companyDemoExt/componentDemo');
//layui弹窗demo
var layuiOpenFormDemo = require('modules/appDemo1/companyDemoExt/layuiOpenFormDemo');
//格子表单demo
var gridFormDemo = require('modules/appDemo1/companyDemoExt/gridFormDemo');
//ECMAScript6 demo
var es6 = require('modules/appDemo1/companyDemoExt/es6/index.js');
//tabDemo
var tabDemo = require('modules/appDemo1/companyDemoExt/tabDemo');
//moment.js Demo
var momentDemo = require('modules/appDemo1/companyDemoExt/momentDemo');

//从基类crudBase继承，crudBase是增删改功能的基类
var comm = crudBase.extend({
    //设置模板
    template: template,
    data: function () {
        return {
            //容器（员工）
            //一个表一个容器，但主表的容器在基类定义了，所以只有子表容器需要定义
            containerEmployee: {},
        }
    },
    //引用vue组件需要这样定义，详情请看vue官网关于组件的介绍
    components: {
        //引用vue组件
        'componentDemo': componentDemo,
        //layui弹窗demo
        'layuiOpenFormDemo': layuiOpenFormDemo,
        //格子表单demo
        'gridFormDemo': gridFormDemo,
        //tab demo
        'tabDemo': tabDemo
    },
    //vue对象created事件，vue对象实例化时触发，此时DOM（页面）还没加载完成
    created: function () {
        //容器（主表）
        //列表容器定义，一个容器代表一个表的编辑，有子表就要为子表设置容器
        //默认容器叫containerMain，第二个后之后的容器名称自己命名
        //容器必须要在created时new，而不能在mounted，否则vue绑定会有错
        this.containerMain = new container({
            data: function () {
                return {
                    //动态下拉框demo所有值
                    dynamicSelectItems: [],
                    //是否添加默认的操作列（当需要自定义操作列的功能时可以设为false）
                    addDefaultOperateColumn: false,
                    //多个checkbox的值可以绑定到一个数组，数组内是选中的值的value（反之没选中的checkbox的值就不会存在于数组）
                    checkboxValues: [],
                    //radio的绑定值
                    radioValue: "",
                    //是否分页
                    pagination: true,
                    //是否能编辑（影响编辑功能，例如双击编辑功能）
                    canEdit: true,
                    //查询条件，创立时间
                    createDates: "",
                }
            },
            methods: {
                //初始化表单
                initForm: function () {
                    var formData = serviceHelper.getDefaultAjaxParam();

                    serviceHelper.getJson(serviceHelper.getBasicPath() + this.controllerUrl + "/getInitFormValue", formData, function (result) {
                        //动态select项demo
                        //[{value: "", text: ""}].concat()意思是在数组前面插入一个值为空的项，让用户可以选空值
                        this.dynamicSelectItems = [{value: "", text: ""}].concat(result.dynamicSelectItems);
                    }.bind(this));
                },
                //获取自定义查询条件
                getCustomQueryParam: function () {
                    //返回结果的类型是object
                    var formData = {};
                    //可以通过如下方式添加任意值
                    formData.abcId = 888;

                    //查询条件，创立时间
                    if (this.createDates && this.createDates[0] && this.createDates[1]) {
                        //注意本例的日期控件格式是date，也就是日期，年月日，因此用moment转换成字符串格式是YYYY-MM-DD。但如果是其他格式，例如datetime，format的值就会不同，详情请看moment的demo
                        formData.createDateStart = moment(this.createDates[0]).format("YYYY-MM-DD");
                        formData.createDateEnd = moment(this.createDates[1]).format("YYYY-MM-DD");
                    }

                    return formData;
                },
                //获取自定义保存的值
                getCustomSaveValue: function () {
                    //返回结果的类型是object
                    var formData = {};
                    //可以通过如下方式添加任意值
                    formData.qweId = 999;

                    return formData;
                },
                //获取自定义删除的值（如果默认的从界面获取保存的值不满足需求，可以重写此方法，自定义获取值）
                getCustomDeleteValue: function () {
                    //返回结果的类型是object
                    var formData = {};
                    //可以通过如下方式添加任意值
                    formData.yyy = 787;

                    return formData;
                },
                //刷新录入表单后的回调
                afterRefreshFormHandler: function () {
                    //layui组件，用来代替alert
                    // layer.msg('afterRefreshFormHandler');

                    //初始化或刷新文件上传控件
                    //参数1是input的id，参数2是业务类型（bizType）
                    //bizType：由于通用附件是本系统所有需要上传文件的功能的文件都会保存在同一张表，因此需要一个值来区分该文件属于哪个功能
                    //bizType就是区分功能的标识，bizType可任意命名，建议以实体或者功能命名
                    //还有第3参数是option，可自定义传入文件上传控件bootstrap fileinput的参数，例如：
                    // this.refreshFileUpload("inputUploadPic", "companyDemoExt", {
                    //     allowedFileExtensions: ['cdi', 'wav'],
                    //     maxFileCount: 100
                    // });
                    //更多bootstrap fileinput的参数可以网上搜索或者看http://plugins.krajee.com/file-input
                    //refreshFileUpload方法最简例子
                    this.refreshFileUpload("inputUploadPic", "companyDemoExt");

                    //refreshFileUpload方法全参数例子
                    // this.refreshFileUpload("inputUploadPic", "companyDemoExt", null,
                    //     function (event, files) {
                    //         //选择文件后回调
                    //     }, function (event, data) {
                    //         //上传成功后回调，如果一次上传多个文件，那实际上是（并行）发起多次请求，每个请求一个文件，因此此回调函数也会触发多次
                    //
                    //         //data的内容很丰富，请自行运行查看，其中有关键属性：
                    //         //data.response：后台返回的值
                    //         debugger;
                    //     });

                    //自定义初始化上传控件
                    // this.customUploadFile("inputUploadPic");
                },
                //表单保存前触发，可用于表单验证
                //需要有返回值，返回true就是继续保存，false就是不保存
                beforeSaveForm: function () {
                    //这里可以写保存前的验证代码，返回false就是终止保存

                    return true;
                },
                //自定义初始化上传控件
                //当自带的上传附件功能不能满足个性化需求，可以直接拷下面的代码初始化控件，下面的代码比较接近原版纯净版的bootstrap fileinput初始化代码
                //id：绑定到的iuput的id
                customUploadFile: function (id) {
                    var options = {
                        //语言
                        language: 'zh',
                        //上传的地址（下面还有上传的参数（uploadExtraData））
                        //地址可以随便改
                        uploadUrl: serviceHelper.getBasicPath() + "/companyDemoExt/customUploadFile",
                        //是否显示预览窗
                        // showPreview: false,
                        //默认是否显示拖拽文件的窗
                        dropZoneEnabled: false,
                        // previewFileType: "image",
                        //可以预览的文件类型
                        // allowedPreviewTypes: ['image'],
                        //接收的文件后缀,array类型，例如：['jpg', 'png','gif']
                        // allowedFileExtensions: ['jpg', 'png', 'gif', 'bmp'],
                        //最大上传文件数
                        maxFileCount: 100,
                        //上传时发起请求，额外加入请求的值
                        uploadExtraData: function (previewId, index) {
                            //这里可以定义上传时传到后台的参数
                            var formData = serviceHelper.getDefaultAjaxParam();
                            formData.param1 = "ddd";
                            // formData.bizId = this.currentEntity.id;

                            return formData;
                        }.bind(this),
                    };

                    //真正的初始化代码，on方法写定义的是事件
                    $('#' + id, $("#" + this.vm.mainContentDivId)).fileinput(options).on("filebatchselected", function (event, files) {
                        //选择文件事件。选择文件后触发，例如要选择文件就马上上传可以在这里加代码

                        //选择文件后马上上传
                        // $(this).fileinput("upload");
                    }).on("fileuploaded", function (event, data) {
                        //上传文件成功事件。上传文件后执行的代码可以写在这

                        //上传成功后回调
                        if (data.response.success == true) {
                            var result = data.response.data;

                            //接收到后台发来的参数
                            var xxx = result.xxx;
                        } else {
                            alert(data.response.msg);
                        }
                    });
                },
                //删除后的回调
                afterDeleteHandler: function () {
                    // layer.msg('afterDeleteHandler');
                },
                //刷新列表后的回调
                afterRefreshListHandler: function () {
                    // layer.msg('afterRefreshListHandler');
                },
                //提示框例子
                layuiAlert: function () {
                    //各种弹出提示框例子
                    //layui组件，用来代替alert
                    //以下例子都屏蔽了，需要看效果可以取消屏蔽

                    //普通提示框，代替alert，打开后等几秒会自动关闭（我们系统原则上不用自带的alert（有时会用，例如弹出异常信息时为了稳定性就会用））
                    // layer.msg('111');

                    //询问提示框，带点击按钮的触发事件
                    // layer.confirm('询问框，是否确定？', {
                    //     //定义按钮，可以多个
                    //     btn: ['确定', '取消', '按钮3']
                    //     //接下来是每个按钮的回调函数，一般有几个按钮就有几个回调
                    //     //参数1是弹窗的index，可以用此标识弹窗
                    // }, function (index) {
                    //     //关闭弹窗（代码关闭弹窗的方法，但有时不用这句都会自己关闭，原因不明）
                    //     layer.close(index);
                    // }.bind(this), function () {
                    //
                    // }.bind(this), function () {
                    //
                    // }.bind(this));

                    //其他关于弹窗的高级使用方法，可以去layui的官网看，地址：http://layer.layui.com/
                },
                //ajax请求
                ajaxTest: function () {
                    //formData存放传入参数
                    var formData = serviceHelper.getDefaultAjaxParam();
                    //传入自定义参数
                    formData.type = "private";

                    //参数是数组类型
                    var array = [555, 666, 777];
                    //JSON.stringify是js中对象转为json字符串的方法，而json字符串转对象的方法是JSON.parse
                    formData.strarray = JSON.stringify(array);

                    //参数是对象类型
                    var obj = {};
                    obj.name = "jack";
                    obj.age = "55";
                    formData.strobject = JSON.stringify(obj);

                    //开启loading效果
                    //例如假设下方的ajax因为计算量较大需要几秒才能返回，界面需要loading（加载中）效果
                    //在发起ajax请求前先打开loading的“膜”，然后请求返回再关闭
                    var index = layer.load(0, {shade: [0.3, '#000']});

                    serviceHelper.getJson(serviceHelper.getBasicPath() + this.controllerUrl + "/ajaxTest", formData, function (result) {
                        //关闭loading效果
                        layer.close(index);

                        //result是返回的数据
                        debugger;
                    }.bind(this));
                },
                showCustomForm: function (e, value, row, index) {
                    //js代码访问vue组件的方式$refs.componentDemo1，componentDemo1是在html内组件的ref属性，作为vue组件的标识，类似jquery的id和name
                    //主键外传入值获取调用组件的方法可以这样
                    this.vm.$refs.componentDemo1.companyName = row.name;
                    this.vm.$refs.componentDemo1.init();
                    //点击确定后的回调，可以这样获取到从组件传过来的值
                    this.vm.$refs.componentDemo1.okHandler = function (companyName) {
                        //这样也可以获取组件里面的参数（理论上可以获取组件的所有对象），而且方便些
                        //var ee = this.vm.$refs.componentDemo1.companyName;

                        layer.msg(companyName);
                        debugger;
                    }.bind(this);

                    //弹出窗口
                    this.vm.$refs.componentDemo1.showForm();
                },
                //layui弹窗
                showLayuiForm: function (e, value, row, index) {
                    this.vm.$refs.layuiOpenFormDemo1.companyName = row.name;
                    //点击确定后的回调，可以这样获取到从组件传过来的值
                    this.vm.$refs.layuiOpenFormDemo1.okHandler = function (companyName) {
                        layer.msg(companyName);
                        debugger;
                    }.bind(this);

                    //弹出窗口
                    this.vm.$refs.layuiOpenFormDemo1.showForm();
                },
                //格子表单模板
                showGridForm: function () {
                    this.vm.$refs.gridFormDemo1.showForm();
                },
                //导出
                export: function () {
                    //获取刷新列表的查询参数
                    var formData = this.getRefreshListParam();
                    //export = 1代表导出，在后台用于标识是导出功能（而不是一般的获取数据）
                    formData.export = 1;

                    //传入查询参数，在后台导出excel并先保存到临时文件
                    //注意controller方法是export，export方法写在基类
                    serviceHelper.getJson(serviceHelper.getBasicPath() + this.controllerUrl + "/export", formData, function (result) {
                        //真正的下载excel文件
                        ///tempFile/downloadFile是框架临时文件功能的下载文件
                        window.location.href = serviceHelper.getBasicPath() + "/tempFile/downloadFile?token=" + serviceHelper.getToken() + "&fileName=" + result;
                    }.bind(this));
                },
                //不使用框架自带功能，实现带分页的查询功能
                query2: function () {
                    //把获取数据的url切换到本例使用的
                    //PS：实际情况中肯定不是在这里切换，这里是因为在此功能有多个demo才临时切换listUrl
                    this.listUrl = this.controllerUrl + "/query2";
                    this.refreshList();
                },
                //初始化工具条的查询条件，如果查询条件在toolbarQueryParam之外甚至不用vue绑定，可以重写此方法
                initToolbarQueryParam: function () {
                    //列表查询条件的初始化
                    //虽然基类也有初始化，但部分控件的部分使用情况需要单独地初始化
                    this.toolbarQueryParam = {};
                    //select控件，用vue绑定，绑定的属性要存在，否则就无法设初始值
                    this.toolbarQueryParam.type = "";

                    //查询条件，创立时间
                    this.createDates = "";
                },
            }
        });

        //子表容器，每个表一个容器
        //容器（员工）
        this.containerEmployee = new container({
            data: function () {
                return {
                    //列表id，同一页面如果有多个实体列表需要修改
                    tableId: "tableEmployee",
                    //表单（弹窗）id，同一页面如果有多个实体列表需要修改
                    formId: "formEmployee",
                    //当前公司id（主表id）
                    companyDemoExtId: 0,
                    //控制列表是否显示（此属性在容器基类），子表默认不显示
                    showList: false,
                }
            },
            methods: {
                getCustomQueryParam: function () {
                    var formData = {};
                    //查询前把当前主表id传到后台，列表查询用到
                    formData.companyDemoExtId = this.companyDemoExtId;

                    return formData;
                },
                getCustomSaveValue: function () {
                    var formData = {};
                    //保存前把当前主表id传到后台，保存时用到
                    formData.companyDemoExtId = this.companyDemoExtId;

                    return formData;
                }
            }
        });
    },
    //vue对象mounted事件，DOM（页面）加载完成时触发，类似jquery的ready，初始化时操作DOM的代码可以写在这
    mounted: function () {
        //容器（主表）
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；列表的列设置
        this.containerMain.init(this, "/companyDemoExt", [{
            //checkbox列，用于勾选多选行
            field: 'state',
            checkbox: 'true'
        }, {
            //列绑定数据的属性的名称
            field: 'name',
            //列的显示名称
            title: '公司名称'
        }, {
            field: 'address',
            title: '地址'
        }, {
            field: 'type',
            title: '企业类型'
        }, {
            field: 'createDate',
            title: '创立时间'
        }, {
            field: 'turnover',
            title: '营业额'
        }, {
            field: 'personNum',
            title: '人数'
        }, {
            field: 'operate',
            title: '操作',
            align: 'center',
            //点击事件
            events: {
                //事件字符串格式：click .+a的class名称
                'click .edit': function (e, value, row, index) {
                    //编辑
                    this.edit(row.id);
                }.bind(this.containerMain),
                'click .delete': function (e, value, row, index) {
                    //删除（一条）
                    this.deleteOne(row.id);
                }.bind(this.containerMain),
                'click .operateDemo1': function (e, value, row, index) {
                    // layer.msg('operateDemo1');

                    //es6 demo，需要运行测试可以解开注释
                    // es6.arrayDemo();

                    //moment.js demo，需要运行测试可以解开注释
                    // momentDemo.main();

                    //提示框例子
                    this.layuiAlert();
                }.bind(this.containerMain),
                //ajax请求
                'click .ajax': function (e, value, row, index) {
                    this.ajaxTest();
                }.bind(this.containerMain),
                //弹窗和引入vue组件
                'click .showCustomForm': function (e, value, row, index) {
                    this.showCustomForm(e, value, row, index);
                }.bind(this.containerMain),
                //layui弹窗
                'click .showLayuiForm': function (e, value, row, index) {
                    this.showLayuiForm(e, value, row, index);
                }.bind(this.containerMain),
                //格子表单模板
                'click .showGridForm': function (e, value, row, index) {
                    this.showGridForm();
                }.bind(this.containerMain),
                //员工列表
                'click .employee': function (e, value, row, index) {
                    //显示员工列表
                    this.vm.showEmployeeList(e, value, row, index);
                }.bind(this.containerMain)
            },
            //操作类的内容
            formatter: function (value, row, index) {
                return [
                    //格式：一个功能是一个a，class必填因为跟点击事件有关
                    '<a class="operateDemo1" href="javascript:;" title="demo1">',
                    'demo功能',
                    '</a>  ',
                    '<a class="ajax" href="javascript:;" title="ajax请求">',
                    'ajax请求',
                    '</a>  ',
                    '<a class="showCustomForm" href="javascript:;" title="弹窗和引入vue组件">',
                    '弹窗和引入vue组件',
                    '</a>  ',
                    '<a class="showLayuiForm" href="javascript:;" title="layui弹窗">',
                    'layui弹窗',
                    '</a>  ',
                    '<a class="showGridForm" href="javascript:;" title="格子表单模板">',
                    '格子表单模板',
                    '</a>  ',
                    '<a class="employee" href="javascript:;" title="employee">',
                    '员工',
                    '</a>  ',
                    '<a class="edit" href="javascript:;" title="编辑">',
                    '<i class="glyphicon glyphicon-edit"></i>',
                    '</a>  ',
                    '<a class="delete" href="javascript:;" title="删除">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            }
        }]);

        //容器（子表）
        //容器初始化，初始化必须在页面加载完成，也就是mounted时触发
        //参数：this（传入全局vue对象）；controller的url；列表的列设置
        this.containerEmployee.init(this, "/employee", [{
            field: 'state',
            checkbox: 'true'
        }, {
            field: 'name',
            title: '姓名'
        }, {
            field: 'sex',
            title: '性别'
        }, {
            field: 'age',
            title: '年龄'
        }]);

        //刷新列表
        this.containerMain.refreshList();
        //初始化表单（公司）
        this.containerMain.initForm();
    },
    methods: {
        //跳转到员工（子表）列表
        //因为此方法对两个容器进行操作，因为放在容器外部
        showEmployeeList: function (e, value, row, index) {
            //隐藏主表（公司）列表
            this.containerMain.showList = false;
            //显示子表（员工）列表
            this.containerEmployee.showList = true;

            //给子表（员工）列表赋值当前主表（公司）id
            this.containerEmployee.companyDemoExtId = row.id;
            //刷新子表（员工）列表
            this.containerEmployee.refreshList();
        },
        //从员工（子表）列表返回公司（主表）列表
        showCompanyList: function () {
            //隐藏子表（员工）列表
            this.containerEmployee.showList = false;
            //显示主表（公司）列表
            this.containerMain.showList = true;
        },
        //初始化日期控件
        initDatetimepicker: function () {
            //需要自定义日期控件格式，可以重写基类的initDatetimepicker方法
            //同一表单内多个日期控件，当控件需要不同的日期显示格式，可以分开初始化
            //用于查找控件的class要新建，且每种格式的class都不同，也要保留原来的class：datetimepicker

            //日期控件叫bootstrap-datetimepicker，更多使用方法请看官网：http://www.bootcss.com/p/bootstrap-datetimepicker/，https://github.com/smalot/bootstrap-datetimepicker，

            //格式1，注意class
            $('.dtp-format1', $("#" + this.mainContentDivId)).datetimepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                autoclose: true,
                startView: 2,
                minView: 2
            }).on('changeDate', function (ev) {

            });

            //格式2，注意class
            $('.dtp-format2', $("#" + this.mainContentDivId)).datetimepicker({
                language: 'zh-CN',
                //当format内含中文，例如：yyyy年mm月dd日，会有bug，情况是第二次选择日期时会自动跳到1899年
                //解决方法是设置属性forceParse=false，forceParse意思是选择日期后是否强制解析其值
                //bug的原因是当值有中文时，解析失败，且造成值出错
                format: 'yyyy年mm月dd日',
                autoclose: true,
                forceParse: false,
                startView: 2,
                minView: 2
            }).on('changeDate', function (ev) {

            });
        },
        tabDemo: function () {
            this.$refs.tabDemo1.showForm();
        },
        //后台生成文件并在前端下载
        createFileAndDownload: function () {

            //就一行代码
            //一般window.location.href是用于跳转页面的（值就是要跳转到的url），可是这里就可以用来实现下载文件，同时页面也不会跳转
            //之所以这样，是因为这个请求的内容是文件的内容（后台实现），那浏览器就会自动识别成下载文件，而不是跳转
            //这个地址只是个普通的controller，参数可以在url问号后面传参，token是验证必须的
            window.location.href = serviceHelper.getBasicPath() + "/companyDemoExt/createFileAndDownload?token=" + serviceHelper.getToken();
        }
    }
});

module.exports = comm;