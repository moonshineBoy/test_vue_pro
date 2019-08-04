<style scoped lang="less" rel="stylesheet/less">
  .selector-wrapper{
    margin: 10px 0;
  }
</style>

<template>
  <div class="selector-wrapper">
    <i-select v-if="selector_config_data"  v-model="selected_obj[0]"  ref="select-0" key="select-0" filterable @on-change="on_change" @on-query-change="on_query_change" style="width:200px">
      <Option v-for="(option, index_option) in options_obj[0]" :value="option.value" :key="'option-'+index_option">{{ option.label }}</Option>
    </i-select>
  </div>
</template>

<script>

  import {Select} from 'iview'

  export default{
    props:{
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
      selector_config_data:{
        type: Array,
        required: true
      },
      list_url: {
        type: String,
        required: true
      }
    }
    ,
    data(){
      return {
        selected_obj: {0:undefined},  // 只有一级
        options_obj: {0:[]} // 这个是被选择的罗列数据
      }
    },
    components: {
      'i-select':Select
    },
    methods: {
      // 请求要返回父组件的数据
      fetch_data(){

        var key = this.selector_config_data[0].filter_obj+'__'+this.selector_config_data[0].filter_param
        var url = this.list_url +'?' + key +'=' + this.selected_obj[0]

        this.$Lml_http('get', url, null, (response)=>{

          this.$emit('callback', response.data)  // 返回 respones.data = {count: xx, results:[...]}
        }, (error)=>{

        })
      },
      // 请求options数据
      fetch_options_data(){
        var url = this.selector_config_data[0].url

        this.$Lml_http('get', url, null, (response) => {
          var data = this.$Util.get_data_by_unknow_pagination(response.data)
          var formated_data = this.format_data(data, this.selector_config_data[0].filter_param)
          this.options_obj[0] = formated_data

          this.$Message.success("请求成功")
        }, (error) => {
          this.$Message.error("请求失败")
        })
      },

      // 格式化数据 (格式化为: eg: [{label:x, name:x} ...])
      format_data(data, param){

        var temp_list = []
        data.forEach(item => {
          temp_list.push({value: item[param], label: item[param]})
        })
        return temp_list
      },
      // 选择
      on_change(value){
        this.selected_obj[0] = value
        this.fetch_data()
      },
      on_query_change(query){
        if (!query) {
          this.selected_obj[0] = query
          this.fetch_data()
        }
      },

    }
    ,
    created(){
      this.fetch_options_data()
    }

  }
</script>

