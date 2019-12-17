<template>
  <div class="my-dialog">
    <svg-header>
      <el-button @click="validatorModal = true" size="small" class="absolute-btn">设置</el-button>
    </svg-header>

<!--    <div class="unit">型号：{{ materialGroup || '&#45;&#45;' }}-{{ materialName || '&#45;&#45;' }}</div>-->
    <div>
      <my-card :id="`my-card` + index" v-for="(item, index) in list" :key="index" :title="item.name"
               :sub-title="item.materialName || 'materialName'" :startTime="item.startDate || ''"
               :endTime="item.endDate || ''"
               :flag="item.result === 'P'"></my-card>
    </div>
    <watch-table :watch-dialog="showWatchDialog" @close-watch-dialog="showWatchDialog = false"></watch-table>
    <!--  校验密码的modal  -->
    <el-dialog title="验证密码" :visible.sync="validatorModal" width="40%" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form :model="validatorForm" :rules="validatorRules" ref="validator-form">
        <el-form-item prop="pwd">
          <el-input v-model="validatorForm.pwd" auto-complete="off" show-password @keyup.native.enter="confirmPwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmPwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import 'animate.css'
  import MyCard from '../components/MyCard.vue';
  import WatchTable from '../components/WatchTable.vue';
  import {dashStations, validatePwd, modifyPwd} from '../apis/dashboard';
  import {session} from '../apis/setup';
  import SvgHeader from '@/components/SvgHeader';
  import {removeValue, getValue, setValue} from '@/utils/validate.js';

  function animateCSS(element, animationName, callback) {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
      node.classList.remove('animated', animationName)
      node.removeEventListener('animationend', handleAnimationEnd)

      if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
  }

  export default {
    name: 'Dashboard',
    components: {
      MyCard,
      WatchTable,
      SvgHeader
    },
    data() {
      return {
        unitId: '', // 标题栏unitID
        materialGroup: '', // nav栏
        materialName: '', // nav栏
        list: [],
        // dialog
        showWatchDialog: false,
        // 验证密码modal
        validatorForm: {
          pwd: ''
        },
        validatorRules: {
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        validatorModal: false
      };
    },
    created() {

    },
    async mounted() {
      // this.judgeSession().then(async (res) => {
      //   await this.initList();
      //   // 判断session及获取list后再进行websocket连接
      //   this.initWebSocket();
      // });
      await this.initList();
      // 判断session及获取list后再进行websocket连接
      this.initWebSocket();
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
        const serviceIp = '172.28.101.188:9806';
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
            const obj = data[k]['info'][data[k]['info'].length - 1] || {};// 读取最后一条。
            this.unitId = obj.unitId; // 将推送过来的unitId放到上方nav栏
            this.materialGroup = obj.materialGroup; // 将推送过来的materialGroup放到上方nav栏
            this.materialName = obj.materialName; // 将推送过来的materialName放到上方nav栏

            const i = this.list.findIndex(item => item.alias === k);
            const arr = [...this.list];
            arr[i] = Object.assign({}, this.list[i], obj);
            this.list = arr;

            // animateCSS(`#my-card${i}`, 'bounce');
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
      /**
       * 点击设置
       */
      // 需要先拦截一下，有密码保护
      clickSetBtn() {
        this.validatorModal = true;
        // this.$prompt('请输入密码', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        // }).then(({value}) => {
        //   validatePwd({password: value}).then(res => {
        //     if (res.success) {
        //       this.$message.success(res.data.message);
        //       setValue('isLogin', 1);
        //       this.$nextTick(() => {
        //         // this.showWatchDialog = true;
        //         this.$router.push(`/setting`);
        //       })
        //     } else {
        //       this.$message.error(res.data.errorMessage);
        //     }
        //   }).catch(e => {
        //     this.$message.error('接口请求错误');
        //   })
        // }).catch(() => {
        // });
      },
      validateForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          flag = !!valid;
        });
        return flag
      },
      confirmPwd() {
        const val = this.validatorForm.pwd;
        if (!this.validateForm('validator-form')) return;
        validatePwd({password: val}).then(res => {
          if (res.success) {
            this.$message.success(res.data.message);
            setValue('isLogin', 1);
            this.validatorModal = false;
            this.$nextTick(() => {
              this.$router.push(`/setting`);
            })
          } else {
            this.$message.error(res.data.errorMessage);
          }
        }).catch(e => {
          this.$message.error('接口请求错误');
        })
      }
    },
  };
</script>

<style lang="scss">
  .absolute-btn {
    background: #FEA500;
    border-color: #FEA500;
    position: absolute;
    right: 20px;
  }
  .my-dialog {
    .unit {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px 10px 0 10px;
      color: #DA6C3D;
      background: #ffffff;
      padding: 5px;
      font-size: 21px;
      font-weight: 500;
      border-radius: 4px;
      border: 1px solid #ebeef5;
    }
     .el-dialog__header {
      span.el-dialog__title:before {
        margin-right: 4px;
        content: '*';
        color: red;
      }
    }
    .el-dialog__body {
      padding: 15px;
    }
  }
</style>
