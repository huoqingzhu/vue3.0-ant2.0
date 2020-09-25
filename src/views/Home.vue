<template>
<!--onselectstart="return false" -->
<div class="container">
  <div class="Tabbar">
    <Header></Header>
  </div>
  <div class="home">
    <RouterView />
  </div>
  <footer class="footter">
    <FooterTabbar ref="foot" />
  </footer>
</div>
</template>

<script>
import Header from "../components/head/index.vue";
import FooterTabbar from "../components/FooterTabbar.vue";
export default {
  name: "Home",
  components: {
    FooterTabbar,
    Header,
  },
};
</script>

<style lang="scss" scoped>
// @media screen and (max-width: 780px) {
// }
.container {
  // background-color: #acbcd6;
  position: absolute;
  width: 100%;
  height: 100%;

  .Tabbar {
    position: fixed;
    top: 0;
    width: 100%;
    height: 60px;
    box-shadow: 0px 3px 3px #ccc;
  }

  .home {
    margin-top: 70px;
  }

  .footter {
    width: 100%;
    height: 20px;
    //     background: #5b6d81;
    line-height: 20px;
    text-align: center;
    /* 方法一 */
    position: fixed;
    bottom: 0;
  }
}
</style>
