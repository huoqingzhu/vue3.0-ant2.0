import Map from "@/utils/tree.js";
import {
  reactive,
  toRefs,
  onMounted
} from 'vue'
import {
  map
} from "@/api/article.js";
import {
  base,
  tieZhi
} from "@/utils/map/model.js";
// 处理地图的初始化,
const mapHosk = () => {
  let obj = reactive({
    map: null,
    // 转换后的数据
    floorData: null,
    // 静态模型
    fixed: [],
    test: ["我是测试数据"]
  });
  let fixed = []
  // 地图初始化
  const init = (container, fixed) => {
    obj.map = new Map(container, fixed);
    obj.map.init();
    obj.map.render();
    obj.map.createControls();
  }
  // 获取参数
  const datas = async () => {
    let container = document.getElementById("maps");
    const listData = await map("/map/floor");
    getData(listData)
    Fixed()
    init(container, fixed)
  }
  onMounted(() => {
    datas()
  })
  // 加载dome后执行
  // 转换数据 
  const getData = (data) => {
    try {
      let arr = [];
      data.forEach((item) => {
        let obj = {
          floor: 1,
          base: "",
          hole: [],
          room: [],
          roomColor: 0xff4500,
        };
        obj.floor = item.floor;
        if (item.children) {
          item.children.forEach((element) => {
            if (element.category == 1) {
              obj.base = JSON.parse(element.data);
            } else if (element.category == 2) {
              obj.hole.push(JSON.parse(element.data));
            } else if (element.category == 3) {
              obj.room.push(JSON.parse(element.data));
              obj.roomColor = element.color || 0xff4500;
            }
          });
        }
        arr.push(obj);
      });
      // console.log(arr);
      obj.floorData = arr;
    } catch {
      obj.floorData = [];
    }
  }
  //生成静态模型
  const Fixed = () => {
    obj.floorData.forEach((item) => {
      let ditu = base.get(
        item.base,
        20,
        200, {
        color: 0x40e0d0,
      },
        ...item.hole
      );
      ditu.position.set(0, 0, (item.floor - 1) * 100);
      obj.fixed.push(ditu);
      fixed.push(ditu);
      if (item.room.length > 0) {
        item.room.forEach((val) => {
          let room = base.get(val, 30, 4, {
            color: item.roomColor,
            transparent: true,
            opacity: 0.4,
          });
          room.position.set(0, 0, (item.floor - 1) * 100);
          obj.fixed.push(room);
          fixed.push(room);
        });
      }
    });

  }

  return {
    obj,
    init
  };

}
export { mapHosk }
