<!--
  删除选中按钮
-->

<style scoped>

</style>

<template>
  <Poptip :title="title" placement="top-start" confirm transfer @on-ok="delete_selection_proptip_click">
    <Button type="error" size="default">
      <slot></slot>
    </Button>
  </Poptip>
</template>

<script>

  export default{
    props: {
      selection: {
        type: Array,
        required: true
      },
      delete_url_function: {
        type: Function,
        required: true
      }
    }
    ,
    data(){
      return {}
    },
    computed: {
      title: function () {
        return this.selection.length > 0 ? '您确定要删除所选数据吗?' : '没有选中任何条目'
      }
    },
    methods: {
      delete_selection_proptip_click(){

        if (!this.selection || this.selection.length === 0) {
          return
        }

        // 删除多个选中
        this.$Util.delete_multi_selection(
          this,
          this.delete_url_function,
          this.selection,
          function (bool) {
            this.$emit('callback')
          }.bind(this)
        )
      }
    }
  }
</script>

