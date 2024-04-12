<template>
  <div class="dashbord">
    <div class="column side left">
      <WeatherCmpt />
      <SiteCmpt cfgName="dashboard_site1" />
      <SiteCmpt cfgName="dashboard_site2" />
      <TicketCmpt />
    </div>
    <div class="column center">
      <MapImg />
      <AlarmCmpt />
    </div>
    <div class="column side right">
      <SiteCmpt cfgName="dashboard_site3" />
      <SiteCmpt cfgName="dashboard_site4" />
      <SiteCmpt cfgName="dashboard_site5" />
      <SiteCmpt cfgName="dashboard_site6" />
    </div>
  </div>
</template>

<script>
import MapImg from './components/mapImg.vue'
import WeatherCmpt from './components/weather.vue'
import TicketCmpt from './components/ticket.vue'
import AlarmCmpt from './components/alarm.vue'
import SiteCmpt from './components/site.vue'

export default {
  name: 'Dashboard',
  components: { MapImg, WeatherCmpt, SiteCmpt, TicketCmpt, AlarmCmpt },
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
    gap: 20px;
    display: flex;
    min-width: 530px;
    position: relative;
    flex-direction: column;
    justify-content: space-between;

    &.side {
      width: 530px;

      /deep/ .site {
        .el-table {
          font-size: 18px;
        }
      }

      &.left {
        /deep/ .ticket {
          .ticket-info {
            height: 197px;
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
