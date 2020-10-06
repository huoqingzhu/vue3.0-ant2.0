import * as THREE from 'three'

// 底图
const base = {
  /**
   * 
   * @param {JSON} json 地图的JSON
   * @param {Number} height 模型的高度
   * @param {Number}  ponit 渲染的点数
   * @param {String} Mesh mesh的配置信息 color opacity transparent 等
   * @param {...JSON} jsons 设置内轮廓的JSON 
   * @returns {Object}模型的数据
   */
  get(json, height, ponit = 200, Mesh, ...jsons) {
    // 获取底图的面数据
    let mapData = json.geometry.coordinates[0];
    let points = [];
    // 转化为Vector2构成的顶点数组
    mapData.forEach((elem) => {
      // console.log(elem[0]);
      points.push(new THREE.Vector2(elem[0] / 100, elem[1] / 100));
    });
    // 样条曲线生成更多的点
    let SplineCurve = new THREE.SplineCurve(points);
    let shape = new THREE.Shape(SplineCurve.getPoints(ponit));
    // 遍历打洞的数据
    if (jsons.length > 0) {
      jsons.map(item => {
        let points2 = []
        let mapData2
        if (typeof item === "string") {
          mapData2 = JSON.parse(item).geometry.coordinates[0];
        } else {
          mapData2 = item.geometry.coordinates[0];
        }
        mapData2.forEach((elem) => {
          points2.push(new THREE.Vector2(elem[0] / 100, elem[1] / 100));
        });
        // 样条曲线生成更多的点
        let SplineCurve2 = new THREE.SplineCurve(points2);
        let path = new THREE.Path(SplineCurve2.getPoints(200));
        shape.holes.push(path);//设置内轮廓
      })
    }

    let geometry = new THREE.ExtrudeGeometry( //拉伸造型将面拉成体
      shape, //二维轮廓
      //拉伸参数
      {
        amount: height, //拉伸长度
        bevelEnabled: false, //倒角
      }
    );
    var material1 = new THREE.MeshPhongMaterial(Mesh);
    // 生成几何体
    let mesh = new THREE.Mesh(geometry, material1); //网格模型对象Mesh
    // 返回几何体数据
    return mesh
  }
}
const tieZhi = {
  get(url, color = 0x696969) {
    let texture = new THREE.TextureLoader().load(url);
    var spriteMaterial = new THREE.SpriteMaterial({
      color,//设置精灵矩形区域颜色
      rotation: 0,//旋转精灵对象45度，弧度值
      map: texture,//设置精灵纹理贴图
    });
    // 创建精灵模型对象，不需要几何体geometry参数
    let sprite = new THREE.Sprite(spriteMaterial);
    return sprite
  }
}

export { base, tieZhi } 