<template>
  <div class="my-card">
    <!--  标题  -->
    <div class="header">
      <div>
        {{ title }}
      </div>
      <div class="dot" v-bind:class="{ fail: !flag }">
      </div>
    </div>
    <div class="header-second">
      <div>
        {{ subTitle }}
      </div>
    </div>
    <div class="content">
      {{ content }}
    </div>
  </div>
</template>

<script>
  export default {
    name: "MyCard",
    props: {
      title: {
        type: String,
        default: ''
      },
      subTitle: {
        type: String,
        default: ''
      },
      flag: {
        type: Boolean,
        default: false
      },
      content: {
        type: String,
        default: ''
      }
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
    border-radius: 4px;
    border: 1px solid #ebeef5;
    overflow: hidden;
    color: #303133;
    transition: .2s;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      font-weight: 800;
      .dot {
        width: 13px;
        background: #30f1bd;
        height: 13px;
        border-radius: 50%;
      }

      .fail {
        background: #a8b3b0;
      }
    }

    .header-second {
      display: flex;
      font-size: 13px;
    }

    .content {
      padding-top: 10px;
      padding-bottom: 20px;
      font-size: 20px;
      text-align: center;
    }

    &:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      cursor: pointer;
    }
  }
</style>
