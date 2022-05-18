<template>
  <div class="catelog-tree">
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="[6]"
      :props="defaultProps"
      @check-change="handleCheckChange">
    </el-tree>
  </div>
</template>

<script>
import {loadModules} from 'esri-loader'

const options = {
  version: '4.23',
  css: true
}

export default {
  name: 'AddLayer',
  created() {
    this.loadFeatureLayers()
  },
  data() {
    return {
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '特征',
        children: [{
          id: 5,
          label: '火车站点'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '行政区划',
        children: [{
          id: 7,
          label: '省级'
        }, {
          id: 8,
          label: '市级'
        }, {
          id: 9,
          label: '县级'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      provinceLayer: '',
      cityLayer: '',
      countyLayer: '',
      trainLayer: '',
    };
  },
  methods: {
    handleCheckChange(node, isChecked) {
      switch(node.id) {
        case 5:
          this.handleTrain(isChecked)
          break
        case 7:
          this.handleProvince(isChecked)
          break
        case 8:
          this.handleCity(isChecked)
          break
        case 9: 
          this.handleCounty(isChecked)
          break
        default:
          break
      }
    },
    async loadFeatureLayers() {
      const [FeatureLayer] = await loadModules([
        'esri/layers/FeatureLayer'
      ], options)

      const provinceLayer = new FeatureLayer({
        url: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/province_webmercator/FeatureServer',
        title: '省级行政边界'
      })

      const cityLayer = new FeatureLayer({
        portalItem: {
          id: '2dc15cf78521440cbce4314274e29db8'
        },
        title: '市级行政边界'
      })

      const countyLayer = new FeatureLayer({
        portalItem: {
          id: '73bbbf88690a481e953f05a9b1a8a1a7'
        },
        title: '县级行政边界'
      })

      const trainLayer = new FeatureLayer({
        portalItem: {
          id: '37930247742e4bcaa99fe230698b8b50'
        },
        title: '全国火车站点'
      })
      this.provinceLayer = provinceLayer
      this.cityLayer = cityLayer
      this.countyLayer = countyLayer
      this.trainLayer = trainLayer
    },
    handleTrain(isChecked) {
      if (isChecked) {
        this.$store.state.defaultView.map.add(this.trainLayer)
      } else {
        this.$store.state.defaultView.map.remove(this.trainLayer)
      }
    },
    handleProvince(isChecked) {
      if (isChecked) {
        this.$store.state.defaultView.map.add(this.provinceLayer)
      } else {
        this.$store.state.defaultView.map.remove(this.provinceLayer)
      }
    },
    handleCity(isChecked) {
      if (isChecked) {
        this.$store.state.defaultView.map.add(this.cityLayer)
      } else {
        this.$store.state.defaultView.map.remove(this.cityLayer)
      }
    },
    handleCounty(isChecked) {
      if (isChecked) {
        this.$store.state.defaultView.map.add(this.countyLayer)
      } else {
        this.$store.state.defaultView.map.remove(this.countyLayer)
      }
    }
  }
};
</script>

<style>
  .catelog-tree {
    position: absolute;
    left: 80px;
    top: 100px;
  }

  .el-tree {
    background-color: #303133cf !important;
    color: #fff !important;
  }

  .el-tree-node {
    padding: 5px 20px 5px 10px
  }


  .el-tree-node__content:hover,
  .el-upload-list__item:hover {
    background-color: #303133 !important;
  }
</style>