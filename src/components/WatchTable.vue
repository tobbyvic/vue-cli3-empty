<template>
  <el-dialog title="设置" :visible.sync="WatchDialog" :close-on-click-modal="false" :close-on-press-escape="false"
             :show-close="false" width="750px">
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabChange">
      <el-tab-pane label="手表地址" name="watch">
        <el-row style="text-align: left;">
          <el-button type="primary" @click="addRow" size="small">新增</el-button>
        </el-row>
        <el-table
          :data="tableData"
          style="width: 100%" max-height="400">
          <el-table-column
            prop="id"
            label="ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="watchAddress"
            label="手表地址">
          </el-table-column>
          <el-table-column
            prop="watchName"
            label="手表名称">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="updateRow(scope)" type="text" size="small">修改</el-button>
              <el-button @click="delRow(scope)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right;margin-top: 10px">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size.sync="page.size"
            :current-page.sync="page.current"
            :total="page.total"
            @current-change="onPageChange"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="文件路径" name="filePath">
        <el-row style="text-align: left;">
          <el-button v-if="!canEdit" type="primary" @click="canEdit = true" size="small">编辑路径</el-button>
          <el-button v-else type="primary" @click="confirmModifyFilePath" size="small">确认更改</el-button>
        </el-row>
        <el-table
          :data="filePathData"
          style="width: 100%" max-height="400">
          <el-table-column
            prop="id"
            label="ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称">
          </el-table-column>
          <el-table-column
            prop="filePath"
            label="文件路径">
            <template slot-scope="scope">
              <el-input :disabled="!canEdit" v-model="scope['row'].filePath" placeholder="请输入文件路径"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="更改密码" name="system">
        <el-form :model="form1" :rules="rule1" ref="ruleForm1" label-width="100px">
          <el-form-item label="新密码" prop="password">
            <el-input style="width: 300px" v-model="form1.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="cpassword">
            <el-input style="width: 300px" v-model="form1.cpassword" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirmPassword">
              确认
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeWatchDialog">关 闭</el-button>
    </div>
    <!--  内层，修改或新增dialog  -->
    <el-dialog
      width="500px"
      title=""
      :visible.sync="innerVisible"
      :close-on-click-modal="false" :close-on-press-escape="false"
      append-to-body @close="resetForm('my-form')">
      <el-form :model="myForm" :rules="myRule" ref="my-form" label-width="100px">
        <el-form-item
          label="手表地址"
          prop="address"
        >
          <el-input v-model="myForm.address"></el-input>
        </el-form-item>
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input v-model="myForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('my-form')" v-loading="submitLoading">提交</el-button>
          <el-button @click="resetForm('my-form')">清空</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import {getWatchs, addWatch, updateWatch, delWatch} from '../apis/watch.js';
  import {dashFilePaths, modifyFilePaths, modifyPwd} from '../apis/dashboard.js';

  export default {
    name: "WatchTable",
    props: {
      WatchDialog: {
        type: Boolean,
        default: false
      },
    },
    watch: {
      WatchDialog(newValue, oldValue) {
        if (newValue) {
          // dialog打开的时候
          this.init();
        }
      }
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
        activeTab: 'watch',
        tableData: [], // 手表table
        page: {
          total: 0,
          size: 10,
          current: 1
        },
        filePathData: [], // 文件路径table
        canEdit: false,
        innerVisible: false,
        // 修改密码
        form1: {
          password: '',
          cpassword: ''
        },
        rule1: {
          password: [
            {required: true, message: '请输入新密码', trigger: 'change'}
          ],
          cpassword: [
            {required: true, message: '请确认新密码', trigger: 'change'},
            {validator: checkCpassword, trigger: 'change'}
          ]
        },
        // 小弹框的表单
        activeRowId: null, // 当前点击的row的id, 同时可判断是在修改还是新增
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
        submitLoading: false
      }
    },
    methods: {
      init() {
        this.getData();
        this.getFilePathData();
      },
      // 改变分页
      onPageChange() {
        this.getData();
      },
      // 查询watch列表数据
      getData() {
        const page = {
          pageNumber: this.page.current,
          pageSize: this.page.size
        };
        return new Promise((resolve, reject) => {
          getWatchs(page).then(res => {
            if (res.success) {
              this.tableData = [...res.data.content];
              this.page = {
                ...this.page,
                size: res.data.size,
                total: res.data.totalElements,
              };
              resolve(res.data)
            }
          }).catch(e => {
            this.$message.error(e.message);
          })
        })
      },
      getFilePathData() {
        return new Promise((resolve, reject) => {
          dashFilePaths().then(res => {
            if (res.success) {
              this.filePathData = [...res.data];
              resolve(res.data)
            }
          }).catch(e => {
            this.$message.error(e.message);
          })
        })
      },
      // 点击新增按钮
      addRow() {
        // 清空表单
        this.activeRowId = null;
        this.myForm = {
          address: '',
          name: ''
        };
        this.innerVisible = true
      },
      // 点击修改按钮
      updateRow({row}) {
        this.activeRowId = row.id;
        // 将内容填充到输入框
        const {watchAddress, watchName} = row;
        this.myForm = {
          address: watchAddress,
          name: watchName
        };
        this.innerVisible = true
      },
      // 点击删除按钮
      delRow({row}) {
        this.$confirm('将进行删除操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delWatch({id: row.id}).then(res => {
            this.$message.success(res.data.message);
            this.init();
          }).catch(e => {
            this.$message.error(e,message);
          })
        }).catch(() => {
        });
      },
      // 关闭watch dialog
      closeWatchDialog() {
        this.$emit('close-watch-dialog')
      },
      /**
       * 小弹框中的表单
       */
      // 新增的接口
      addWatch() {
        this.submitLoading = true;
        const params = {
          watchAddress: this.myForm.address,
          watchName: this.myForm.name
        };
        return new Promise((resolve, reject) => {
          addWatch(params).then(res => {
            if (res.success) {
              this.submitLoading = false;
              this.$message.success(res.data.message);
              this.innerVisible = false;
              this.init();
              resolve(res.data)
            }
          }).catch(e => {
            this.$message.error(e.message);
          })
        })
      },
      // 修改的接口
      updateWatch(id) {
        this.submitLoading = true;
        const params = {
          id: id,
          watchAddress: this.myForm.address,
          watchName: this.myForm.name
        };
        return new Promise((resolve, reject) => {
          updateWatch(params).then(res => {
            if (res.success) {
              this.$message.success(res.data.message);
              this.submitLoading = false;
              this.innerVisible = false;
              this.init();
              resolve(res.data)
            }
          }).catch(e => {
            this.$message.error(e.message);
          })
        })
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 新增 or 修改
            if (this.activeRowId) {
              this.updateWatch(this.activeRowId);
            } else {
              this.addWatch();
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
       * 文件路径tab
       */
      confirmModifyFilePath() {
        console.log(this.filePathData);
        const arr = [...this.filePathData];
        return new Promise((resolve, reject) => {
          modifyFilePaths(arr).then(res => {
            if (res.success) {
              this.$message.success(res.data.message);
              this.canEdit = false;
              resolve(res.data)
            }
          }).catch(e => {
            this.$message.error(e.message);
          })
        })
      },
      /**
       * 改变密码tab
       */
      validateForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          flag = !!valid;
        });
        return flag
      },
      confirmPassword() {
        if (this.validateForm('ruleForm1')) {
          return new Promise((resolve, reject) => {
            modifyPwd({password: this.form1.password}).then(res => {
              if (res.success) {
                this.$message.success(res.data.message);
                resolve(res.data)
              }
            }).catch(e => {
              this.$message.error(e.message);
            })
          })
        }
      },
      /**
       * 改变tab
       */
      handleTabChange() {

      }
    },
  }
</script>

<style scoped>

</style>
