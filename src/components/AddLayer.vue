<template>
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
</template>

<script>
export default {

}
</script>

<style>

</style>