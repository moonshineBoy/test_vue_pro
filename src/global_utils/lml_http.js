/**
 * Created by ldl on 2019/8/4.
 */

import {Axios} from './http'

/**
 *
 * @param method  "get", "post" 等,大小写不区分
 * @param url
 * @param params  传递的参数对象
 * @param multipart_formdata (不是表单就不传递,是的话就传递 'formdata')
 */
var lml_http = function (method, url, params, success_cb, error_cb, multipart_formdata=undefined) {

  var format_to_form_data = function(data){

    let formData = new FormData()
    for (let item in data) {
      formData.append(item, data[item])
    }
    return formData
  }

  var lowercase_method = method.toLowerCase()

  var formated_params = params

  var header_config = null

  if (multipart_formdata) {
    header_config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    formated_params = format_to_form_data(formated_params)
  }

  if(lowercase_method === "get") {

    formated_params = {params: formated_params}

    if (!header_config) {

      Axios.get(url, formated_params).then(response => {
        success_cb(response)
        return
      }).catch(response => {
        error_cb(response)
        return
      })
    } else {
      Axios.get(url, format_to_form_data(formated_params), header_config).then(response => {
        success_cb(response)
        return
      }).catch(response => {
        error_cb(response)
        return
      })

    }

    return
  }
  else {


    if(!header_config) {

      Axios[method](url, formated_params).then(response => {
        success_cb(response)
      }).catch(response => {
        error_cb(response)
      })
      return
    }else {
      Axios[method](url, formated_params, header_config).then(response => {
        success_cb(response)
      }).catch( response => {
        error_cb(response)
      })
      return
    }

  }

}

export default lml_http;

