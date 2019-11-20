<template>
  <div>
    <my-card v-for="(item, index) in list" :key="index" :title="item.name" :sub-title="item.materialName || 'materialName'" :content="item.alias" :flag="item.result === 'P'"></my-card>
  </div>
</template>

<script>
  import MyCard from '../components/MyCard';
  import {dashStations} from '../apis/dashboard.js'
  import {session} from '../apis/setup.js'

  export default {
    name: "Dashboard",
    components: {
      MyCard
    },
    data() {
      return {
        list: []
      }
    },
    created() {
      this.initWebSocket();
    },
    async mounted() {
      this.judgeSession().then(async res => {
        await this.initList();
      });
      // 浏览器关闭事件，closeWebSocket
      let	vm = this;
      window.onbeforeunload = function () {
        vm.closeWebSocket();
      }
    },
    beforeDestroy() {
      // beforeDestroy，closeWebSocket
      this.closeWebSocket();
    },
    methods: {
      // 判断有无session, 有则跳到setup
      async judgeSession() {
        return new Promise((resolve, reject) => {
          session().then(res => {
            if (res.success) {
              this.$router.push('/setup');
              reject();
            } else {
              resolve();
            }
          }).catch(e => {
            resolve();
          })
        })
      },
      // 初始化面板列表
      async initList() {
        return new Promise((resolve, reject) => {
          dashStations().then(res => {
            this.list = res.data.map(item => item);
            resolve(res);
          }).catch(e => {
            console.log(e.message)
          })
        })
      },
      // 初始化websocket
      initWebSocket() {
        //判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
          let serviceIp = "172.28.101.5:9806";
          this.websocket = new WebSocket("ws://" + serviceIp + "/craft/getResponse");
        } else if ('MozWebSocket' in window) {
          let serviceIp = "172.28.101.5:9806";
          this.websocket = new WebSocket("ws://" + serviceIp + "/craft/getResponse");
        } else {
          console.log('当前浏览器 Not support websocket');
        }
        // this.interval = window.setInterval(function () { //每隔30秒钟发送一次心跳，避免websocket连接因超时而自动断开
        //   if (that.websocket != null) {
        //     that.websocket.send("HeartBeat");
        //     console.log("发送心跳包：HeartBeat");
        //   }
        // }, 30000);
        //连接发生错误的回调方法
        this.websocket.onerror = function (event) {
          console.log("WebSocket连接发生错误");
        };
        //连接成功建立的回调方法
        this.websocket.onopen = function (event) {
          console.log("WebSocket连接成功");
        };
        //接收到消息的回调方法
        let vm = this;
        this.websocket.onmessage = function (event) {
          console.log(JSON.parse(event.data));
          vm.updateListData(JSON.parse(event.data));
        };
        //连接关闭的回调方法
        this.websocket.onclose = function (event) {
          console.log("WebSocket连接关闭");
          this.websocket = null;
        };
      },
      // 获取数据后刷新 list
      updateListData(data) {
        if (typeof data === 'object') {
          for(let k in data) {
            let i = this.list.findIndex(item => item.alias === k);
            const arr = [...this.list];
            arr[i] = Object.assign({}, this.list[i], data[k]);
            this.list = arr;
          }
        }
      },
      //关闭WebSocket连接
      closeWebSocket() {
        if(this.websocket != null){
          this.websocket.close();
        }
        if(this.interval){
          window.clearInterval(this.interval);
          console.log("清除定时器");
        }
      },
    },
  }
</script>

<style scoped>

</style>
