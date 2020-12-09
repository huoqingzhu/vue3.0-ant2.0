<template>
<div class="home">
  <!-- keep-alive要改成下面这样
   -->
  <router-view v-slot="{ Component }">
    <transition>
      <keep-alive :include="$store.state.keepLiveRoute">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</div>
</template>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  touch-action: none;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  top: 0;
  left: 0;
  margin: auto;
}
</style>
