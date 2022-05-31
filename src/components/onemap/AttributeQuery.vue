<template>
  <div class="attribute-query" v-show="isShow">
    <el-autocomplete
      popper-class="my-autocomplete"
      v-model="state"
      :fetch-suggestions="querySearch"
      placeholder="请输入省份"
      @select="handleSelect">
      <i
        class="el-icon-edit el-input__icon"
        slot="suffix">
      </i>
      <template slot-scope="{ item }">
        <div class="name">{{ item.value }}</div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
import eventBus from 'assets/eventBus'

export default {
  name: 'AttributeQuery',
  mounted() {
    const _self = this
    eventBus.$on('attributeQueryEvent', (isClick) => {
      if (isClick) {
        _self._loadAll(isClick)
      } else {
        _self.isShow = isClick
      }
    })
  },
  data() {
    return {
      provinces: [],
      state: '',
      isShow: false
    };
  },
  computed: {
    _currentMapView() {
      return this.$store.state._defaultMapView
    }
  },
  methods: {
    querySearch(queryString, cb) {
      var provinces = this.provinces;
      var results = queryString ? provinces.filter(this.createFilter(queryString)) : provinces;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (province) => {
        return (province.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    _loadAll(isClick) {
      const _self = this
      const map = _self._currentMapView.map
      const provinceLayer = map.layers.filter(layer => layer.id === '5').getItemAt(0)
      if (!provinceLayer) {
        _self.$message({
          message: '请添加省级图层',
          type: 'warning'
        })
        return
      } 
      const query = provinceLayer.createQuery()
      query.outFields = '*'
      provinceLayer.queryFeatures(query)
        .then((featureset) => {
          featureset.features.forEach((feature) => {
            this.provinces.push({'value': feature.attributes['省区']})
          })
        })
        _self.isShow = isClick
    },
    handleSelect(select) {
      console.log(select.value);
    }
  },
}
</script>

<style>
  .attribute-query {
    position: absolute;
    top: 300px;
    left: 80px;
  }

  .my-autocomplete li {
    line-height: normal;
    padding: 7px;
  }

  .my-autocomplete li .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .my-autocomplete li .addr {
    font-size: 12px;
    color: #b4b4b4;
  }

  .my-autocomplete li .highlighted,
  .my-autocomplete li .addr {
    color: #ddd;
  }
  
</style>