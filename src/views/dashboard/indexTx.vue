<template>
  <div class="dashbord">
    <div class="column side">
      <WeatherCmpt />
      <SiteCmpt cfgName="dashboard_site1" />
      <SiteCmpt cfgName="dashboard_site2" />
      <TicketCmpt />
    </div>
    <div class="column center">
      <MapChart class="full-map" />
      <AlarmCmpt />
    </div>
    <div class="column side">
      <GasCmpt />
    </div>
  </div>
</template>

<script>
import MapChart from './components/map.vue'
import WeatherCmpt from './components/weather.vue'
import TicketCmpt from './components/ticket.vue'
import AlarmCmpt from './components/alarm.vue'
import GasCmpt from './components/gasTx.vue'
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
  justify-content: space-between;

  .column {
    gap: 10px;
    display: flex;
    min-width: 530px;
    position: relative;
    flex-direction: column;
    justify-content: space-between;

    &.side {
      width: 530px;

      /deep/ .site {
        .el-table {
          .el-table__cell {
            padding: 5px 0;
          }
        }
      }
    }

    &.center {
      flex: 1;
      justify-content: flex-end;
    }
  }
}
</style>
