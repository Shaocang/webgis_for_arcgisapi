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
      <
    </div>
  </div>
</template>

<script>

export default {
  name: 'MeasurePanel',
  data() {
    return {
      
      unit: '',
      
      type: '',
    }
  }
}
</script>


<style scoped>
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