import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class Map {
  camera = null//相机
  scene = null//场景
  renderer = null//渲染对象
  controls = null
  mouse = new THREE.Vector2();//鼠标在场景中的位置
  raycaster = new THREE.Raycaster();//用来选择对象
  selectData = null//选中模型信息
  K = 200
  // fixed是传过来的固定模型,dynamic是各层小人模型，
  constructor(container, fixed = [], ...dynamic) {
    this.fixed = fixed
    this.container = container
    this.dynamic = dynamic
  }
  // 初始化
  init = () => {
    // console.log("K:" + this.K)
    /**
     * 创建场景对象Scene
     */
    this.scene = new THREE.Scene();
    /**
    * 创建网格模型
    */
    //添加静态模型
    if (this.fixed.length > 0) {
      this.fixed.map(item => {

        this.add(item)
      })
    }
    // 添加动态模型,dynamic是个数组，每个数组都是一层小人的模型
    if (this.dynamic.length > 0) {
      this.dynamic.map(item => {
        item.map((items) => {
          this.add(items)
        })
      })
    }

    /**
       * 光源设置
       */
    //点光源
    let point = new THREE.PointLight(0xcccccc); //代表模型的亮度
    point.position.set(0, -1200, 400); //点光源位置
    this.scene.add(point); //点光源添加到场景中
    //环境光
    let ambient = new THREE.AmbientLight(0x444444);
    this.scene.add(ambient);
    /**
     * 相机设置
     */
    let width = this.container.clientWidth; //窗口宽度
    let height = this.container.clientHeight; //窗口高度
    let k = width / height; //窗口宽高比
    let s = 400; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象 
    // 正向投影
    this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s + 200);
    // 透视投影
    // this.camera = new THREE.PerspectiveCamera(60, k, 1, 1000);
    this.camera.position.set(0, -800, 200); //设置相机位置
    this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)

    /**
     * 创建渲染器对象
     */
    //辅助三维坐标系AxisHelper
    this.axisHelper = new THREE.AxisHelper(250);
    this.scene.add(this.axisHelper);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    this.renderer.setSize(width, height); //设置渲染区域尺寸
    // this.renderer.setClearColor(0x4169E1, 1); //设置背景颜色
    this.renderer.setClearColor(0xEEEEEE, 0.0);
    this.container.appendChild(this.renderer.domElement); //body元素中插入canvas对象
  }
  // 渲染函数
  render = () => {
    requestAnimationFrame(this.render); //请求再次执行渲染函数render
    // this.controls.update();
    this.renderer.render(this.scene, this.camera);//执行渲染操作

  }
  createControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.controls.autoRotate = true
    // 监听浏览器窗口的变化
    addEventListener('resize', (e) => {
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }, false);


    // addEventListener('onclick', this.onMouseMove, false);
  }
  onMouseMove = (event) => {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // // 计算物体和射线的焦点
    let intersects = this.raycaster.intersectObjects(this.scene.children);
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.type === "Sprite") {
        intersects[i].object.material.color.set(0xff0000);
        this.selectData = intersects[i].object.name
        console.log(intersects[i].object.name)
        // console.log(`射线投射原点和相交部分之间的距离${intersects[i].distance}`)
        // console.log(`相交部分的点（世界坐标）${JSON.stringify(intersects[i].point)}`)
        // console.log(`相交的面${intersects[i].face}`)
        // console.log(`相交相交的面的索引${intersects[i].faceIndex}`)
        // console.log(`射线相交物体个数${intersects.length}`)
        let obj = intersects[i].point
        console.log(`模型数量${this.scene.children.length}`)

        // obj.z = 0

        // this.controls.target = obj
        // this.camera.position.set(obj.x, obj.y, obj.z);
        // this.camera.lookAt(this.scene.position);
        console.log(this.controls.target)
        console.log(this.camera.position)
        return
      }

    }


    // console.log(this.mouse)
  }
  // 添加动态模型
  add(val) {
    this.scene.add(val)
  }
  // 移除模型
  remove(val) {
    this.scene.remove(val)
  }
  // 移动相机
  changeCamera = (x, y, z) => {
    this.camera.lookAt(new THREE.Vector3(x, y, z))
    console.log(this.camera.top)
    this.cameraFov()
    console.log(this.camera.top)
  }
  // 设置缩放
  cameraFov = () => {
    // this.camera.top = 1000
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
  }

}
export default Map