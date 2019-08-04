<!--
  级联选择

  会返回数据

  (有问题,没有做成功)
-->

<style scoped>
  .selector-wrapper{
    margin: 10px 0;
  }
</style>

<template>
  <div class="selector-wrapper">
    <Select v-if="selector_config_data" v-for="(item, index_select) in selector_config_data" v-model="selected_obj[index_select]"  ref="'select-' + index_select" :key="'select-'+index_select" filterable @on-change="on_change" @on-query-change="on_query_change" style="width:200px">
      <Option v-for="(option, index_option) in selector_obj[index_select]" :value="option.value" :key="'option-'+index_option">{{ option.label }}</Option>
    </Select>
  </div>
</template>

<script>

  export default{

    /*
    注意: 在使用lml_cascade_selector之前,必须保证Django-Rest-Framework后端是有过滤的代码的

    * 1. selector_config_data:
    * [
    * // 第一级别的数据
    * {
    *   url: 'http://xxxx/list',
    *   filter_obj: 'area',
    *   filter_param: 'name'
    * },
    * // 第二级别的数据
    * {
    *   url: 'http://xxxx/list',
    *   filter_obj: 'area_partition',
    *   filter_param: 'name'
    * }
    * ...
    * ]
    *
    * 2. list_url 这个是罗列的数据
    *
    *
    *
    * */
    props: {
      selector_config_data: {
        type: Array,
        required: true
      },
      list_url: {
        type: String,
        required: true
      }
    },
    data(){
      return {
        total_filter_param:'',
        cur_index: 0,
        selected_obj: {},  // 选中的数据
      }
    },
    computed: {
      // 这个是被选中的数据
      select_selector_obj () {
        var obj = {}
        for(let item in this.selector_config_data){
          obj[item] = undefined
        }
        return obj
      },
      // 各个选择列表
      selector_obj(){
        var obj = {}
        for(let item in this.selector_config_data){
          obj[item] = []
        }
        return obj
      }
    },
    methods: {

      // 请求要返回父组件的数据
      fetch_data(){

        var key = this.total_filter_param

        this.$Lml_http('get', list_url, {key: select_selector_obj['select-'+cur_index]}, (response)=>{
          var data = this.$Util.get_data_by_unknow_pagination(response)
          this.emit('callback', data)  // 返回过滤之后的数据
        }, (error)=>{

        })
      },
      // 请求要作为选择列表的数据 (index是第几层的数据)
      fetch_select_data(index){
        var url = this.selector_config_data[index].url

        var params = ''

        if(index > 0) {
          for (var i = 0; i < index; i++){

            if (i === 0) { params = selector_config_data[i].filter_obj + "__" + selector_config_data[i].filter_param + params }
            else { params = selector_config_data[i].filter_obj + "__" + params }

          }

        }

        var request_param

        if (params) {
          request_param = {params: select_selector_obj[index]}
        }

        this.$Lml_http('get', url, request_param, (response) => {

          var data = this.$Util.get_data_by_unknow_pagination(response.data)
          var formated_data = this.format_data(data, this.selector_config_data[index].filter_param)
          this.selector_obj[index] = formated_data

          // 这里获取表格数据

          if (index <= 0 ) { return }  // 如果等于0

          var count = this.selector_config_data.length - index - 1 // 这里是 比

          var total_params = ''

          for(var i=count -1; i>=0; i--){
            if (i === 0) {
              total_params = total_params + this.selector_config_data[i].filter_obj + this.selector_config_data[i].filter_param
            }
            else{
              total_params = total_params + this.selector_config_data[i].filter_obj
            }

          }

          // 更新数据
          this.fetch_data()

        }, (error) => {
        })

      },

      // 搜索组件方法
      on_change(value){

        // 1.先找到select-*

        var find_item
        for( let item in this.selector_obj){
          this.selector_obj[item].find( obj => {
            if(obj.value === value) {
              find_item = item   // 这里找到`selector_obj`中的哪个`select-*`
              return
            }
          })
        }

        // 2.请求数据
        var index = find_item.split('-')[1]

        // fetch_select_data
        if(index < this.selector_config_data.length) {
          (index + 1)
        }else {
          fetch_data()
        }

      },
      on_query_change(query){

      },

      // 格式化数据 (格式化为: eg: [{label:x, name:x} ...])
      format_data(data, param){

        var temp_list = []
        data.forEach(item => {
          temp_list.push({value: item[param], label: item[param]})
        })
        return temp_list
      }

    },
    // 生命周期方法
    mounted(){

      this.fetch_select_data(0)
    }
  }
</script>

