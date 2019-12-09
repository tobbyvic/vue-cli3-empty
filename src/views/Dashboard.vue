<template>
  <div>
    <el-header class="layout-header">工站管理(<span style="color: #FFA500">{{ unitId || '--'}}</span>)</el-header>
    <div class="unit">型号：{{ materialGroup || '--' }}-{{ materialName || '--' }}</div>
    <div>
      <my-card v-for="(item, index) in list" :key="index" :title="item.name"
               :sub-title="item.materialName || 'materialName'" :startTime="item.startDate || '--'"
               :endTime="item.endDate || '--'"
               :flag="item.result === 'P'"></my-card>
    </div>
  </div>
</template>

<script>
  import MyCard from '../components/MyCard.vue';
  import {dashStations} from '../apis/dashboard';
  import {session} from '../apis/setup';

  export default {
    name: 'Dashboard',
    components: {
      MyCard,
    },
    data() {
      return {
        unitId: '', // 标题栏unitID
        materialGroup: '', // nav栏
        materialName: '', // nav栏
        list: [],
      };
    },
    created() {

    },
    async mounted() {
      this.judgeSession().then(async (res) => {
        await this.initList();
        // 判断session及获取list后再进行websocket连接
        this.initWebSocket();
      });
      // 浏览器关闭事件，closeWebSocket
      const vm = this;
      window.onbeforeunload = function () {
        vm.closeWebSocket();
      };
    },
    beforeDestroy() {
      // beforeDestroy，closeWebSocket
      this.closeWebSocket();
    },
    methods: {
      // 判断有无session, 有则跳到setup
      async judgeSession() {
        return new Promise((resolve, reject) => {
          session().then((res) => {
            if (res.success) {
              this.$router.push('/setup');
              reject();
            } else {
              resolve();
            }
          }).catch((e) => {
            resolve();
          });
        });
      },
      // 初始化面板列表
      async initList() {
        return new Promise((resolve, reject) => {
          dashStations().then((res) => {
            this.list = res.data.map(item => item);
            resolve(res);
          }).catch((e) => {
            console.log(e.message);
          });
        });
      },
      // 初始化websocket
      initWebSocket() {
        const serviceIp = '172.28.101.5:9806';
        // 判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
          this.websocket = new WebSocket(`ws://${serviceIp}/craft/getResponse`);
        } else if ('MozWebSocket' in window) {
          this.websocket = new WebSocket(`ws://${serviceIp}/craft/getResponse`);
        } else {
          console.log('当前浏览器 Not support websocket');
        }
        // this.interval = window.setInterval(function () { //每隔30秒钟发送一次心跳，避免websocket连接因超时而自动断开
        //   if (that.websocket != null) {
        //     that.websocket.send("HeartBeat");
        //     console.log("发送心跳包：HeartBeat");
        //   }
        // }, 30000);
        // 连接发生错误的回调方法
        this.websocket.onerror = function (event) {
          console.log('WebSocket连接发生错误');
        };
        // 连接成功建立的回调方法
        this.websocket.onopen = function (event) {
          console.log('WebSocket连接成功');
        };
        // 接收到消息的回调方法
        const vm = this;
        this.websocket.onmessage = function (event) {
          console.log(JSON.parse(event.data));
          vm.updateListData(JSON.parse(event.data));
        };
        // 连接关闭的回调方法
        this.websocket.onclose = function (event) {
          console.log('WebSocket连接关闭');
          this.websocket = null;
        };
      },
      // 获取数据后刷新 list
      updateListData(data) {
        if (typeof data === 'object') {

          for (const k in data) {
            this.unitId = data[k].unitId; // 将推送过来的unitId放到上方nav栏
            this.materialGroup = data[k].materialGroup; // 将推送过来的materialGroup放到上方nav栏
            this.materialName = data[k].materialName; // 将推送过来的materialName放到上方nav栏

            const i = this.list.findIndex(item => item.alias === k);
            const arr = [...this.list];
            arr[i] = Object.assign({}, this.list[i], data[k]);
            this.list = arr;
          }
        }
      },
      // 关闭WebSocket连接
      closeWebSocket() {
        if (this.websocket != null) {
          this.websocket.close();
        }
        if (this.interval) {
          window.clearInterval(this.interval);
          console.log('清除定时器');
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .unit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 10px 0 10px;
    border-radius: 3px;
    color: #DA6C3D;
    background: #303136;
    padding: 5px;
    font-size: 21px;
    font-weight: 500;
  }

</style>
