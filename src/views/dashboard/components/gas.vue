<template>
  <TableLite class="gas" title="燃气管网监测" iconName="gas" :tableData="tableData">
    <template #table-slot>
      <div class="table-scroll" v-if="show">
        <VueSeamlessScroll class="seamless-warp" :data="tableData.list" :class-option="option">
          <el-table :data="tableData.list">
            <div v-for="(item, index) in tableData.type">
              <el-table-column align="center" :width="item.width ? item.width : ''" :key="index" :label="item.label" :prop="item.key" />
            </div>
          </el-table>
        </VueSeamlessScroll>
      </div>
    </template>
  </TableLite>
</template>
<script>
import apiv2 from '@/api/v2'
import TableLite from '@/components/tableLiteCmpt.vue'
import VueSeamlessScroll from 'vue-seamless-scroll'
export default {
  data() {
    const waitTime = 5000
    return {
      show: false,
      countdown: 0,
      orderNum: 0,
      waitTime,
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
      option: {
        step: 0,
        waitTime,
        singleHeight: 245,
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
        const total = this.orderNum
        const diff = Math.ceil(total / 7) * 7 - total
        for (let i = 0; i < diff; i++) {
          this.tableData.list.push({
            order_num: '　',
            topic: '',
            device_id: '',
            site_name: '',
            conce_perce: '',
            conce_perce_code: '',
            pressure: '',
            pressure_code: '',
          })
        }
        this.show = true
        this.setDeviceValue()
      }
    },
    'newAcqData.time'() {
      this.updateAcqData()
    },
  },
  components: { TableLite, VueSeamlessScroll },
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
      setTimeout(() => {
        this.option.step = 3.5
      }, this.waitTime)
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
    flex: 0 auto;
    padding-bottom: 0;

    .el-table {
      flex: 0 auto;
      padding-bottom: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;

      .el-table__body-wrapper {
        display: none;
      }
    }
  }

  .table-scroll {
    flex: 1;
    overflow: hidden;
    margin-top: -10px;
    padding: 0 7px 10px;
    background-image: linear-gradient(to right, #29323dcc, #191919cc);

    .seamless-warp {
      height: 100%;
      overflow: hidden;

      /deep/ .el-table {
        background-color: transparent;

        &::before {
          height: 0;
        }

        .el-table__header-wrapper {
          display: none;
        }
        .el-table__body {
          border: none;

          .el-table__row {
            color: #fff;
            background-color: transparent;

            .el-table__cell {
              padding: 5px 0;
              border-bottom: #ffffff1a dotted 2px;
            }

            &:hover {
              .el-table__cell {
                background-color: transparent;
              }
            }
          }
        }
      }
    }
  }
}
</style>
