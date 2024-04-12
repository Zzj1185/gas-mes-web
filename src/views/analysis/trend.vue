<template>
  <layout-cmpt :pageFlag="false">
    <template #title>
      <title-cmpt title="趋势分析"></title-cmpt>
    </template>
    <template #form>
      <form-cmpt class="trend-form" :formData="formData" @formEvent="formEvent"></form-cmpt>
    </template>
    <template #table>
      <div class="chart-content">
        <LineChart :showYUnit="false" :dataset="dataset" :loading="loading" />
      </div>
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
import LineChart from '@/components/echarts/lineChart.vue'
export default {
  data() {
    return {
      formData: {
        type: [
          {
            type: 'select',
            key: 'site_id',
            label: '选择站点',
            clearable: 'false',
            options: [],
          },
          {
            type: 'select',
            key: 'device_id',
            label: '选择设备',
            clearable: 'false',
            options: [],
          },
          {
            format: 'yyyy-MM-dd',
            labelWidth: '100px',
            type: 'datePicker',
            key: 'date_range',
            label: '选择时间段',
            clearable: 'false',
          },
          {
            width: '100px',
            type: 'select',
            key: 'scale_unit',
            label: '间隔单位',
            clearable: 'false',
            options: [
              {
                value: 'second',
                label: '秒',
              },
              {
                value: 'minute',
                label: '分钟',
              },
              {
                value: 'hour',
                label: '小时',
              },
              {
                value: 'day',
                label: '天',
              },
              {
                value: 'week',
                label: '周',
              },
              {
                value: 'month',
                label: '月',
              },
              {
                value: 'year',
                label: '年',
              },
            ],
          },
          {
            width: '60px',
            type: 'input',
            key: 'scale_value',
            label: '间隔数值',
            clearable: 'false',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
          },
        ],
        bindData: {
          site_id: '',
          device_id: '',
          start_date: '',
          end_date: '',
          scale_value: 1,
          scale_unit: 'hour',
          date_range: '',
        },
      },
      colorList: ['rgb(31, 174, 234)', 'rgb(107, 221, 155)', 'rgb(254,105,106)', 'rgb(255, 255, 0)'],
      params: {
        var_name: '',
        statis_type: '',
        start_date: '',
        end_date: '',
      },
      xAxis: [],
      dataset: [],
      loading: false,
      first: true,
    }
  },
  mounted() {
    this.initDateRange()
    if (this.$auth(apiv2.SiteMgmt.SelectRoute)) {
      this.getAllSite()
    }
  },
  components: { LineChart },
  watch: {
    first() {
      this.getChartData()
    },
  },
  methods: {
    initDateRange() {
      let time = this.$moment().format('YYYY-MM-DD')
      this.formData.bindData.date_range = [time, time]
    },
    getAllSite() {
      this.formData.bindData.site_id = ''
      const formSiteId = this.formData.type.find((o) => o.key == 'site_id')
      if (formSiteId) {
        formSiteId.options = []
        apiv2.SiteMgmt.SelectReq().then((res) => {
          if (res.error) {
            this.$message.error(res.error)
          } else {
            if (res.data.list.length) {
              formSiteId.options = res.data.list.map((item) => ({ value: item.site_id, label: item.site_name }))
              this.formData.bindData.site_id = formSiteId.options[0].value
              if (this.$auth(apiv2.DeviceMgmt.SelectRoute)) {
                this.getSiteDevice()
              }
            } else {
              this.$message.warning('暂无站点')
            }
          }
        })
      } else {
        this.$message.error('未找到站点选项')
      }
    },
    getSiteDevice() {
      this.formData.bindData.device_id = ''
      const formDeviceId = this.formData.type.find((o) => o.key == 'device_id')
      if (formDeviceId) {
        formDeviceId.options = []
        let data = { site_id: this.formData.bindData.site_id }
        apiv2.DeviceMgmt.SelectReq(data).then((res) => {
          if (res.error) {
            this.$message.error(res.error)
          } else {
            if (res.data.list.length) {
              formDeviceId.options = res.data.list.map((item) => ({ value: item.device_id, label: item.device_name }))
              this.formData.bindData.device_id = formDeviceId.options[0].value
              this.first = false
            } else {
              this.$message.warning('暂无设备')
            }
          }
        })
      } else {
        this.$message.error('未找到设备选项')
      }
    },
    formEvent(e, k) {
      if (e == 'changeSelect') {
        if (k.key == 'site_id') {
          this.formData.bindData.site_id = k.value
          this.getSiteDevice()
        }
      }

      if (e == 'search') {
        if (!this.formData.bindData.site_id) {
          this.$message.warning('未选择站点')
          return
        }
        if (!this.formData.bindData.device_id) {
          this.$message.warning('未选择设备')
          return
        }
        if (!this.formData.bindData.date_range) {
          this.$message.warning('未选择时间段')
          return
        }
        if (!this.formData.bindData.scale_unit) {
          this.$message.warning('未选择间隔单位')
          return
        }
        if (!this.formData.bindData.scale_value) {
          this.$message.warning('未设定间隔值')
          return
        }
        this.getChartData()
      }
    },
    handleX(acq_time) {
      if (this.formData.bindData.scale_unit == 'day') {
        return this.$moment(acq_time).format('YYYY-MM-DD')
      }
      if (this.formData.bindData.scale_unit == 'hour') {
        return this.$moment(acq_time).format('YYYY-MM-DD HH')
      }
      if (this.formData.bindData.scale_unit == 'minute') {
        return this.$moment(acq_time).format('YYYY-MM-DD HH:mm')
      }
      if (this.formData.bindData.scale_unit == 'second') {
        return this.$moment(acq_time).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.formData.bindData.scale_unit == 'month') {
        return this.$moment(acq_time).format('YYYY-MM')
      }
      if (this.formData.bindData.scale_unit == 'year') {
        return this.$moment(acq_time).format('YYYY')
      }
      if (this.formData.bindData.scale_unit == 'week') {
        return this.$moment(acq_time).format('YYYY-MM-DD')
      }
      return acq_time
    },
    getChartData() {
      this.dataset = []
      this.loading = true
      this.formData.bindData.start_date = this.formData.bindData.date_range[0]
      this.formData.bindData.end_date = this.formData.bindData.date_range[1]
      apiv2.DataStats.AnalysisReq(this.formData.bindData).then((res) => {
        this.loading = false
        if (res.code) {
          this.$message.error(res.message)
        } else {
          let chartData = []
          for (let i = 0; i < res.data.list.length; i++) {
            const item = res.data.list[i]
            item.acq_time = this.handleX(item.acq_time)
            let tag = chartData.find((o) => o.name == item.tag_name)
            if (!tag) {
              tag = { name: item.tag_name, suffix: item.acq_unit, data: [] }
              chartData.push(tag)
            }
            tag.data.push([item.acq_time, item.acq_value])
          }

          this.dataset = chartData
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.trend-form {
  /deep/ .el-form-item__content {
    >.el-input {
      .el-input__inner {
        text-align: center;
      }
    }
  }
}

.chart-content {
  height: 100%;
}
</style>
