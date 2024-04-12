<template>
  <TableLite class="gas" title="燃气管网监测" iconName="gas" :tableData="tableData"></TableLite>
</template>
<script>
import apiv2 from '@/api/v2'
import TableLite from '@/components/tableLiteCmpt.vue'
export default {
  data() {
    return {
      countdown: 0,
      orderNum: 0,
      tableData: {
        type: [
          {
            width: '50px',
            key: 'order_num',
            label: '序号',
          },
          {
            width: '250px',
            key: 'site_name',
            label: '监测点',
          },
          {
            key: 'conce_perce',
            label: '浓度',
          },
          {
            key: 'pressure',
            label: '压力',
          },
        ],
        list: [],
      },
    }
  },
  created() {
    this.getSiteTag(2)
    this.getSiteTag(3)
  },
  computed: {
    acqData() {
      return this.$store.state.acquisition.acqData
    },
    newAcqData() {
      return this.$store.state.acquisition.newData
    },
  },
  watch: {
    countdown() {
      if (this.countdown == 2) {
        this.setDeviceValue()
      }
    },
    'newAcqData.time'() {
      this.updateAcqData()
    },
  },
  components: { TableLite },
  methods: {
    getSiteTag(site_type_id) {
      apiv2.CommonData.SiteTagReq({ site_type_id }).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          for (let i = 0; i < res.data.list.length; i++) {
            const tag = res.data.list[i]
            if (tag.site_name.includes('未安装')) {
              continue
            }
            let device = this.tableData.list.find((o) => o.device_id == tag.device_id)
            if (!device) {
              this.orderNum++
              device = {
                order_num: this.orderNum,
                topic: tag.topic,
                device_id: tag.device_id,
                site_name: tag.site_name,
                conce_perce: '-',
                conce_perce_code: '',
                pressure: '-',
                pressure_code: '',
              }
              this.tableData.list.push(device)
            }
            if (tag.tag_name == '甲烷') {
              device.conce_perce_code = tag.tag_code
            }
            if (tag.tag_name == '压力') {
              device.pressure_code = tag.tag_code
            }
          }
          this.countdown++
        }
      })
    },
    setDeviceValue() {
      for (let i = 0; i < this.tableData.list.length; i++) {
        const device = this.tableData.list[i]
        const obj = this.acqData[device.topic]
        if (obj) {
          const conce_perce_code = device.conce_perce_code
          if (obj[conce_perce_code] != undefined) {
            device.conce_perce = obj[conce_perce_code] + ' %LEL'
          }
          const pressure_code = device.pressure_code
          if (obj[pressure_code] != undefined) {
            device.pressure = obj[pressure_code].toFixed(3) + ' MPa'
          }
        }
      }
    },
    updateAcqData() {
      this.tableData.list.forEach((device) => {
        if (device.topic == this.newAcqData.topic) {
          const obj = this.newAcqData.data
          if (obj) {
            const conce_perce_code = device.conce_perce_code
            if (obj[conce_perce_code] != undefined) {
              device.conce_perce = obj[conce_perce_code] + ' %LEL'
            }
            const pressure_code = device.pressure_code
            if (obj[pressure_code] != undefined) {
              device.pressure = obj[pressure_code].toFixed(3) + ' MPa'
            }
          }
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.gas {
  flex: 1;
  overflow: hidden;

  /deep/ .lite-content {
    .el-table {
      height: 100% !important;
      .cell {
        line-height: 39.5px;
      }
    }
  }
}
</style>
