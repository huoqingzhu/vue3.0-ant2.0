import Point from "ol/geom/Point";
import { GeoJSON } from "ol/format";
import Draw from "ol/interaction/Draw";
import { getCenter } from "ol/extent";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Map, View, Feature } from "ol";
import MultiPoint from "ol/geom/MultiPoint";
import { fromLonLat } from "ol/proj";

import { Circle as CircleStyle, Fill, Stroke, Icon, Style, Text } from "ol/style";
// 投影
import Overlay from "ol/Overlay";
export class olMap {
  olmap = null
  // layers所有图层
  layers = []
  // 图小人图层
  personLayer = null
  // 图标图层
  IocnLayer = null
  // 鼠标移动图层
  province = null
  // 常数city
  city = null
  // 选中位置坐标
  coordinate = { x: null, y: null }
  // 围栏层
  weilanLayer = null
  // 绘画层
  huihuaSource = null
  // 围栏数据
  weilan = []
  // 绘画样式
  value = null
  // 交互层
  draw = null
  constructor(JSON) {
    this.JSONData = JSON
  }
  /**
  * 初始化地图
  * @param {string||GeoJSON} url 
  * @param {string} storkeColor 地图线的颜色
  * @param {string} fillColor 地图面的颜色
  */
  init(url, storkeColor = "#319FD3", fillColor = "rgba(255, 255, 255, 0.6)", target = "map") {
    let view
    let source
    if (typeof url === "string") {
      source = new VectorSource({
        url: url,
        format: new GeoJSON(),
      });
      view = {
        center: fromLonLat([113.610243, 34.801844]), //地图中心坐标
        projection: "EPSG:3857", //坐标系类型
        zoom: 4.5, //缩放级别
        maxZoom: 14,
      }

    } else {
      source = new VectorSource({
        features: new GeoJSON().readFeatures(url),
      });
      view = {
        center: [0, 0],
        zoom: 10,
        maxZoom: 14,
        minZoom: 10,
      }
    }

    let style = new Style({
      stroke: new Stroke({
        width: 1,
        color: storkeColor,
      }),
      fill: new Fill({
        color: fillColor,
      }),
      text: new Text({
        font: "12px Calibri,sans-serif",
        fill: new Fill({
          color: "#000",
        }),
        stroke: new Stroke({
          color: "#fff",
          width: 3,
        }),
      }),
    });
    // 绘画图层
    let vector = new VectorLayer({
      source: source,
      style: function (feature) {
        style.getText().setText(feature.get("name"));
        return style;
      },
    });
    this.layers.push(vector)
    this.olmap = new Map({
      view: new View(view),
      layers: this.layers,
      target: target,
    });
  }  // 渲染小人图层
  /**
   * 加载小人
   * @param {Object} 小人位置和图片信息
   */
  personIocn(data) {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      let iconFeature = new Feature({
        geometry: new Point([data[i].x, data[i].y]),
        name: `person${i}`,
      });
      let src = require(`../views/openlayer/JSON/${data[i].type}`);
      let iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: src,
          opacity: 0.7
        }),
      });
      iconFeature.setStyle(iconStyle);
      arr.push(iconFeature);
    }

    this.personLayer = new VectorLayer({
      source: new VectorSource({
        features: arr,
      }),
      zIndex: 22,
    });

    this.olmap.addLayer(this.personLayer);
  }
  /**
 * 加载图标
 * @param {Object} 小人位置和图片信息
 */
  addIocn(data) {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      let iconFeature = new Feature({
        geometry: new Point([data[i].x, data[i].y]),
        name: `person${i}`,
      });
      let src = require(`../views/openlayer/JSON/${data[i].type}`);
      let iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: src,
        }),
      });
      iconFeature.setStyle(iconStyle);
      arr.push(iconFeature);
    }

    this.IocnLayer = new VectorLayer({
      source: new VectorSource({
        features: arr,
      }),
      zIndex: 22,
    });

    this.olmap.addLayer(this.IocnLayer);
  }
  /**
   * 跟新小人位置
   * @param {Object}} data 
   */
  updatedPerson(data) {
    this.olmap.removeLayer(this.personLayer);
    this.personIocn(data);
  }
  /**
   * 鼠标事件
   * @params{e} stirng
   * pointermove||click
   */
  pointermove(event) {
    let container = document.getElementById("popup");
    let content = document.getElementById("popup-content");
    // 创建一个弹窗 Overlay 对象
    let overlay = new Overlay({
      element: container, //绑定 Overlay 对象和 DOM 对象的
      autoPan: false, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
      autoPanAnimation: {
        duration: 250, //自动平移效果的动画时间 9毫秒）
      },
    });
    // 将弹窗添加到 map 地图中
    this.olmap.addOverlay(overlay);
    let _that = this;
    this.olmap.on(event, function (e) {
      _that.coordinate.x = e.coordinate[0];
      _that.coordinate.y = e.coordinate[1];
      if (e.dragging) {
        return;
      }
      let feature = _that.olmap.forEachFeatureAtPixel(e.pixel, function (
        feature
      ) {
        return feature;
      });
      if (feature) {
        let city = feature.get("name");
        if (_that.city === city || city === "墙") {
          return;
        } else {
          try {
            _that.province.getSource().removeFeature(_that.feature);
          } catch {
            console.log("err");
          }
          content.innerHTML = feature.get("name");
          _that.changeJSON(feature);
          overlay.setPosition(e.coordinate);
          _that.city = city;
        }
      } else {
        overlay.setPosition(undefined);
      }
    });
  }
  // 变色
  changeJSON(pixel) {

    let _this = this;
    // 使用变量存储弹窗所需的 DOM 对象
    let style = new Style({
      stroke: new Stroke({
        color: "#f00",
        width: 1,
      }),
      fill: new Fill({
        color: "rgba(255,0,0,0.1)",
      }),
      text: new Text({
        font: "12px Calibri,sans-serif",
        fill: new Fill({
          color: "#000",
        }),
        stroke: new Stroke({
          color: "#f00",
          width: 3,
        }),
      }),
    });
    this.province = new VectorLayer({
      source: new VectorSource(),
      map: _this.olmap,
      zIndex: 2,
      style: function (feature) {
        style.getText().setText(feature.get("name"));
        return style;
      },
    });
    // getSource 是获取图层的数据源
    _this.province.getSource().addFeature(pixel);
    _this.feature = pixel;
  }
  /**
   * 新增围栏
   * @param {*} data 围栏的geoSON 数据
   * @param {*} style  围栏样式
   */
  addWeiLan(data, style) {
    let styles = [
      new Style({
        stroke: new Stroke({
          color: style.stroke,
          width: 2,
        }),
        fill: new Fill({
          color: style.fill,
        }),
      }),
      new Style({
        image: new CircleStyle({
          radius: 3,
          fill: new Fill({
            color: "orange",
          }),
        }),
        geometry: function (feature) {
          const coordinates = feature.getGeometry().getCoordinates()[0];
          return new MultiPoint(coordinates);
        },
      }),
    ];
    let geojsonObject = {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: {
          name: "EPSG:3857",
        },
      },
      features: data,
    };
    let a = new GeoJSON().readFeatures(geojsonObject);

    let source = new VectorSource({
      features: a,
    });

    this.weilanLayer = new VectorLayer({
      source: source,
      style: styles,
      zIndex: 30,
    });
    this.olmap.addLayer(this.weilanLayer);
  }

  removeWeiLan() {
    this.olmap.removeLayer(this.weilanLayer)
  }
  // 增加绘图层 传入绘画样式 默认是Polygon
  addHUiHua(value = "Polygon") {
    this.huihuaSource = new VectorSource({});
    let vector = new VectorLayer({
      source: this.source,
    });
    this.olmap.addLayer(vector);
    this.value = value
  }
  /**
   * 绘画图层
   * @param {Object}} style 
   * @param {string} name 
   */
  addInteraction(style, name = "测试") {
    let styles = new Style({
      stroke: new Stroke({
        width: 1,
        color: style.stroke,
      }),
      fill: new Fill({
        color: style.fill,
      }),
    });
    if (this.value) {
      this.draw = new Draw({
        source: this.huihuaSource,
        type: this.value,
        style: styles,
      });
      // 将互动层添加到地图
      // this.olmap.addInteraction(this.draw);
      let _this = this;
      this.draw.on("drawend", function (e) {
        // 获取互动坐标
        const geometry = e.feature.getGeometry();
        let arr = geometry.getCoordinates();
        let geo = {
          type: "Feature",
          properties: {
            name: name,
          },
          geometry: {
            type: "Polygon",
            coordinates: arr,
          },
        };
        _this.weilan.push(geo);
        console.log(geo)
        _this.setWeiLan({
          stroke: "#fcf",
          fill: "rgba(0,255,255,0.3)",
        })
      });
    }
  }
  // 停止绘图
  stopInteraction() {
    this.map.removeInteraction(this.draw);
    this.draw = null
  }
  /**
   * 展示围栏
   * @param {Object} style 
   */
  setWeiLan(style) {
    let styles = [
      new Style({
        stroke: new Stroke({
          color: style.stroke,
          width: 1,
        }),
        fill: new Fill({
          color: style.fill,
        }),
      }),
      new Style({
        geometry: function (feature) {
          const coordinates = feature.getGeometry().getCoordinates()[0];
          return new MultiPoint(coordinates);
        },
      }),
    ];
    let geojsonObject = {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: {
          name: "EPSG:3857",
        },
      },
      features: this.weilan,
    };
    let a = new GeoJSON().readFeatures(geojsonObject);
    let source = new VectorSource({
      features: a,
    });
    this.weilanLayer = new VectorLayer({
      source: source,
      style: styles,
      zIndex: 30,
    });
    this.olmap.addLayer(this.weilanLayer);
  }

}
