<template>
<div class="about">
  <h1>vue生命周期</h1>
</div>
</template>

<script>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from "vue";

export default {
  beforeCreate() {
    console.log("beforeCreate:");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("beforeMount");
  },
  mounted() {
    console.log("mounted");
  },
  setup() {
    console.log("setup");
    onBeforeMount(() => {
      console.log("component is onBeforeMount");
    });
    onMounted(() => {
      console.log("component is onMounted");
    });
    onBeforeUpdate(() => {
      console.log("component is onBeforeUpdate");
    });
    onUpdated(() => {
      console.log("component is onUpdated");
    });
    onBeforeUnmount(() => {
      console.log("component is onBeforeUnmount");
    });
    onUnmounted(() => {
      console.log("component is onUnmounted");
    });
  },
};
</script>
