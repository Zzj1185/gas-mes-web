<template>
  <el-card class="box-card">
    <div class="headBox">
      <span>{{ site_name }}</span>
      <i class="el-icon-close" @click="closeWindow"></i>
    </div>
    <div class="chartBox" v-if="showChart">
      <div class="tagList">
        <template v-for="(tag, index) in keyTagAll">
          <el-button type="text" :class="tag.tag_name == tagInfo.tag_name ? 'active' : ''" :key="index" @click="showChartData(tag)">{{ tag.tag_name }}</el-button>
        </template>
      </div>
      <LineChart style="width: 800px; height: 400px" ref="chart" :dataset="dataset" :grid="grid" />
    </div>
    <div class="chartBox" v-else>
      <el-empty description="暂未设定显示数据"></el-empty>
    </div>
  </el-card>
</template>

<script>
import apiv2 from '@/api/v2'
import LineChart from '@/components/echarts/lineChart.vue'

export default {
  components: { LineChart },
  data() {
    return {
      tagInfo: {},
      site_name: '',
      showChart: false,
      dataset: [],
      keyTagAll: [],
      grid: {
        top: '10%',
        left: '5%',
        right: '5%',
        bottom: '10%',
      },
    }
  },
  beforeDestroy() {
    this.reset()
  },
  methods: {
    reset() {
      this.tagInfo = {}
      this.site_name = ''
      this.showChart = false
      this.dataset = []
      this.keyTagAll = []
    },
    openWindow(siteInfo) {
      this.site_name = siteInfo.site_name
      this.showChart = false

      apiv2.SiteTag.ViewReq({ site_id: siteInfo.site_id }).then((res) => {
        this.keyTagAll = res.data.list
        this.showChart = this.keyTagAll.length > 0
        if (this.showChart) {
          this.showChartData(this.keyTagAll[0])
        }
      })
    },
    closeWindow() {
      this.$emit('close')
      this.reset()
    },
    showChartData(tagInfo) {
      if (this.$auth(apiv2.DataRecord.AcquisitionRoute)) {
        this.getChartData(tagInfo)
      }
    },
    getChartData(tagInfo) {
      this.dataset = []
      this.tagInfo = tagInfo
      apiv2.DataRecord.AcquisitionReq({ tag_id: tagInfo.tag_id, size: 10 }).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          let list = []
          let topList = res.data.list.slice(0, 10)
          for (let i = 0; i < topList.length; i++) {
            const row = topList[i]
            const time = this.$moment(row.acq_time).format('YYYY-MM-DD hh:mm:ss')
            list.push([time, row.acq_value])
          }
          this.dataset.push({
            color: '#67c4ff',
            name: tagInfo.tag_name,
            data: list.reverse(),
            suffix: tagInfo.acq_unit,
          })
        }
      })
    },
    updateData(acqData) {
      if (acqData.topic == this.tagInfo.topic) {
        const obj = acqData.data
        if (obj && obj[this.tagInfo.tag_code] != undefined) {
          let newData = []
          const value = obj[this.tagInfo.tag_code]
          const now = this.$moment().format('YYYY-MM-DD hh:mm:ss')
          if (this.dataset.length) {
            newData = this.dataset[0].data.slice(1)
          }
          newData.push([now, value])
          if (this.dataset.length) {
            this.dataset[0].data = newData
          } else {
            this.dataset[0] = {
              color: '#67c4ff',
              name: this.tagInfo.tag_name,
              data: newData,
              suffix: this.tagInfo.acq_unit,
            }
          }
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.box-card {
  .headBox {
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    i {
      cursor: pointer;
    }
  }

  .chartBox {
    margin-top: 20px;
    width: 800px;
    height: 450px;

    .tagList {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;
      justify-content: center;

      .el-button {
        padding: 0;
        color: #666;

        &:hover {
          color: #67c4ff;
        }

        &.active {
          color: #67c4ff;
        }
      }
    }
  }
}
</style>
