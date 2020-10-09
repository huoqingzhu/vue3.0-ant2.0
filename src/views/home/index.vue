<template>
<div>
  我是首页 {{ obj.name }},{{ obj.age }}{{ test }}
  <a-button @click="change">+</a-button>
</div>
</template>

<script>
import {
  reactive,
  toRefs,
  customRef
} from "vue";

function myRef(value) {
  // customRef 有两个毁掉函数
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        console.log(`get:${value}`);
        return `我是${value}`;
      },
      set(newValue) {
        console.log(`set:${newValue}`);
        value = newValue;
      },
    };
  });
}
export default {
  mounted() {
    console.log(this.name);
  },
  setup() {
    const obj = reactive({
      name: "或庆祝",
      age: 18,
    });
    const change = () => {
      obj.name = "many";
      console.log(obj.name);
    };
    let test = myRef(18);
    // 自定义ref,customRef
    return {
      obj,
      change,
      test,
    };
  },
};
</script>
