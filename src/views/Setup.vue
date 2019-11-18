<template>
  <div class="page_setup">
    <el-button type="primary" @click="confirm">confirm</el-button>
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
import { test } from '@/apis/setup';
// @ is an alias to /src
export default {
  name: 'Setup',
  components: {},
  methods: {
    confirm() {
      test().then((res) => {
        console.log(res);
      }).catch((e) => {
        console.log(e.message);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .page_setup {
    background: #ffffff;
    height: 100%;
  }

</style>
