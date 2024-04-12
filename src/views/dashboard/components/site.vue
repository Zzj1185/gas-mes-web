<template>
  <TableLite :title="title" class="site" iconName="site">
    <template #table-slot>
      <div class="lite-content">
        <div v-for="(tableData, index) in tableList">
          <el-table :key="index" :data="tableData.list" :height="tableData.height ? tableData.height : 'auto'"
            header-row-class-name="lite-header" row-class-name="lite-row">
            <div v-for="item in tableData.type">
              <div :key="item.label">
                <el-table-column v-if="item.signal == 'digital'" align="center" :prop="item.key" :label="item.label">
                  <template slot-scope="scope">
                    <div :style="'color: ' + scope.row.color">{{ scope.row[item.key] }}</div>
                  </template>
                </el-table-column>
                <el-table-column v-else :prop="item.key" align="center" :label="item.label"></el-table-column>
              </div>
            </div>
          </el-table>
        </div>
      </div>
    </template>
  </TableLite>
</template>
<script>
import apiv2 from '@/api/v2'
import TableLite from '@/components/tableLiteCmpt.vue'
export default {
  data() {
    return {
      cfgData: null,
      title: '',
      tableList: [],
    }
  },
  created() {
    this.getSystemCfg()
  },
  props: { cfgName: String },
  components: { TableLite },
  computed: {
    paramsCount() {
      return this.tableList.length
    },
    acqData() {
      return this.$store.state.acquisition.acqData
    },
    newAcqData() {
      return this.$store.state.acquisition.newData
    },
  },
  watch: {
    paramsCount() {
      this.initAcqData()
    },
    'newAcqData.time'() {
      this.updateAcqData()
    },
  },
  methods: {
    getSystemCfg() {
      if (this.$props.cfgName) {
        const cfg_name = this.$props.cfgName
        apiv2.CommonData.ConfigDataReq({ key: cfg_name }).then((res) => {
          if (res.data.value) {
            try {
              this.cfgData = JSON.parse(res.data.value)
              this.getSiteTag(this.cfgData.site_id)
            } catch (error) {
              this.$message.error(`系统配置${cfg_name}数据格式有误`)
            }
          } else {
            this.$message.error(`缺少系统配置${cfg_name}`)
          }
        })
      } else {
        this.$message.error(`缺少配置名参数`)
      }
    },
    getSiteTag(site_id) {
      apiv2.CommonData.SiteTagReq({ site_id }).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          if (res.data.list.length) {
            const list = res.data.list
            this.title = list[0].site_name
            const rows = []
            for (let i = 0; i < this.cfgData.tag_array.length; i++) {
              const items = this.cfgData.tag_array[i]
              const tableData = { type: [], list: [] }
              const row = {}
              for (let j = 0; j < items.length; j++) {
                const tag_id = items[j]
                const tag = list.find((t) => t.tag_id == tag_id)
                if (tag) {
                  const item = {
                    topic: tag.topic,
                    signal: tag.acq_type,
                    unit: tag.acq_unit,
                    label: tag.tag_name,
                    key: tag.tag_code,
                  }
                  if (tag.acq_type == 'digital') {
                    item['switch_text'] = this.cfgData.switch[tag_id].text
                    item['switch_color'] = this.cfgData.switch[tag_id].color
                  }
                  tableData.type.push(item)
                  row[tag.tag_code] = '-'
                }
              }
              tableData.list = [row]
              rows.push(tableData)
            }
            this.tableList = rows
          }
        }
      })
    },
    initAcqData() {
      this.tableList.forEach((tableData) => {
        tableData.type.forEach((item) => {
          const obj = this.acqData[item.topic]
          if (obj) {
            if (obj[item.key] != undefined) {
              if (item.signal == 'digital') {
                tableData.list[0][item.key] = item.switch_text[parseInt(obj[item.key])]
                tableData.list[0]['color'] = item.switch_color[parseInt(obj[item.key])]
              } else {
                tableData.list[0][item.key] = obj[item.key]
                if (item.unit) {
                  tableData.list[0][item.key] += ' ' + item.unit
                }
              }
            }
          }
        })
      })
    },
    updateAcqData() {
      this.tableList.forEach((tableData) => {
        tableData.type.forEach((item) => {
          if (this.newAcqData.topic == item.topic) {
            const obj = this.newAcqData.data
            if (obj) {
              if (obj[item.key] != undefined) {
                if (item.signal == 'digital') {
                  tableData.list[0][item.key] = item.switch_text[parseInt(obj[item.key])]
                  tableData.list[0]['color'] = item.switch_color[parseInt(obj[item.key])]
                } else {
                  tableData.list[0][item.key] = obj[item.key]
                  if (item.unit) {
                    tableData.list[0][item.key] += ' ' + item.unit
                  }
                }
              }
            }
          }
        })
      })
    },
  },
}
</script>
<style lang="less" scoped>
.site {
  .lite-content {
    flex: 1;
    overflow: hidden;
    padding: 10px 7px 0;
    border-radius: 10px;
    background-image: linear-gradient(to right, #29323dcc, #191919cc);

    .el-table {
      border: none;
      background-color: transparent;

      &::before {
        height: 0;
      }

      /deep/ tr {
        color: #fff;
        background-color: transparent;

        .el-table__cell {
          padding: 8px 0;

          .cell {
            display: block;
          }
        }
      }

      .el-table__body-wrapper {

        /*定义滚动条*/
        &::-webkit-scrollbar {
          width: 2px;
          height: 2px;
        }

        /*定义滚动条轨道*/
        &::-webkit-scrollbar-track {
          background-color: transparent;
        }

        /*定义滑块 内阴影+圆角*/
        &::-webkit-scrollbar-thumb {
          background-color: #696968;
        }
      }

      /deep/ .el-table__body {
        border: none;
      }

      /deep/ .lite-header {
        background-image: linear-gradient(45deg, #74458a, #072bf7);

        .el-table__cell {
          border: none;
          background-color: transparent;
        }
      }

      /deep/ .lite-row {
        .el-table__cell {
          border-bottom: none;
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
</style>
