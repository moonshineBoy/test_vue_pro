var storage = {}

/**
 * 判断是否是对象
 * @param value
 * @returns {boolean}
 */
function isObject(value) {
  return typeof value === 'object' && value !== null;
}

/**
 * var_str: "localStorage" 或者 "sessionStorage"
 *
 * @returns {Array}
 */
function get_key_list(var_str) {

  var obj = Object.keys(window[var_str]).reduce(function(obj, str) {
    obj[str] = window[var_str].getItem(str);
    return obj
  }, {});

  return Object.keys(obj)  // 返回数组
}

storage.sessionStorage =  {

  /**
   *
   * @param key
   * @param value
   * @param expire_days 设置过期时间(undefined: 不过期)
   */
  set (key, value, expire_days=undefined) {

    var verified_value = (isObject(value)) ? JSON.stringify(value) : value

    var data_obj = {
      is_obj: isObject(value), // 是否是对象
      expire_timestamp: Date.parse(new Date()) + expire_days * 24 * 60 * 60 * 1000,  // 过期时间戳
      value: verified_value
    }

    sessionStorage.setItem(key, JSON.stringify(data_obj))
  },

  get (key) {

    var data_obj = JSON.parse(sessionStorage.getItem(key))

    if(!data_obj){
      return undefined
    }

    // 如果已经过期
    if(  data_obj.expire_timestamp && data_obj.expire_timestamp <= Date.parse(new Date())){

      sessionStorage.removeItem(key)
      return undefined
    }

    // 如果是对象
    if(data_obj.is_obj) {
      return JSON.parse(data_obj.value)
    }else { // 不是对象
      return data_obj.value
    }

  },

  // 移除某一个
  remove (key) {
    sessionStorage.removeItem(key)
  },


  // 移除所有
  clearAll () {

    var key_list = get_key_list("sessionStorage")

    key_list.forEach(key => {
      sessionStorage.removeItem(key)
    })
  },
  // 展示所有数据
  all () {
    var key_list = get_key_list("sessionStorage")

    var obj = {}

    key_list.forEach(key => {
      obj[key] = get(key)
    })

    return obj
  }

}

storage.localStorage =  {

  /**
   *
   * @param key
   * @param value
   * @param expire_days 设置过期时间(undefined: 不过期)
   */
  set (key, value, expire_days=undefined) {

    var verified_value = (isObject(value)) ? JSON.stringify(value) : value

    var data_obj = {
      is_obj: isObject(value), // 是否是对象
      expire_timestamp: Date.parse(new Date()) + expire_days * 24 * 60 * 60 * 1000,  // 过期时间戳
      value: verified_value
    }

    localStorage.setItem(key, JSON.stringify(data_obj))
  },

  get (key) {

    var data_obj = JSON.parse(localStorage.getItem(key))

    if(!data_obj){
      return undefined
    }

    // 如果已经过期
    if(  data_obj.expire_timestamp && data_obj.expire_timestamp <= Date.parse(new Date())){

      localStorage.removeItem(key)
      return undefined
    }

    // 如果是对象
    if(data_obj.is_obj) {
      return JSON.parse(data_obj.value)
    }else { // 不是对象
      return data_obj.value
    }

  },

  // 移除某一个
  remove (key) {
    localStorage.removeItem(key)
  },


  // 移除所有
  clearAll () {

    var key_list = get_key_list("localStorage")

    key_list.forEach(key => {
      localStorage.removeItem(key)
    })
  },
  // 展示所有数据
  all () {
    var key_list = get_key_list("localStorage")

    var obj = {}

    key_list.forEach(key => {
      obj[key] = get(key)
    })

    return obj
  }

}


export default storage