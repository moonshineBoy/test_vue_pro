<template>
  <div id="app">
    <!--<img src="assets/imgs/logo.png">-->
    <!--<MainHeader>-->
    <!--</MainHeader>-->

    <!--<div>-->
      <!--<router-view/>-->
    <!--</div>-->

    <!--<MainFooter/>-->

    <div class="layout">
      <Layout>
        <Header>
          <MainHeader/>
        </Header>
        <Content>
          <div>
            <router-view/>
          </div>
        </Content>
        <Footer>
          <MainFooter/>
        </Footer>
      </Layout>

  </div>
    </div>

</template>

<script>

  import MainHeader from '@/views/主页/header/header.vue'
  import MainFooter from '@/views/主页/footer/footer.vue'


  export default {
    name: 'App',

    components: {
      MainHeader,
      MainFooter
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}
</style>
