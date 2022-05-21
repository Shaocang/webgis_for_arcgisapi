<template>
  <div class="measureDiv">
    <el-dropdown trigger="click" @command="handleCommand">
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
import config from './config';

export default {
  name: 'MeasureMenu',
  methods: {
    handleCommand(command) {
      if (command === 'a') {
        this.test()
      }
    },
    async test() {
      const [Legend, SketchViewModel, GraphicsLayer] = await loadModules(['esri/widgets/Legend',
      'esri/widgets/Sketch/SketchViewModel',
      'esri/layers/GraphicsLayer'], config.options)
      const view = this.$store.state._defaultMapView
      console.log(view);
      const legend = new Legend({
        view,
      })
      console.log(this.$store.state.a);
      view.ui.add(legend, 'top-left')
      const sketchLayer = new GraphicsLayer()
      view.map.add(sketchLayer)
      const sketch = new SketchViewModel({
        view,
        layer: sketchLayer
      })
      console.log(sketch);
      sketch.create('polyline')
    }
  }
}
</script>

<style>
  .measureDiv {
    position: absolute;
    left: 80px;
    top: 100px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

</style>