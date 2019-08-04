<style scoped>

</style>

<template>

  <Menu mode="horizontal" :theme="theme1" active-name="1">
    <MenuItem name="1">
      <Icon type="ios-paper" ></Icon>
      内容管理
    </MenuItem>
    <MenuItem name="2">
      <Icon type="ios-people" />
      用户管理
    </MenuItem>
    <MenuItem name="4">
      <Icon type="ios-construct" />
      综合设置
    </MenuItem>
  </Menu>
</template>

<script>


  export default{
    data(){
      return {
        msg: 'hello vue'
      }
    },
    components: {
      'i-icon': 'Icon'
    }
  }
</script>

