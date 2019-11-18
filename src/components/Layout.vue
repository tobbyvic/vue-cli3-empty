<template>
  <div>
    <el-header class="layout-header">Header</el-header>
    <div class="page">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
};
</script>

<style lang="scss" scoped>
  .layout-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 20px;
    background-color: #303136;
    -webkit-box-shadow: 0 2px 2px 0 #000;
    box-shadow: 0 2px 2px 0 #000;
  }
</style>
