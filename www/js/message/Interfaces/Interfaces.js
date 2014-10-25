/**
 * Created by li on 2014/7/13.
 */
if(typeof(LL)=='object' && (typeof(LL.Interfaces)=='undefined' || typeof(LL.Interfaces._if_loaded_))){
    /**
     * LL.Interfaces
     * 数据接口对像
     * @access public 　
     * @return void	无返回
     */
    LL.Interfaces = {
        _if_loaded_:true,
        /**
         * LL.Interfaces.init
         * 初始化对像
         * @access public
         * @return void	无返回
         */
        init: function () {
            //alert("WN.Interfaces.init");
        },
        /**
         * 用户类型　individual　个人，proxy　代理，company　公司
         * @param individual 个人
         * @param proxy 代理
         * @param company 公司
         * @param create 创建空用户对像
         */
        userTypes: {
            'individual': 0,
            'proxy': 1,
            'company':2,
            create:function(usertype){
                /**
                 * 用户对像
                 * @type {{usertype: number, username: string, mobileNumber: string}}
                 */
                var user={
                    'usertype':this.individual,
                    'username':'',
                    'mobileNumber':''
                };
                switch(usertype){
                    case this.company:
                    case this.proxy:
                    case this.individual:
                        user.usertype=usertype;
                        break;
                    default :
                        break;
                }
                return user;
            }
        },
        /**
         * 注册
         * @param userinfo
         * @param callbacks
         * userinfo{
         *      usertype:"",
         *
         * }
         */
        register: function(userinfo, callbacks){
            LL.post("/applications/web/", {
                'data':LL.getJsonString({
                    'action':'register',
                    'userinfo':userinfo
                })
            }, callbacks, true, LL.getType.json);
        }
    };
    /**
     * 加载完成事件
     */
    if(typeof(onInterfacesLoadedEvent)=='function'){
        onInterfacesLoadedEvent();
    }
    if(typeof(LL.onInterfacesLoadedEvent)=='function'){
        LL.onInterfacesLoadedEvent();
    }
};