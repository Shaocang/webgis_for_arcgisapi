<template>
  <div class="page-layout">
    <el-container class="page-container">
      <el-header>
        <span>WebGIS项目初体验</span>
      </el-header>
      <el-container>
        <el-aside>
          <el-menu :collapse=true>
            <el-menu-item index="1">
              <i class="el-icon-monitor"></i>
              <span slot="title">WebGIS大屏</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-picture-outline"></i>
              <span slot="title">WebGIS一张图</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'PageLayout'
}
</script>

<style>
  .page-layout, .page-container {
    width: 100%;
    height: 100%;
  }

  .el-header {
    background-color: #303133;
    color: #fff;
    text-align: left;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #303133;
    color: #fff;
    width: 63px !important;
    text-align: center;
    overflow: hidden !important;
  }

  .el-menu {
    background-color: rgba(0, 0, 0, 0) !important;
  }

  .el-menu-item:hover {
    cursor: pointer !important;
    background-color: #303133 !important;
  }

  .el-menu-item i::before {
    color: white;
  }

  .el-menu-item i:hover::before {
    color: yellow;
  }


</style>