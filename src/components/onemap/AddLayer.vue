<template>
  <div class="catelog-tree" v-show="isShow">
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      ref="tree"
      :default-expanded-keys="[2, 3]"
      :props="defaultProps"
      @check-change="_handleCheckChange">
    </el-tree>
  </div>
</template>

<script>
import {loadModules} from 'esri-loader'
import options from 'components/config'
import eventBus from 'assets/eventBus'

export default {
  name: 'AddLayer',
  mounted() {
    const _self = this
    eventBus.$on('addLayerEvent', (isClick) => {
      if (!isClick) {
        // 清屏
        if (_self.getCheckedKeys().length > 0) {
          _self.resetChecked()
        }
        
      }
      _self.isShow = isClick
    })
  },
  data() {
    return {
      data: [{
        id: 1,
        label: '特征图层',
        children: [{
          id: 3,
          label: '火车站点'
        }, {
          id: 4,
          label: '道路网'
        }]
      }, {
        id: 2,
        label: '行政区划',
        children: [{
          id: 5,
          label: '省级'
        }, {
          id: 6,
          label: '市级'
        }, {
          id: 7,
          label: '县级'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      layersAttr: [
        {
          id: 3,
          portalId: '37930247742e4bcaa99fe230698b8b50',
          title: '火车站点'
        },
        {
          id: 4,
          portalId: 'ba56057620334b9e9da4ecf309616d27',
          title: '全国道路网'
        },
        {
          id: 5,
          portalId: 'da2d1c9262a3417389e98ad1d2fbf99f',
          title: '省级行政区'
        },
        {
          id: 6,
          portalId: '2dc15cf78521440cbce4314274e29db8',
          title: '市级行政区'
        },
        {
          id: 7,
          portalId: '73bbbf88690a481e953f05a9b1a8a1a7',
          title: '县级行政区'
        },
      ],
      isShow: false
    };
  },
  computed: {
    // 当前View 与vuex的state绑定 如果绑定到data做不到响应式
    _currentMapView() {
      return this.$store.state._defaultMapView
    },
    //  计算layer对应上面目录树的id有哪些
    _layersId() {
      return this.layersAttr.map((attr) => {
        return attr.id
      })
    }
  },
  methods: {
    getCheckedKeys() {
        return this.$refs.tree.getCheckedKeys();
      },
    resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
    },
    // 是否选中
    _handleCheckChange(node, isChecked) {
      const _self = this
      if (_self._layersId.indexOf(node.id) > -1) {
        if (isChecked) {
          _self._addFeatureLayer(node.id)
        } else {
          _self._removeFeatureLayer(node.id)
        } 
      }  
    },
    // 添加图层 
    async _addFeatureLayer(id) {
      const _self = this
      const [FeatureLayer] = await loadModules([
        'esri/layers/FeatureLayer'
      ], options)

      if (_self._currentMapView) {
        _self.layersAttr.forEach((attr) => {
          if (attr.id === id) {
            const idStr = attr.id.toString()
            const layer = new FeatureLayer({
              portalItem: {
                id: attr.portalId
              },
              title: attr.title,
              id: idStr
            })
            _self._currentMapView.map.add(layer)
          }
        })
      }
    },
    // 删除图层
    _removeFeatureLayer(id) {
      const _self = this
      const map = _self._currentMapView.map
      if (_self._currentMapView) {
        const idStr = id.toString()
        const layer = map.findLayerById(idStr)
        map.remove(layer)
      }
      // 如果进行了空间查询 再去除火车站点图层时 也去除查询结果
      if (id === 3) {
        if (map.findLayerById('resultlayer')) {
            map.remove(map.findLayerById('resultlayer'))
          }
          if (map.findLayerById('sketchQueryLayer')) {
            map.remove(map.findLayerById('sketchQueryLayer'))
          }
      }
    }
  }
};
</script>

<style>
  .catelog-tree {
    position: absolute;
    left: 80px;
    top: 80px;
  }

  .el-tree {
    position: relative;
    cursor: pointer;
    background: #2e2e2ed9;
    color: #e4e7ed;
  }

  .el-tree-node__content {
    padding-right: 20px;
  }

  .el-tree-node__content:hover {
    background-color: #909399 !important;
  }

  .el-tree-node:focus > .el-tree-node__content {
    background-color: #909399 !important;
  }
</style>