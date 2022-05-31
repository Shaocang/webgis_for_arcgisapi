<template>
  <div class="attribute-query">
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
        <span class="addr">{{ item.address }}</span>
      </template>
    </el-autocomplete>
    <button @click="_loadAll">加载数据</button>
  </div>
</template>

<script>
export default {
  name: 'AttributeQuery',
  data() {
    return {
      provinces: [],
      state: ''
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
    _loadAll() {
      const _self = this
      const map = _self._currentMapView.map
      const provinceLayer = map.layers.filter(layer => layer.id === '5').getItemAt(0)
      const query = provinceLayer.createQuery()
      query.outFields = '*'
      provinceLayer.queryFeatures(query)
        .then((featureset) => {
          console.log(featureset.features);
          featureset.features.forEach((feature) => {
            console.log(feature.attributes['省区']);
            this.provinces.push({'value': feature.attributes['省区']})
          })
        })
    },
    handleSelect(item) {
      console.log(item.value);
    },
  },
}
</script>

<style>
  .attribute-query {
    position: absolute;
    top: 300px;
    right: 200px;
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