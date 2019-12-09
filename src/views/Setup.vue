<template>
  <div class="page_setup" v-loading.fullscreen="loading"
       :element-loading-text="`${loadingNum} 秒后跳转`"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-header class="layout-header">工站管理</el-header>
    <div class="top">
      <div class="step-container">
        <el-steps :active="active" finish-status="success" :align-center="true">
          <el-step title="步骤 1"></el-step>
          <el-step title="步骤 2"></el-step>
        </el-steps>
      </div>
    </div>
    <div class="main">
      <!--第一步-->
      <el-form width="600" v-if="isFirst" :model="form1" :rules="rules1" ref="ruleForm1"
               label-width="180px" label-position="left">
        <el-form-item label="Host" prop="ip">
          <el-input style="width: 300px" v-model="form1.ip"></el-input>
        </el-form-item>
        <el-form-item label="Port" prop="port">
          <el-input-number style="width: 300px" v-model="form1.port" controls-position="right" :min="0" :max="65535" :precision="0"></el-input-number>
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
      <div v-else>
        <el-form :model="form2" :rules="rules2" ref="ruleForm2" label-width="100px">
          <el-form-item label="项目名称" prop="project">
            <el-input style="width: 300px" v-model="form2.project"></el-input>
            <el-button type="primary" style="margin-left: 10px" @click="showModal = true">
              选择工站
            </el-button>
          </el-form-item>
        </el-form>
        <el-table border height="400" style="width: 800px" stripe
                  :data="tableData">
          <el-table-column
            type="index"
            label="序号"
            width="150">
          </el-table-column>
          <el-table-column
            prop="name"
            label="工站名称"
            width="450">
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作">
            <template slot-scope="scope">
              <el-button icon="el-icon-arrow-up" @click="upRow(scope.row, scope.$index)" type="text" size="small" >上移</el-button>
              <el-button icon="el-icon-arrow-down" @click="downRow(scope.row, scope.$index)" type="text" size="small">下移</el-button>
              <el-button icon="el-icon-delete" @click="delRow(scope.row, scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--底部按钮-->
    <div class="bottom">
      <span v-if="isFirst">
        <el-button type="primary" @click="nextStep('ruleForm1')">下一步</el-button>
      </span>
      <span v-else>
        <el-button @click="active = 0">上一步</el-button>
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
  </div>
</template>

<script>
import {
  session, dbcfg, station, stations,
} from '@/apis/setup';
import { setToken } from '@/utils/token';
// @ is an alias to /src
export default {
  name: 'Setup',
  components: {},
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
          { required: true, message: '请输入IP地址', trigger: 'blur' },
          { pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/, message: '请输入合法的IP地址', trigger: 'blur' },
        ],
        port: [
          { required: true, message: '请输入端口号', trigger: 'blur' }
        ],
        db: [
          { required: true, message: '请输入数据库名称', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]+$/, message: '请输入英文或数字', trigger: 'change' },
          { min: 0, max: 10, message: '最大长度10个字符', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]+$/, message: '请输入英文或数字', trigger: 'change' },
          { min: 0, max: 10, message: '最大长度10个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_\-!#$%^&*@.]+$/, message: '支持英文、数字、特殊字符', trigger: 'change' },
          { min: 0, max: 20, message: '最大长度20个字符', trigger: 'change' }
        ],
        cpassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_\-!#$%^&*@.]+$/, message: '支持英文、数字、特殊字符', trigger: 'change' },
          { min: 0, max: 20, message: '最大长度20个字符', trigger: 'change' },
          { validator: checkCpassword, trigger: 'change' }
        ],
      },
      form2: {
        project: '',
      },
      rules2: {
        project: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]+$/, message: '请输入英文或数字', trigger: 'change' },
          { min: 0, max: 10, message: '最大长度10个字符', trigger: 'change' }
          // { pattern: /^[0-9a-zA-Z]+$/, message: '支持英文或数字', trigger: 'change' },
        ],
      },
      tableData: [],
      // modal
      transferTitle: ['工站列表', '已选列表'],
      transferData: [
        { key: 1, label: '工站1' },
      ], // 穿梭框备选项
      selectedData: [], // 穿梭框已选的数据
      showModal: false, // 是否显示modal
      // loading
      loading: false,
      loadingNum: 5
    };
  },
  computed: {
    isFirst() {
      return this.active === 0;
    },
  },
  async created() {
    // 获取token, 如果没有token则跳到dashboard.
    session().then(async res => {
      if (res.success) {
        setToken(res.data);
        // 获取所有工站
        const res2 = await stations();
        this.transferData = res2.data.map(item => ({
          key: item.id,
          label: item.name,
          val: item.alias
        }))
      } else {
        this.$router.push('/dashboard');
      }
    }).catch(e => {
      this.$router.push('/dashboard');
    });
  },
  mounted() {
  },
  methods: {
    validateForm(formName) {
      let flag = false;
      this.$refs[formName].validate((valid) => {
        flag = !!valid;
      });
      return flag
    },
    // 下一步
    nextStep(formName) {
      if (this.validateForm(formName)) {
        this.setDbcfg().then((res) => {
          this.active = 1;
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
    // 上移
    upRow(row, i) {
      if (i === 0) {
        this.$message({
          message: '已是第一个工站',
          type: 'warning'
        });
        return false;
      } // 如果已经是第一个，不进行处理
      const {id, name, alias} = row;
      const obj = {...this.tableData[i - 1]}; // 缓存其上一个的参数
      this.tableData[i - 1]['name'] = name;
      this.tableData[i - 1]['alias'] = alias;
      this.tableData[i - 1]['id'] = id;
      this.tableData[i]['name'] = obj.name;
      this.tableData[i]['alias'] = obj.alias;
      this.tableData[i]['id'] = obj.id;
      this.selectedData = this.tableData.map(item => item.id); // 同步表格中数据顺序到穿梭框
    },
    // 下移
    downRow(row, i) {
      if (i === this.tableData.length - 1) {
        this.$message({
          message: '已是最后一个工站',
          type: 'warning'
        });
        return false;
      } // 如果已经是最后一个，不进行处理
      const {id, name, alias} = row;
      const obj = {...this.tableData[i + 1]}; // 缓存其下一个的参数
      this.tableData[i + 1]['name'] = name;
      this.tableData[i + 1]['alias'] = alias;
      this.tableData[i - 1]['id'] = id;
      this.tableData[i]['name'] = obj.name;
      this.tableData[i]['alias'] = obj.alias;
      this.tableData[i]['id'] = obj.id;
      this.selectedData = this.tableData.map(item => item.id); // 同步表格中数据顺序到穿梭框
    },
    // 删除
    delRow(row, i) {
      this.tableData.splice(i,1); // table中删除该行
      this.selectedData.splice(this.selectedData.findIndex(item => item === row.id), 1); // 穿梭框中删除已选中的改行
    },
    // modal的选中确认
    selectConfirm() {
      this.tableData = this.selectedData.map((item, index) => {
        const obj = this.transferData.find(element => element.key === item);
        return {
          id: item,
          name: obj.label,
          alias: obj.val
        }
      });
      this.showModal = false;
    },
    // 最终确认
    confirm() {
      // console.log(this.tableData);
      if (this.validateForm('ruleForm2')) {
        if (this.tableData.length) {
          this.active = 2; // 完成状态
          const params = {
            projectName: this.form2.project,
            stations: this.tableData.map((item, index) => ({code: index + 1, name: item.alias}))
          };
          this.$confirm('确认提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitConfig(params);
          }).catch(() => {
          });
        } else {
          this.$message({
            message: '未选择工站',
            type: 'warning'
          });
        }
      }
    },
    // 最终发送配置数据并跳转
    submitConfig(params) {
      station(params).then(res => {
        if (res.success) {
          this.$message({
            message: '已提交',
            type: 'success'
          });
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
          this.loading = false;
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
