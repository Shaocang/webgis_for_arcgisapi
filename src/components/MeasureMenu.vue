<template>
  <div class="measure-menu">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        测量菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">距离测量</el-dropdown-item>
        <el-dropdown-item command="b">面积测量</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import {loadModules} from 'esri-loader'

const options = {
  version: '4.23',
  css: true
}  

export default {
  name: 'MeasureMenu',
  methods: {
    handleCommand(command) {
      console.log(command);
      this.distanceMeasure()
    },
    async distanceMeasure() {
      console.log(111);
      const [GraphicsLayer] = await loadModules([
        'esri/layers/GraphicsLayer',
      ], options)

      const sketchLayer = new GraphicsLayer()
      const view = this.$store.state.defaultView
      view.map.add(sketchLayer)
      // const url = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer'
      
      const polylineSymbol = {
        type: 'simple-line',
        color: 'white',
        style: 'solid',
        width: 3
      }

      const polygonSymbol = {
        type: 'simple-fill',
        color: 'white',
        outline: {
          color: 'blue',
          width: 1
        }
      }

      console.log(view);
      console.log(polylineSymbol);
      console.log(polygonSymbol);

      // let sketch = new SketchViewModel({
      //   view: view,
      //   polylineSymbol,
      //   polygonSymbol,
      //   layer: sketchLayer
      // });

      // console.log(sketch);

      // sketchVM.create("polyline")

      // sketchVM.on("create", (e) => {
      //   if (e.state === 'complete') {
      //     geometryService.distance(url, {
      //       distanceUnit: 'meters',
      //       geometry1: e.graphic.geometry
      //     }).then((distance) => {
      //       console.log(distance);
      //     })
      //   }
      // })
      
    }
  }
}
</script>

<style>
  .measure-menu {
    position: absolute;
    left: 80px;
    top: 100px
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>