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
    <!--    <div class="header-second">-->
    <!--      <div>-->
    <!--        {{ subTitle }}-->
    <!--      </div>-->
    <!--    </div>-->
<!--    <el-collapse v-model="activeNames">-->
<!--      <el-collapse-item title="一致性 Consistency" name="1">-->
<!--        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>-->
<!--      </el-collapse-item>-->
<!--    </el-collapse>-->
    <div class="content">
      <div>
        <span style="font-weight: 600">开始时间:</span>{{ startTime || '' }}
      </div>
      <div>
        <span style="font-weight: 600">结束时间:</span>{{ endTime || '' }}
      </div>
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
        type: [String,Number],
        default: ''
      },
      startTime: {
        type: String,
        default: ''
      },
      endTime: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        activeNames: ["1"]
      }
    },
  }
</script>

<style lang="scss" scoped>
  .my-card {
    margin-left: 10px;
    margin-top: 10px;
    background: #ffffff;
    display: inline-flex;
    flex-flow: column;
    padding: 10px;
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
      font-weight: 600;
      .dot {
        width: 13px;
        background: #4CB843;
        height: 13px;
        border-radius: 50%;
      }

      .fail {
        background: #7F7F7F;
      }
    }

    .header-second {
      display: flex;
      font-size: 13px;
    }

    .content {
      padding: 10px 0;
      font-size: 14px;
      /*font-weight: 800;*/
      /*text-align: center;*/
    }

    &:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      cursor: pointer;
    }
  }
</style>
