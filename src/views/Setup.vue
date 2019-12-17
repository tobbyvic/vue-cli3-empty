<template>
  <div class="page_setup" v-loading.fullscreen="loading"
       :element-loading-text="`${loadingNum} 秒后跳转`"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
<!--    <el-header class="layout-header">工站管理</el-header>-->
    <svg-header>
<!--      <el-button @click="clickSetBtn" size="small" class="absolute-btn">设置</el-button>-->
    </svg-header>
    <div class="top">
      <div class="step-container">
        <el-steps :active="active" finish-status="success" :align-center="true">
          <el-step title="步骤 1"></el-step>
          <el-step title="步骤 2"></el-step>
          <el-step title="步骤 3"></el-step>
        </el-steps>
      </div>
    </div>
    <div class="main">
      <!--第一步-->
      <el-form width="600" v-if="active === 0" :model="form1" :rules="rules1" ref="ruleForm1"
               label-width="180px" label-position="left">
        <el-form-item label="Host" prop="ip">
          <el-input style="width: 300px" v-model="form1.ip"></el-input>
        </el-form-item>
        <el-form-item label="Port" prop="port">
          <el-input-number style="width: 300px" v-model="form1.port" controls-position="right" :min="0" :max="65535"
                           :precision="0"></el-input-number>
        </el-form-item>
        <el-form-item label="Server Name" required prop="db">
          <el-input style="width: 300px" v-model="form1.db"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input style="width: 300px" v-model="form1.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input style="width: 300px" v-model="form1.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="cpassword">
          <el-input style="width: 300px" v-model="form1.cpassword" show-password></el-input>
        </el-form-item>
      </el-form>
      <!--第二步-->
      <div v-show="active === 1">
        <el-form :model="form2" :rules="rules2" ref="ruleForm2" label-width="100px">
          <el-form-item label="项目名称" prop="project">
            <el-input style="width: 300px" v-model="form2.project"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="showModal = true">
              选择工站
            </el-button>
          </el-form-item>
        </el-form>
        <el-table border height="400" style="width: 1200px" stripe
                  ref="table1"
                  :data="tableData" row-key="id">
          <el-table-column
            column-key="index"
            type="index"
            label="序号"
            width="150">
          </el-table-column>
          <el-table-column
            column-key="name"
            prop="name"
            label="工站名称"
            width="350">
          </el-table-column>
          <el-table-column
            column-key="filePath"
            prop="filePath"
            label="文件路径"
            width="450">
            <template slot-scope="scope">
              <el-input v-model="scope['row'].filePath" placeholder="请输入文件路径"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作">
            <template slot-scope="scope">
              <el-button icon="el-icon-arrow-up" @click="moveRow(scope.row, scope.$index, 'up')" type="text"
                         size="small">上移
              </el-button>
              <el-button icon="el-icon-arrow-down" @click="moveRow(scope.row, scope.$index, 'down')" type="text"
                         size="small">
                下移
              </el-button>
              <el-button icon="el-icon-delete" @click="delRow(scope.row, scope.$index)" type="text" size="small">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--第三步-->
      <div v-show="active === 2">
        <el-form :model="form3" :rules="rules3" ref="ruleForm3" label-width="100px">
          <el-form-item label="服务地址" prop="watchHost">
            <el-input style="width: 300px" v-model="form3.watchHost"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="clickAddWatchBtn">
              新增
            </el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="table2"
          border
          :data="watchData"
          height="400" style="width: 1000px" row-key="id">
          <!--          <el-table-column-->
          <!--            column-key="index"-->
          <!--            type="index"-->
          <!--            label="序号"-->
          <!--            width="150">-->
          <!--          </el-table-column>-->
          <el-table-column
            column-key="watchName"
            prop="watchName"
            label="手表名称">
          </el-table-column>
          <el-table-column
            column-key="watchAddress"
            prop="watchAddress"
            label="手表地址">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="modifyWatchRow(scope)" type="text" size="small">修改</el-button>
              <el-button @click="delWatchRow(scope)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--底部按钮-->
    <div class="bottom">
      <span v-if="active === 0">
        <el-button type="primary" @click="firstNext('ruleForm1')">下一步</el-button>
      </span>
      <span v-if="active === 1">
        <el-button @click="active--">上一步</el-button>
        <el-button type="primary" @click="secondNext('ruleForm2')">下一步</el-button>
      </span>
      <span v-if="active === 2">
        <el-button @click="active--">上一步</el-button>
        <el-button type="primary" @click="confirm">完成</el-button>
      </span>
    </div>
    <!--打开穿梭框弹框-->
    <el-dialog
      title="提示"
      :visible.sync="showModal"
      width="600px"
      :close-on-click-modal="true">
      <el-transfer :titles="transferTitle" v-model="selectedData" :data="transferData" target-order="push">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">取 消</el-button>
        <el-button type="primary" @click="selectConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!--打开手表添加、编辑框-->
    <el-dialog
      width="500px"
      title=""
      :visible.sync="watchVisible"
      :close-on-click-modal="false" :close-on-press-escape="false"
      @close="resetForm('my-form')">
      <el-form :model="myForm" :rules="myRule" ref="my-form" label-width="100px">
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input v-model="myForm.name"></el-input>
        </el-form-item>
        <el-form-item
          label="手表地址"
          prop="address"
        >
          <el-input v-model="myForm.address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrModifyWatch('my-form')">确认</el-button>
          <el-button @click="resetForm('my-form')">清空</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import SvgHeader from '@/components/SvgHeader';
  import {
    session, dbcfg, station, stations, setupWatch
  } from '@/apis/setup';
  import {setToken} from '@/utils/token';
  // @ is an alias to /src
  export default {
    name: 'Setup',
    components: {
      SvgHeader
    },
    data() {
      const checkCpassword = (rule, value, callback) => {
        if (value === this.form1.password) {
          callback();
        } else {
          callback(new Error('两次输入密码不一致'));
        }
      };
      return {
        active: 0,
        form1: {
          ip: '',
          port: 1521,
          db: '',
          username: '',
          password: '',
          cpassword: '',
        },
        rules1: {
          ip: [
            {required: true, message: '请输入IP地址', trigger: 'blur'},
            {
              pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
              message: '请输入合法的IP地址',
              trigger: 'blur'
            },
          ],
          port: [
            {required: true, message: '请输入端口号', trigger: 'blur'}
          ],
          db: [
            {required: true, message: '请输入数据库名称', trigger: 'blur'},
            {pattern: /^[0-9a-zA-Z]+$/, message: '请输入英文或数字', trigger: 'change'},
            {min: 0, max: 10, message: '最大长度10个字符', trigger: 'change'}
          ],
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {pattern: /^[0-9a-zA-Z]+$/, message: '请输入英文或数字', trigger: 'change'},
            {min: 0, max: 10, message: '最大长度10个字符', trigger: 'change'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {pattern: /^[0-9a-zA-Z_\-!#$%^&*@.]+$/, message: '支持英文、数字、特殊字符', trigger: 'change'},
            {min: 0, max: 20, message: '最大长度20个字符', trigger: 'change'}
          ],
          cpassword: [
            {required: true, message: '请输入确认密码', trigger: 'blur'},
            {pattern: /^[0-9a-zA-Z_\-!#$%^&*@.]+$/, message: '支持英文、数字、特殊字符', trigger: 'change'},
            {min: 0, max: 20, message: '最大长度20个字符', trigger: 'change'},
            {validator: checkCpassword, trigger: 'change'}
          ],
        },
        form2: {
          project: '',
        },
        rules2: {
          project: [
            {required: true, message: '请输入项目名称', trigger: 'blur'},
            {pattern: /^[0-9a-zA-Z]+$/, message: '请输入英文或数字', trigger: 'change'},
            {min: 0, max: 10, message: '最大长度10个字符', trigger: 'change'}
            // { pattern: /^[0-9a-zA-Z]+$/, message: '支持英文或数字', trigger: 'change' },
          ],
        },
        tableData: [],
        // transfer modal
        transferTitle: ['工站列表', '已选列表'],
        transferData: [
          {key: 1, label: '工站1'},
        ], // 穿梭框备选数据
        selectedData: [], // 穿梭框已选的数据
        showModal: false, // 是否显示modal
        // watch modal
        form3: {
          watchHost: '',
        }, // 服务地址
        rules3: {
          watchHost: [
            {required: true, message: '请输入服务地址', trigger: 'change'},
            // {max: 30, message: '支持最多30个字符', trigger: 'blur'},
          ],
        },
        watchVisible: false,
        watchData: [],
        activeWatchIndex: null, // 当前点击的row的id, 同时可判断是在修改还是新增
        myForm: {
          address: '',
          name: ''
        },
        myRule: {
          address: [
            {required: true, message: '请输入手表地址', trigger: 'blur'},
            {max: 12, message: '支持最多12个字符', trigger: 'blur'},
            {pattern: /^[0-9a-zA-Z_\-!#$%^&*@.]+$/, message: '只支持英文、数字及特殊字符', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入手表名称', trigger: 'blur'},
            {max: 20, message: '支持最多20个字符', trigger: 'blur'},
            {pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '只支持中英文、数字、下划线', trigger: 'blur'}
          ]
        },
        // loading
        loading: false,
        loadingNum: 5
      };
    },
    computed: {
      isFirst() {
        return this.active === 0;
      },
      isSecond() {
        return this.active === 1;
      },
    },
    async created() {
      // 获取token, 如果没有token则跳到dashboard.
      // session().then(async res => {
      //   if (res.success) {
      //     setToken(res.data);
      //     // 获取所有工站
      //     const res2 = await stations();
      //     this.transferData = res2.data.map(item => ({
      //       key: item.id,
      //       label: item.name,
      //       val: item.alias
      //     }))
      //   } else {
      //     this.$router.push('/dashboard');
      //   }
      // }).catch(e => {
      //   this.$router.push('/dashboard');
      // });
      const res2 = await stations();
      this.transferData = res2.data.map(item => ({
        key: item.id,
        label: item.name,
        val: item.alias
      }))
    },
    mounted() {
    },
    methods: {
      /**
       * 第一步
       */
      validateForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          flag = !!valid;
        });
        return flag
      },
      // 第一步骤里面的下一步
      firstNext(formName) {
        if (this.validateForm(formName)) {
          this.setDbcfg().then((res) => {
            this.active++;
          }).catch(e => {
            console.log(e.message);
          });
        }
      },
      // 设置数据库配置
      setDbcfg() {
        return new Promise((resolve, reject) => {
          const {
            ip, port, db, username, password,
          } = this.form1;
          const params = {
            dbHost: ip,
            dbPort: port,
            dbName: db,
            dbUsername: username,
            dbPassword: password,
          };
          dbcfg(params).then((res) => {
            if (res.success === true) {
              resolve(res);
            }
          });
        });
      },
      /**
       * 第二步
       */
      moveRow(row, i, direction) {
        if ((direction === 'up' && i === 0) || (direction === 'down' && i === (this.tableData.length - 1))) {
          return;
        }
        const arr = [...(this.tableData)]; // 拷贝this.tableData对象
        const {id, name, alias, filePath} = row;
        const _i = direction === 'up' ? (i - 1) : (i + 1);
        const obj = {...arr[_i]};
        arr[_i] = {id, name, alias, filePath};
        arr[i] = {...obj};
        console.log('%c%s', 'padding: 2px 4px;background: orange;color: white;border-radius: 2px;', 'arr');
        console.log(arr);
        this.tableData = [...arr];
        this.selectedData = arr.map(item => item.id); // 同步表格中数据顺序到穿梭框
      },
      // 删除
      delRow(row, i) {
        this.tableData.splice(i, 1); // table中删除该行
        this.selectedData.splice(this.selectedData.findIndex(item => item === row.id), 1); // 穿梭框中删除已选中的改行
      },
      // 第二步骤里面的下一步
      secondNext(formName) {
        // console.log(this.tableData);
        if (this.validateForm(formName)) {
          if (this.tableData.length) {
            const params = {
              projectName: this.form2.project,
              stations: this.tableData.map((item, index) => ({code: index + 1, name: item.alias, filePath: item.filePath}))
            };
            station(params).then(res => {
              if (res.success) {
                this.active++;
              }
            }).catch(e => {
              console.log(e.message)
            })
          } else {
            this.$message({
              message: '未选择工站',
              type: 'warning'
            });
          }
        }
      },
      /**
       * transfer modal
       */
      // modal的选中确认
      selectConfirm() {
        this.tableData = this.selectedData.map((item, index) => {
          const obj = this.transferData.find(element => element.key === item);
          return {
            id: item,
            name: obj.label,
            alias: obj.val,
            filePath: ''
          }
        });
        this.showModal = false;
      },
      /**
       * 第三步
       */
      // 点击新增按钮
      clickAddWatchBtn() {
        this.activeWatchIndex = null;
        this.watchVisible = true;
      },
      // 新增 or 修改
      addOrModifyWatch(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$nextTick(() => {
              // 新增 or 修改
              if (this.activeWatchIndex !== null) {
                const i = this.activeWatchIndex;
                this.watchData[i]['watchAddress'] = this.myForm['address'];
                this.watchData[i]['watchName'] = this.myForm['name'];
              } else {
                const arr = [...this.watchData, {id: this.watchData.length, watchAddress: this.myForm['address'], watchName: this.myForm['name']}];
                this.watchData = [...arr];
              }
              this.watchVisible = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 修改手表row
      modifyWatchRow(scope) {
        const {$index} = scope;
        this.activeWatchIndex = $index;
        this.myForm = {
          name: this.watchData[$index]['watchName'],
          address: this.watchData[$index]['watchAddress']
        }
        this.watchVisible = true;
      },
      // 删除手表row
      delWatchRow(scope) {
        const {$index} = scope;
        this.watchData.splice($index,1);
      },
      // 重置输入框
      resetForm(formName) {
        this.myForm = {
          address: '',
          name: ''
        };
        this.$refs[formName].resetFields();
      },
      /**
       * 点击完成
       */
      // 最终确认
      confirm() {
        if (this.validateForm('ruleForm3')) {
          const params = {
            watchHost: this.form3.watchHost,
            watchs: this.watchData.map(item => ({name: item['watchName'], address: item['watchAddress']}))
          };
          this.$confirm('确认提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitConfig(params);
          }).catch(() => {
          });
        }
      },
      // 最终发送配置数据并跳转
      submitConfig(params) {
        setupWatch(params).then(res => {
          if (res.success) {
            this.$message({
              message: '已提交',
              type: 'success'
            });
            // this.active = 3;
            this.loadAndGo();
          }
        }).catch(e => {
          console.log(e.message)
        })
      },
      // 跳转到dashboard
      loadAndGo() {
        this.loading = true;
        setTimeout(() => {
          this.loadingNum--;
          if (this.loadingNum === 0) {
            // 初始化
            this.loading = false;
            this.loadingNum = 5;
            // 跳转到面板
            this.$router.push('/dashboard');
          } else {
            this.loadAndGo();
          }
        }, 1000)
      }
    },
  };
</script>

<style lang="scss" scoped>
  .page_setup {
    background: #ffffff;
    height: 100%;

    .top {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 30px;

      .step-container {
        width: 500px;
      }
    }

    .main {
      display: flex;
      justify-content: center;
    }

    .bottom {
      margin-top: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
