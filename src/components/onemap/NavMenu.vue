<template>
  <div class="nav-menu">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="_handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="1">添加图层</el-menu-item>
      <el-submenu index="2">
        <template slot="title">测量选项</template>
        <el-menu-item index="2-1">距离测量</el-menu-item>
        <el-menu-item index="2-2">面积测量</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">查询功能</template>
        <el-menu-item index="3-1">空间查询</el-menu-item>
        <el-menu-item index="3-2">属性查询</el-menu-item>
      </el-submenu>
      <el-menu-item index="4">多屏对比</el-menu-item>
      <el-menu-item index="4">卷帘分析</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import {loadModules} from 'esri-loader'
import options from 'components/config'


export default {
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      measureSketch: '',
      measureSketchLayer: '',
    };
  },
  mounted() {
    // init sketch
    const checkView = setInterval(() => {
      if (this._currentMapView) {
        this._initSketchViewModel()
        clearInterval(checkView)
      }
    })
  },
  computed: {
    _currentMapView() {
      return this.$store.state._defaultMapView
    }
  },
  methods: {
    _handleSelect(key) {
      switch (key.substr(0, 1)) {
        case '1':
          break
        case '2':
          this._assignMeasure(key)
          break
        case '3':
          break
      }
    },
    _assignMeasure(key) {
        switch (key.slice(-1)) {
          case '1':
            this._createMeasure('polyline')
            break
          case '2':
            this._createMeasure('polygon')
            break
        } 
      },
    _createMeasure(type) {
      const _self = this
      const map =  _self._currentMapView.map
      // make sure sketch exist 
      if (_self.measureSketch) {
        // clear layer when create new measure
        if (_self.measureSketchLayer.graphics.length) {
          _self.measureSketchLayer.removeAll()
        }
        const distanceLabel = map.findLayerById('distanceLabel')
        if (distanceLabel) {
          map.remove(distanceLabel)
        }
        const areaLabel = map.findLayerById('areaLabel')
        if (areaLabel) {
          map.remove(areaLabel)
        }
        switch (type) {
          case 'polyline':
            _self.measureSketch.create('polyline')
            break
          case 'polygon':
            _self.measureSketch.create('polygon')
            break
        } 
      }
    },
    // init sketchVM for measure
    async _initSketchViewModel() {
      const _self = this
      const map =  _self._currentMapView.map
      const [GraphicsLayer,
            FeatureLayer,
            SketchViewModel,
            GeometryService,
            LengthsParameters,
            AreasAndLengthsParameters] = await loadModules([
        'esri/layers/GraphicsLayer',
        'esri/layers/FeatureLayer',
        'esri/widgets/Sketch/SketchViewModel',
        'esri/tasks/GeometryService',
        'esri/tasks/support/LengthsParameters',
        'esri/tasks/support/AreasAndLengthsParameters'
      ], options) 

      const measureSketchLayer = new GraphicsLayer()
      map.add(measureSketchLayer)

      // create sketch
      const polylineSymbol = {
        type: 'simple-line',
        color: 'red',
        style: 'solid',
        width: 3
      }
      const polygonSymbol = {
        type: 'simple-fill',
        color: [255, 0, 0, 0.4],
        outline: {
          color: 'white',
          width: 1
        }
      }
      const measureSketch = new SketchViewModel({
        view: _self._currentMapView,
        polylineSymbol,
        polygonSymbol,
        layer: measureSketchLayer,
        updateOnGraphicClick: false
      })

      _self.measureSketch = measureSketch
      _self.measureSketchLayer = measureSketchLayer

      // init geomService parameters
      const url = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer'
      const geometryService = new GeometryService({
        url
      })

      // listen and measure
      measureSketch.on('create', (e) => {
        if (e.state === 'complete') {
          const geomType = e.graphic.geometry.type
          // distance measure
          if (geomType === 'polyline') {
            const lengthsParameters = new LengthsParameters({
              lengthUnit: 9036,
              polylines: e.graphic.geometry,
            })
            geometryService.lengths(lengthsParameters)
              .then((results) => {
                // show measure result as label
                const distanceGraphic = []
                distanceGraphic.push(e.graphic)
                const labelClass = {
                  symbol: {
                    type: 'text',
                    color: 'white',
                    font: {
                      family: "Ubuntu Mono",
                      size: 14,
                      weight: "bold"
                    }
                  },
                  labelPlacement: 'center-along',
                  labelExpression: `${Number(results.lengths).toFixed(2)}km`,
                }
                const distanceLabelLayer = new FeatureLayer({
                  source: distanceGraphic,
                  id: 'distanceLabel',
                  objectIdField: '1',
                  labelingInfo: [labelClass],
                  opacity: 0
                })
                map.add(distanceLabelLayer)
              })
          }
          if (geomType === 'polygon') {
            const areasAndLengthsParameters = new AreasAndLengthsParameters({
              areaUnit: 'square-kilometers',
              polygons: e.graphic.geometry,
            })
            geometryService.areasAndLengths(areasAndLengthsParameters)
            .then((result) => {
              this.result = Number(result.areas).toFixed(2)
              const areaGraphic = []
              areaGraphic.push(e.graphic)
              const labelClass = {
                symbol: {
                  type: 'text',
                  color: 'white',
                  font: {
                    family: "Ubuntu Mono",
                    size: 14,
                    weight: "bold"
                  }
                },
                labelPlacement: 'always-horizontal',
                labelExpression: `${Number(result.areas).toFixed(2)}km2`,
              }
              const areaLabelLayer = new FeatureLayer({
                source: areaGraphic,
                id: 'areaLabel',
                objectIdField: '1',
                labelingInfo: [labelClass],
                opacity: 0
              })
              map.add(areaLabelLayer)
            })
          }
        }
      })
    },
  }
  }
</script>

<style scoped>
  .nav-menu {
    position: absolute;
    top: 80px;
    right: 50px;
  }

  .nav-menu /deep/ .el-menu--horizontal>.el-menu-item {
    height: 30px;
    line-height: 30px;
  }

  .nav-menu >>> .el-menu--horizontal>.el-submenu .el-submenu__title {
    height: 30px;
    line-height: 30px;
  }

</style>