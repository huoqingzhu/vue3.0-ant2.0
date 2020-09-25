<template>
<div class="home">
  <div v-for="item in listTitle" :key="item.path" class="bianqian1">
    <div :class="zhong(item.path)" @click="choose(item)">{{ item.name }}</div>
  </div>
</div>
</template>

<script>
import {
  ref,
  reactive,
  watch,
  computed
} from "vue";
import {
  useRouter,
  useRoute
} from "vue-router";
export default {
  setup() {
    let routers = JSON.parse(localStorage.getItem("router"));
    const listTitle = reactive(routers);
    const router = useRouter();
    let route = reactive(useRoute());
    let K = ref(route.path);
    const zhong = computed(() => {
      return (val) => {
        if (val === K.value) return "zhong";
      };
    });

    watch(
      () => route.path,
      (a) => {
        K.value = a;
      }
    );
    const choose = (val) => {
      router.push(val.path).catch(() => {});
    };
    return {
      listTitle,
      choose,
      zhong,
    };
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  justify-content: center;
  background-color: #696969;
  height: 40px;
  line-height: 40px;

  .bianqian1 {
    display: flex;
    justify-content: space-around;
    width: 80%;

    div {
      width: 70px;
      height: 40px;
      // background-color: rgb(81, 97, 120);
      border-radius: 10px;
      line-height: 40px;
      text-align: center;
    }
  }

  .zhong {
    background-color: pink;
  }
}
</style>
