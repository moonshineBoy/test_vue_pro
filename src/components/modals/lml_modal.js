/**
 * Created by ldl on 2018/3/29.
 */

/**
 * 我自己封装的的Modal弹出(基于iView Modal)
 */
import util from '@/libs/util.js'


var lml_modal = {}

var styles = {

  wrapper_div_style: { margin: "10px", borderBottom: "1px solid #eee" },
  add_title_style: { fontWeight:'800', paddingBottom: '10px',  borderBottom: "1px solid #eee" }
}

/**
 * 图片预览弹出Modal
 * @param context 谁调用的(this)
 * @param img_url  图片的url
 * @param img_style <img>节点的style,可以不传入
 */
lml_modal.img_preview_modal = function (context, img_url, img_style = "max-width: 100%; display: block; margin: 0 auto; background-color: #eee; align: center;") {

  context.$Modal.info({
    render: (h) => {
      return h('img', {
          attrs: {
            src: img_url,
            style: img_style
          },
          on: {},
        },
      )
    },
    title: "文件预览",
    styles: "{width: '100%';}"
  })
}


/**
 * 表格查看详情
 * @param context 上下文
 * @param data_obj  eg: { id:1, name: "服务器", img: "xxx"  }
 * @param label_key_map eg: { 名称: "name",  ID: "id"}
 */
lml_modal.action_btn_view_detail_modal = function (context, data_obj, label_key_map, width=undefined) {

  context.$Modal.info({
    render: (h) => {

      var sub_element_list = []

      for (let label in label_key_map) {

        // 这里只判断 字符串,图片,数组
        var is_img = util.verify_url_is_img(data_obj[label_key_map[label]])
        var key_is_arr = util.is_array(label_key_map[label])  // 如果是数组,就是多层数据

        var detail_ele = null

        if(is_img) {
          detail_ele = h('img', { attrs: {src: data_obj[label_key_map[label]]}, style: {width: '100px'} })
        }
        else if(key_is_arr){
          var content = data_obj
          for(let item in label_key_map[label]){
            content = content[label_key_map[label][item]]
          }

          detail_ele = h('label', content)
        }
        else {
          detail_ele = h('label', data_obj[label_key_map[label]])
        }


        var template = h('div', { style: styles.wrapper_div_style }, [
          h('label', { domProps:{ innerHTML: label+": " },  style: { fontWeight: "600"}}),
          detail_ele
        ])

        sub_element_list.push(template)
      }

      return h(
        'div',
        {
          style: {
            marginTop: "10px",
            borderTop: "1px solid #eee"
          }
        },
        sub_element_list
      )
    },
    title: "详情",
    width: width
  })

}

/**
 * 表格增加 (未完成,有问题这个方法)
 * @param context 上下文
 * @param label_key_map 同上
 * @param form_data 表单数据
 * @param validator 验证器
 *              eg:
 *                {
                    passwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    age: [
                        { validator: validateAge, trigger: 'blur' }
                    ]
                }
 * @param add_url 添加的url路径
 *
 */
lml_modal.action_btn_add_all_input_form_modal = function (context, label_key_map, placeholders, validator, add_url, width=undefined ) {

  context.$Modal.info({
    render: (h) => {

      var form_data = {}

      var form_sub_element_list = []

      for (let label in label_key_map) {

        var key = label_key_map[label]

        var vModelStr = "form_data."+String(key)

        form_data[key] = undefined

        var placeholder = placeholders[label]

        var form_item = h('FormItem', { props: { label: label, prop:key } }, [
          h('Input', { props: { type: "text", placeholder: placeholder}, domProps: {value: form_data[key]}, on: {input: function (event) { self.form_data[key] = event.target.value }} } )
        ])

        form_sub_element_list.push(form_item)

      }



      var form_element = h(
        'Form',
        {
          props: {

            model: form_data,
            rules: validator
          },
          ref: 'add_form',

        },
        [form_sub_element_list]
      )


      return h('div',
        {
          style: styles.wrapper_div_style
        },
        [form_element]
      )
    },
    title: "添加",
    onOk: function () {

      console.log(context.$refs.add_form.form_data)
    },
    width:width
  })
}


lml_modal.action_btn_edit_all_input_form_modal = function (context, label_key_map, edit_form_data, placeholders, validator, edit_url, width=undefined ) {

  context.$Modal.confirm({
    render: (h) => {

      var form_data = edit_form_data

      var form_sub_element_list = []

      for (let label in label_key_map) {

        var key = label_key_map[label]

        var vModelStr = "form_data."+String(key)

        var placeholder = placeholders[label]

        var form_item = h('FormItem', { props: { label: label, prop:key } }, [
          h('Input',
            {
              props: { type: "text", placeholder: placeholder}, domProps: {value: form_data[key]}
            },
            form_data[key]
            )
        ])

        form_sub_element_list.push(form_item)

      }


      var form_element = h(
        'Form',
        {
          props: {

            model: form_data,
            rules: validator
          },
          ref: 'edit_form',

        },
        [form_sub_element_list]
      )


      return h('div',
        {
          style: styles.wrapper_div_style
        },
        [form_element]
      )
    },
    title: "编辑",
    onOk: function () {

      console.log(context.$refs.edit_form.form_data)
    },
    onCancel: function () {

    },
    width:width
  })
}


/**
 * 表格按钮添加 (这个表格是自定义, 我在实际应用中也使用功能其他的组件进去)
 * @param context
 * @param custom_form_component  如果传入自定义表单组件,那么就使用它(使用场景是很复杂的表单的地方),而不需要再循环去生成表单(默认table_item都是input)
 * @param width eg. "200px", "100%"
 * @param title 主题
 * @param pass_obj 传递的数据. eg: {server_list: [xxx]}
 */
lml_modal.action_btn_add_custom_form_modal = function (context, custom_form_component, width=undefined, title='添加', pass_obj={}) {
  context.$Modal.confirm({
    render: (h) => {
      return h(
        'div',
        { style: styles.wrapper_div_style },
        [
          h('div', { style: styles.add_title_style }, title),
          h(custom_form_component, {props: { context: context, pass_obj:pass_obj}, ref:"add_form"}),
        ])
    },
    onOk(){
      this.$refs.add_form.submit()
    },
    onCancel(){
      this.$refs.add_form.cancel()
    },
    width:width
  })
}

/**
 * 表格按钮编辑 ()
 * @param context
 * @param custom_form_component 自定义表格
 */
lml_modal.action_btn_edit_custom_form_modal = function(context, custom_form_component, form_data, width=undefined, title="编辑", pass_obj={}) {
  context.$Modal.confirm({
    render: (h) => {
      return h(
        'div',
        { style: styles.wrapper_div_style },
        [
          h('div', { style: styles.add_title_style }, title),
          h(custom_form_component, {props: { context: context, form_data: form_data , pass_obj: pass_obj}, ref:"add_form"}),
        ]
      )
    },
    okText: '编辑',
    cancelText: '取消',
    onOk(){
      this.$refs.add_form.submit()
    },
    onCancel(){
      this.$refs.add_form.cancel()
    },
    width:width
  })
}


export default lml_modal;