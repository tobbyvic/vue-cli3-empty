<template>
  <div>
    <my-card></my-card>
  </div>
</template>

<script>
  import MyCard from '../components/MyCard';
  import {dashStations} from '../apis/dashboard.js'

  export default {
    name: "Dashboard",
    components: {
      MyCard
    },
    mounted() {
      dashStations().then(res => {
        console.log(res);
      }).catch(e => {
        console.log(e.message)
      })
    }
  }
</script>

<style scoped>

</style>
