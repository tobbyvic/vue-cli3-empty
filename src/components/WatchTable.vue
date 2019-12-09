<template>
  <el-dialog title="手表地址列表" :visible.sync="WatchDialog" :close-on-click-modal="false" :close-on-press-escape="false"
             :show-close="false" width="750px">
    <el-row style="text-align: right;">
      <el-button type="primary" @click="addRow">新增</el-button>
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
      return {
        tableData: [],
        page: {
          total: 0,
          size: 10,
          current: 1
        },
        innerVisible: false,
        // 小弹框的表单
        activeRowId: null, // 当前点击的row的id, 同时可判断是在修改还是新增
        myForm: {
          address: '',
          name: ''
        },
        myRule: {
          address: [
            {required: true, message: '请输入手表地址', trigger: 'blur'},
            {max: 30, message: '支持最多30个字符', trigger: 'blur'},
            {pattern: /^[A-Za-z0-9]+$/, message: '只支持英文和数字', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入手表名称', trigger: 'blur'},
            {max: 20, message: '支持最多30个字符', trigger: 'blur'},
            {pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '只支持中英文、数字、下划线', trigger: 'blur'}
          ]
        },
        submitLoading: false
      }
    },
    methods: {
      init() {
        this.getData();
      },
      // 改变分页
      onPageChange() {
        this.getData();
      },
      // 查询列表数据
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
    },
  }
</script>

<style scoped>

</style>
