<template>
  <div class="menu-bar">
    <div class="menu-item">
      <el-popover
        placement="right-start"
        title="Add Layer"
        trigger="hover">
        <el-button slot="reference">
          <img :src="require('assets/image/mapwidget/layer.svg')" alt="layer"  />
        </el-button>
      </el-popover>
    </div>
    <div class="menu-item">
      <el-popover
        placement="right-start"
        title="Add Layer"
        trigger="hover">
        <el-button slot="reference">
          <img :src="require('assets/image/mapwidget/layer.svg')" alt="layer" />
        </el-button>
      </el-popover>
    </div>
    <div class="menu-item">
      <el-popover
        placement="right-start"
        title="Add Layer"
        trigger="hover">
        <el-button slot="reference">
          <img :src="require('assets/image/mapwidget/layer.svg')" alt="layer" />
        </el-button>
      </el-popover>
    </div>
    <div class="menu-item">
      <el-popover
        placement="right-start"
        title="二三维切换"
        trigger="hover">
        <el-button slot="reference">
          <img :src="require('assets/image/mapwidget/layer.svg')" alt="layer" />
        </el-button>
      </el-popover>
    </div>
    <div class="menu-item" @click="toMultiScreen">
      <el-popover
        placement="right-start"
        title="多屏对比"
        trigger="hover">
        <el-button slot="reference">
          <img :src="require('assets/image/mapwidget/layer.svg')" alt="layer" />
        </el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuBar",
  methods: {
    toMultiScreen() {
      this.$router.push('/multiscreen')
    },
  }
}
</script>

<style>
  .menu-bar {
    position: absolute;
    right: 80px;
    top: 200px;
    display: flex;
    flex-flow: column nowrap;
    background-color: #303133;
  } 

  .el-popover {
    width: 110px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
  }

  .el-button {
    background-color: rgba(0, 0, 0, 0)  !important;
    padding: 2.5px 3px !important;
  }

  .el-button img {
    width: 30px;
    height: 35px;
  }
</style>