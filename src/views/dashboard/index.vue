<template>
  <div class="dashbord">
    <el-empty description="未设置"></el-empty>
  </div>
</template>

<script>
import MapChart from './components/map.vue'
import WeatherCmpt from './components/weather.vue'
import TicketCmpt from './components/ticket.vue'
import AlarmCmpt from './components/alarm.vue'
import GasCmpt from './components/gas.vue'
import SiteCmpt from './components/site.vue'

export default {
  name: 'Dashboard',
  components: { MapChart, WeatherCmpt, SiteCmpt, TicketCmpt, AlarmCmpt, GasCmpt },
}
</script>

<style lang="less" scoped>
.dashbord {
  gap: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  justify-content: center;
}
</style>
