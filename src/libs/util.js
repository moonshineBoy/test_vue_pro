import axios from 'axios';
import moment from 'moment'

let util = {};

// 标题
util.title = function (title) {
  title = title || '青青吉他';
  window.document.title = title;
};


// util中加入ajax请求方式(没有使用到)
util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
});

/**
 * 判断元素是否为目标数组中的一个
 * @param ele 要检查的元素
 * @param targetArr 目标数组
 * @returns {boolean} 如果是:true
 */
util.one_of_arr = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * 是否展示这个路由,用于左侧栏计算
 * @param itAccess
 * @param currentAccess
 * @returns {boolean}
 */
util.showThisRoute = function (itAccess, currentAccess) {
  if (typeof itAccess === 'object' && itAccess.isArray()) {
    return util.one_of_arr(currentAccess, itAccess);
  } else {
    return itAccess === currentAccess;
  }
};

/**
 * 根据路由名称获取路由对象
 * @param routes
 * @param name
 * @returns {{}}
 */
util.get_route_obj_by_name = function (routes, name) {
  let routerObj = {};
  routes.forEach(item => {
    if (item.name === 'single_routes') {
      item.children.forEach((child, i) => {
        if (child.name === name) {
          routerObj = item.children[i];
        }
      });
    } else {
      if (item.children.length === 1) {
        if (item.children[0].name === name) {
          routerObj = item.children[0];
        }
      } else {
        item.children.forEach((child, i) => {
          if (child.name === name) {
            routerObj = item.children[i];
          }
        });
      }
    }
  });
  return routerObj;
};

/**
 *
 * @param vm
 * @param item
 * @returns {*}
 */
util.handleTitle = function (vm, item) {
  if (typeof item.title === 'object') {
    return vm.$t(item.title.i18n);
  } else {
    return item.title;
  }
};

/**
 * 设置当期路径
 * @param vm
 * @param name
 * @returns {Array}
 */
util.setCurrentPath = function (vm, name) {
  let title = '';
  let isOtherRouter = false;
  vm.$store.state.routes.forEach(item => {
    if (item.children.length === 1) {
      if (item.children[0].name === name) {
        title = util.handleTitle(vm, item);
        if (item.name === 'single_routes') {
          isOtherRouter = true;
        }
      }
    } else {
      item.children.forEach(child => {
        if (child.name === name) {
          title = util.handleTitle(vm, child);
          if (item.name === 'single_routes') {
            isOtherRouter = true;
          }
        }
      });
    }
  });
  let currentPathArr = [];
  if (name === 'home_index') {
    currentPathArr = [
      {
        title: util.handleTitle(vm, util.get_route_obj_by_name(vm.$store.state.routes, 'home_index')),
        path: '',
        name: 'home_index'
      }
    ];
  } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
    currentPathArr = [
      {
        title: util.handleTitle(vm, util.get_route_obj_by_name(vm.$store.state.routes, 'home_index')),
        path: '/home',
        name: 'home_index'
      },
      {
        title: title,
        path: '',
        name: name
      }
    ];
  } else {
    let currentPathObj = vm.$store.state.routes.filter(item => {
      if (item.children.length <= 1) {
        return item.children[0].name === name;
      } else {
        let i = 0;
        let childArr = item.children;
        let len = childArr.length;
//              console.log(childArr)
        while (i < len) {
          if (childArr[i].name === name) {
            return true;
          }
          i++;
        }
        return false;
      }
    })[0];
    if (currentPathObj !== undefined && currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
      currentPathArr = [
        {
          title: '首页',
          path: '',
          name: 'home_index'
        }
      ];
    } else if (currentPathObj !== undefined && currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: name
        }
      ];
    } else if (currentPathObj !== undefined) {

      let childObj = currentPathObj.children.filter((child) => {
        return child.name === name;
      })[0];
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: currentPathObj.name
        },
        {
          title: childObj.title,
          path: currentPathObj.path + '/' + childObj.path,
          name: name
        }
      ];
    }
  }
  vm.$store.commit('setCurrentPath', currentPathArr);

  return currentPathArr;
};

/**
 * 开新的页面 (也就是比如查看详情等。导航tag也会开新)
 * @param vm (就是上下文:context)
 * @param name (route的name)
 * @param argu
 * @param query
 */
util.open_new_page = function (vm, name, argu, query) {
  let pageOpenedList = vm.$store.state.pageOpenedList;
  let openedPageLen = pageOpenedList.length;
  let i = 0;
  let tagHasOpened = false;

  while (i < openedPageLen) {

    if (name === pageOpenedList[i].name) {  // 页面已经打开
      vm.$store.commit('pageOpenedList', {
        index: i,
        argu: argu,
        query: query
      });
      tagHasOpened = true;
      break;
    }
    i++;
  }
  if (!tagHasOpened) {
    let tag = []
    vm.$store.state.tagsList.map((item, index) => {

      if (name === item.name) {

        tag.push(item)
      } else {

        if (item.children !== undefined) {

          item.children.map((items, index)=> {
            if (name === items.name) {
              tag.push(items)
            } else if (items.children !== undefined) {

              items.children.map((it, i)=> {
                if (name === it.name) {
                  tag.push(it)
                }
              })
            }
          })
        }
      }
    });

    tag = tag[0] == undefined ? [] : tag[0];

    if (tag.children && tag.children !== undefined) {
      tag.children.map((item, index)=> {
        item.name === name ? tag = item : tag;

      })
    }

    if (argu) {
      tag.argu = argu;
    }
    if (query) {
      tag.query = query;
    }
    vm.$store.commit('increateTag', tag);

  }

  vm.$store.commit('setCurrentPageName', name);
};

/**
 * 到默认的页面去
 * 用处: 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
 * @param routes
 * @param name
 * @param route
 * @param next
 */
util.to_default_page = function (routes, name, route, next) {
  let len = routes.length;
  let i = 0;
  let notHandle = true;
  while (i < len) {
    if (routes[i].name === name && routes[i].redirect === undefined) {
      route.replace({
        name: routes[i].children[0].name
      });
      notHandle = false;
      next();
      break;
    }
    i++;
  }
  if (notHandle) {
    next();
  }
};


/**
 * 根据menu_routes得到menu_list
 * 用处: 左边侧栏
 * @param app_router
 * @returns {Array}
 */
util.get_menu_list_by_menu_routes = function(menu_routes, access_code){

  let menuList = [];

  menu_routes.forEach((item, index) => {
    if (item.access) {
      if (Util.showThisRoute(item.access, access_code)) {
        if (item.children.length === 1) {
          menuList.push(item);
        } else {
          let len = menuList.push(item);
          let childrenArr = [];
          childrenArr = item.children.filter(child => {
            if (child.access !== undefined) {
              if (child.access === access_code) {
                return child;
              }
            } else {
              return child;
            }
          });
          menuList[len - 1].children = childrenArr;
        }
      }
    } else {
      if (item.children.length === 1) {
        menuList.push(item);
      } else {
        let len = menuList.push(item);
        let childrenArr = [];
        childrenArr = item.children.filter(child => {
          if (child.access) {
            if (Util.showThisRoute(child.access, access_code)) {
              return child;
            }
          } else {
            return child;
          }
        });
        let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
        handledItem.children = childrenArr;
        menuList.splice(len - 1, 1, handledItem);
      }
    }
  });

  return menuList;

}

// ---


// 1.网站管理,云服务器配置 使用到(需要特定的数据,详情查看网站管理或者云服务器配置的config-data)
util.get_route_by_name = function(name, array) {

  util.get_route_by_name = function(name, array) {

    for ((menu_data) in array) {
      for (group in array[menu_data].groups){
        for (child in array[menu_data].groups[group].children) {
          if (array[menu_data].groups[group].children[child].name === name){
            return child.route
          }
        }
      }
    }
  }
}

/**
 * 2. 根据给定的name找到component(需要特定的数据,详情查看网站管理或者云服务器配置的config-data)
 */
util.get_component_by_name = function (name, array) {

  var selected_component_name = null
  array.forEach((menu_data) => {

    menu_data["groups"].forEach((group) => {
      group["children"].forEach((child) => {
        if(child.name === name) {
          selected_component_name = child.component_name
        }
      })
    })
  })

  return selected_component_name
}

/**
 * 填满obj1的value,使用obj2的value (key相同的情况下填满)
 */
util.fillup_obj1_value_with_obj2_value = function(obj1, obj2) {

  var temp_obj = obj1

  for(let item in obj2) {
    temp_obj.hasOwnProperty(item) ? temp_obj[item] = obj2[item] : ''
  }

  return temp_obj
}

/**
 * 检查url是不是图片
 * @param url
 * @returns {boolean} true 就是图片
 */
util.verify_url_is_img = function(url) {

  // 首先判断是否是字符串
  if(util.get_type(url) !== 'string') {
    return false
  }

  if(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null)
  }

  return false
}

/**
 * 删除多个数据,用在选择之后的`删除选中`
 * @param context
 * @param delete_url_func eg: this.$Api_urls.physical_server_config.physical_server_operating_system_type_delete
 * @param selection eg: [{xxxx}, {xxxx} ...]
 * @param cb: 回调函数
 * @param del_property: eg: "id", "name"
 */
util.delete_multi_selection = function (context, delete_url_func, selection, cb=undefined, del_property="id") {

  var success_count = 0, error_count = 0

  for (let item in selection){

    var delete_url = delete_url_func(selection[item][del_property])

    context.$Lml_http('delete', delete_url, null, (response) => {

      success_count ++
      check_count()
    }, (error) => {
      error_count ++
      check_count()
    })
  }

  function check_count() {
    if((success_count + error_count) === selection.length) {
      if (error_count){
        context.$Message.warning("有"+error_count+"个删除没有执行成功")
        if(cb) {cb(true)}  // 回调成功
      }else {
        context.$Message.success("删除成功")
        if(cb) {cb(false)}  // 回调失败
      }
    }
  }

}

/**
 * 判断list请求返回的数据是否是分页数据
 * @param data list请求返回的数据
 * @returns {boolean} true: 是分页
 */
util.check_data_is_pagination = function (data) {
  if(data.hasOwnProperty('count') && data.hasOwnProperty('next') && data.hasOwnProperty('previous')) {
    return true
  }else{
    return false
  }
}

/**
 * 在不知道是否是分页的情况下取得数据列表
 * @param data
 */
util.get_data_by_unknow_pagination = function (data) {

  if(util.check_data_is_pagination(data)) {
    return data.results
  }else {
    return data
  }
}

/**
 * 判断一个对象是否是数组
 * @param obj
 * @returns {boolean}
 */
util.is_array = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

/**
 * 获取数据的类型(以字符串形式返回)
 * @param obj
 * @returns {*}   返回值: null, array, ...
 */util
util.get_type = function(obj) {

  if(obj=== null) {
    return 'null'
  }else if (Object.prototype.toString.call(obj) === '[object Array]') {
    return 'array'
  }else {
    return typeof (obj);
  }
}

/**
 * 判断ori_str是否包含str
 * @param ori_str eg: 'a_b'
 * @param str eg: '_'
 * @returns {boolean}  eg: true: 代表包含
 */
util.str_contain_str = function(ori_str, str) {
  var bool = ori_str.indexOf(str);

  return (bool >= 0) ? true : false
}

/**
 * 深复制，要想达到深复制就需要用递归
 */
util.deepCopy = function(o,c){
  var c = c || {}
  for(var i in o){
    if(typeof o[i] === 'object'){
      //要考虑深复制问题了
      if(o[i].constructor === Array){
        //这是数组
        c[i] =[]
      }else{
        //这是对象
        c[i] = {}
      }
      deepCopy(o[i],c[i])
    }else{
      c[i] = o[i]
    }
  }
  return c
}

/**
 * 判断是否a 数组包含b数组
 * @param a
 * @param b
 * @returns {boolean}
 */
util.isListContainList = function(a, b) {

  if(!(a instanceof Array) || !(b instanceof Array)) return false;
  if(a.length < b.length) return false;
  var aStr = a.toString();
  for(var i = 0, len = b.length; i < len; i++){
    if(aStr.indexOf(b[i]) == -1) return false;
  }
  return true;
}

/**
 *  根据时间戳的差距,得到天数
 * @param timestamps  时间戳的差距
 * @returns {number}  返回的天数
 */
util.get_days_by_timestamps = function(timestamps) {
  return timestamps / (1000 * 60 * 60 * 24)
}

/**
 * 根据过期时间, 过期天数, 得到结果
 * @param expire_time_date  过期时间
 * @param expire_days  后台设定的过期天数
 * @returns {*}  返回对象 -1, 正常服务, 0: 即将过期, 1: 已经过期
 */
util.get_expire_status = function (expire_time_date, expire_days) {

  var expire_time = moment(expire_time_date).toDate().getTime()
  var now_date = new Date()

  var c_date = new Date(expire_time_date)

  var compare_time = moment(c_date).subtract(Number(expire_days), 'days').toDate().getTime()

  if (now_date.getTime() < compare_time) {
    console.log("正常服务")
    return {
      key: -1,

    }
  }else {
    if(now_date.getTime() >= compare_time && expire_time > now_date.getTime()){

      var days = util.get_days_by_timestamps(expire_time - now_date.getTime())

      return {
        key: 0,
        days: days
      }
    }else {
      var days = util.get_days_by_timestamps(now_date.getTime() - expire_time)
      console.log("已经过期", days)

      return {
        key: 1,
        days: days
      }
    }
  }
}

/**
 * 移除对象的空值的属性
 * @param obj
 * eg: {a:'', b:2, c:''}  -> {b:2}
 */
util.remove_obj_empty_value = function (obj) {
  var temp_obj = obj
  for (var key in obj){
    if (!obj[key]) {
      delete obj[key]
    }
  }

  return temp_obj
}

/**
 * 通过key数组和对应的值,过滤数组
 * @param arr 数组
 * @param keyArr key数组
 * @param value 值
 *
 * eg:
 *
 * list : [{a:'1',b:"2",c:3,d:{id:'d1'}},{a:'1',b:"2",c:3,d:{id:'d2'}},{a:'1',b:"2",c:3,d:{id:'d1'}},{a:'1',b:"2",c:3,d:{id:'d3'}},{a:'1',b:"2",c:3,d:{id:'d3'}},{a:'1',b:"2",c:3,d:{id:'d4'}}];
 *
 * list_filter(a, ['d', 'id'], 'd3'))
 *
 */
util.list_filter_by_key_arr = (arr, keyArr, value) => (

  arr.filter(obj => (
      value === keyArr.reduce((currObj, key) => currObj[key], obj)
    )
  )
)

/**
 * 拷贝字符串到剪贴板
 */
util.copyToClipboard = function(text){
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

/**
 * 数组是否包含元素
 * @param list
 * @param obj
 * @returns {boolean}
 */
 util.list_contains_item = function (list, obj) {
  for (var i = 0; i < list.length; i++) {
    if (list[i] === obj) {
      return true;
    }
  }
  return false;
}

/**
 * 移除对象的空的,undefined对象
 * @param object
 * @returns {*}
 */
util.removeEmpty = function(object) {
  Object.keys(object).forEach((key) => {
    if (object[key] && typeof object[key] === 'object') {
      removeEmpty(object[key]);
      if (Object.keys(object[key]).length === 0) // <---- Check whether there
        delete object[key];                      // <---- no objects in current one
    }
    else if (object[key] == null || object[key] === "" || object[key] === 0 || (typeof object[key] === 'object' && object[key].length === 0)) {
      delete object[key];
    }
  });

  return object;
}

/**
 * 检查是否是纯数字
 * @param str
 */
util.check_is_all_num = function (str) {
  if(/^[0-9]+$/.test(str)){ //这是用正则表达式检查
    return true
  }else{
    return false
  }
}

/**
 * 检查字符串是否是IPv4
 * @param ipstr
 * @returns {boolean}
 */
util.str_is_ip = function (ipstr)
{
  try{
    if(ipstr=="" || ipstr==undefined) return false;
    if(!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){2}\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-4])$/.test(ipstr))
    {
      return false;
    }
    var ls=ipstr.split('.');
    if(ls==null || ls.length!=4 || ls[3]=="0" || parseInt(ls[3])===0)
    {
      return false;
    }
    return true;
  }catch(ee){

  }
  return false;
}


export default util;

