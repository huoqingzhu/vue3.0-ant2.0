<template>
<div>
  <p>x{{ coordinate.x }};y{{ coordinate.y }}</p>
  <div id="map">
    <div id="popup" class="ol-popup">
      <div id="popup-content" class="popup-content"></div>
    </div>
  </div>
</div>
</template>

<script>
import "ol/ol.css";
import {
  olMap
} from "@/utils/map.js";
const URL = require("./JSON/5.json");
export default {
  data() {
    return {
      map: null,
      coordinate: {
        x: 1000,
        y: 2000,
      },
    };
  },
  mounted() {
    this.init();
    //小人移动事件
  },
  methods: {
    init() {
      this.map = new olMap();
      // 加载底图
      this.map.init(URL);
      // 增加点击事件
      this.map.pointermove("pointermove");
      // 获取坐标
      this.coordinate = this.map.coordinate;
      // 增加绘画层
      // this.map.addHUiHua()
      // this.map.addInteraction({})
    },
  },
};
</script>

<style lang="scss" scoped>
#map {
  width: 1000px;
  height: 600px;
  touch-action: none;
}

.popup-content {
  width: 100px;
  height: 40px;
  background-color: rgb(211, 230, 230);
  font-size: 16px;
  text-align: center;
  line-height: 40px;
}
</style>
