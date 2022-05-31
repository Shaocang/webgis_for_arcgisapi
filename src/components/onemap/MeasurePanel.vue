<template>
  <div class="measure-panel">
    <div class="options">
      <el-select v-model="unit" placeholder="请选择测量单位">
        <el-option
          v-for="item in units"
          :key="item.unit"
          :label="item.label"
          :value="item.unit">
        </el-option>
      </el-select>
      <el-select v-model="type" placeholder="请选择测量类型">
        <el-option
          v-for="item in types"
          :key="item.type"
          :label="item.label"
          :value="item.type">
        </el-option>
      </el-select>
    </div>
    <div class="results">
      <span>测量结果：{{getMeasureResult}}</span>
    </div>
  </div>
</template>

<script>
import {loadModules} from 'esri-loader'
import options from 'components/config'
import eventBus from 'assets/eventBus'

export default {
  name: 'MeasurePanel',
  mounted() {
    const _self = this
    // brother components communication
    eventBus.$on('getMeasure', (value) => {
      _self.measureType = value
      _self.result = 0
      if (value === 'polyline') {
        _self.units = [{
          unit: 9036,
          label: 'kilometers'
        }, {
          unit: 9001,
          label: 'meters'
        }, {
          unit: 1025,
          label: 'millimeters'
        }, {
          unit: 9093,
          label: 'miles'
        }]
        _self.unit = 9036
      }
      if (value === 'polygon') {
        _self.units = [{
          unit: 'acres',
          label: 'acres'
        }, {
          unit: 'square-miles',
          label: 'square-miles'
        }, {
          unit: 'square-kilometers',
          label: 'square-kilometers'
        }, {
          unit: 'square-meters',
          label: 'square-meters'
        },{
          unit: 'square-feet',
          label: 'square-feet'
        }]
        _self.unit = 'square-kilometers'
      }
      _self.type = 'planar'
      _self._createMeasure()
    })
    // init sketch
    const checkView = setInterval(() => {
      if (this._currentMapView) {
        this._initSketchViewModel()
        clearInterval(checkView)
      }
    })
  },
  data() {
    return {
      measureType: '',
      measureSketch: '',
      measureSketchLayer: '',
      units: [],
      unit: '',
      types: [{
        type: 'planar',
      }, {
        type: 'geodesic',
      }, {
        type: 'preserve-shape',
      }],
      type: '',
      result: 0,
    }
  },
  computed: {
    getMeasureResult() {
      return this.result
    },
    _currentMapView() {
      return this.$store.state._defaultMapView
    }
  },
  methods: {
    _createMeasure() {
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
        switch (_self.measureType) {
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
              lengthUnit: _self.unit,
              polylines: e.graphic.geometry,
              calculationType: _self.type
            })
            geometryService.lengths(lengthsParameters)
              .then((results) => {
                this.result = Number(results.lengths).toFixed(2)
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
                  labelExpression: _self.getMeasureResult,
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
              areaUnit: _self.unit,
              polygons: e.graphic.geometry,
              calculationType: _self.type
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
                labelExpression: _self.getMeasureResult,
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
  .measure-panel {
    position: absolute;
    top: 80px;
    left: 80px;
    background-color: #fff;
  }

  .el-button {
    width: 100%;
  }

  .options {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }

  .el-select:first-child {
    margin-right: 20px
  }

  .options >>> .el-input__inner {
    height: 30px;
    max-width: 150px
  }

  .options >>> .el-input__suffix {
    top: 5px;
  }

  .options >>> .el-input__icon {
    line-height: inherit;
  }

  .options >>> .el-input__suffix-inner {
    display: inline-block;
  }

</style>