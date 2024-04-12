<template>
  <TableLite class="flow" title="今日流量数据" iconName="droplet" :tableData="tableData"></TableLite>
</template>
<script>
import apiv2 from '@/api/v2'
import TableLite from '@/components/tableLiteCmpt.vue'
export default {
  data() {
    return {
      tableData: {
        height: '100%',
        type: [
          {
            key: 'site_name',
            label: '监测点',
            align: 'left',
          },
          {
            key: 'realtime',
            label: '标况流量',
            width: 100,
          },
          {
            key: 'cumulative',
            label: '累计流量',
            width: 150,
          },
        ],
        list: [],
      },
    }
  },
  created() {
    this.getSystemCfg()
  },
  components: { TableLite },
  computed: {
    flowCount() {
      return this.tableData.list.length
    },
    acqData() {
      return this.$store.state.acquisition.acqData
    },
    newAcqData() {
      return this.$store.state.acquisition.newData
    },
  },
  watch: {
    flowCount() {
      this.initFlowData()
    },
    'newAcqData.time'() {
      this.updateAcqData()
    },
  },
  methods: {
    getSystemCfg() {
      apiv2.CommonData.ConfigDataReq({ cfg_name: 'dashboard_flow_list' }).then((res) => {
        if (res.data.value) {
          try {
            this.tableData.list = JSON.parse(res.data.value)
          } catch (error) {
            this.$message.error('系统配置dashboard_flow_list数据格式有误')
          }
        } else {
          this.$message.error('缺少系统配置dashboard_flow_list')
        }
      })
    },
    initFlowData() {
      this.tableData.list.forEach((meter) => {
        const obj = this.acqData[meter.topic]
        if (obj) {
          if (obj[meter.realtime_code] != undefined) {
            const realtime = obj[meter.realtime_code]
            meter.realtime = realtime + ' ' + meter.realtime_unit
          }
          if (obj[meter.cumulative_code] != undefined) {
            const cumulative = obj[meter.cumulative_code]
            meter.cumulative = cumulative + ' ' + meter.cumulative_unit
          }
        }
      })
    },
    updateAcqData() {
      this.tableData.list.forEach((meter) => {
        if (this.newAcqData.topic == meter.topic) {
          const obj = this.newAcqData.data
          if (obj) {
            if (obj[meter.realtime_code] != undefined) {
              const realtime = obj[meter.realtime_code]
              meter.realtime = realtime + ' ' + meter.realtime_unit
            }
            if (obj[meter.cumulative_code] != undefined) {
              const cumulative = obj[meter.cumulative_code]
              meter.cumulative = cumulative + ' ' + meter.cumulative_unit
            }
          }
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.flow {
  height: 326px;
}
</style>
