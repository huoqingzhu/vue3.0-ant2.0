<template>
<div>{{ test[0] }}</div>
<div id="map"></div>
</template>

<script>
import {
  reactive,
  toRefs,
  computed,
  watch,
  watchEffect
} from "vue";
import {
  mapHosk
} from "./mapHosk.js";
export default {
  methods: {},
  mounted() {
    console.log(this.fixed);
  },
  setup() {
    const {
      obj,
      init
    } = mapHosk();
    return {
      ...toRefs(obj),
    };
  },
};
</script>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 700px;
}
</style>
