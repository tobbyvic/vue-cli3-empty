<template>
  <div class="my-card">
    <!--  标题  -->
    <div class="header">
      left-title
    </div>
    <div class="content">
      my-card-content
    </div>
  </div>
</template>

<script>
  export default {
    name: "MyCard",
    props: {
      propName: {
        type: Number,
        default: 0
      },
    }
  }
</script>

<style lang="scss" scoped>
  .my-card {
    margin: 10px;
    background: #ffffff;
    display: inline-flex;
    flex-flow: column;
    padding: 20px;
    width: 250px;
    .header {
      display: flex;
    }
    .content {
      padding: 20px 0;
      font-size: 20px;
      text-align: center;
    }
  }
</style>
