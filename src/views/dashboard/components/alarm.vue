<template>
  <TableLite class="alarm" title="告警信息" iconName="alarm" :tableData="tableData">
    <template #title-slot>
      <div class="alarm-info">
        <div class="alarm-item">
          <div class="alarm-data round-box box-orange" @click="gotoPage('alarmHandle')">{{ unhandle }}</div>
          <div class="alarm-name">待处理告警</div>
        </div>
        <div class="alarm-item">
          <div class="alarm-data round-box box-yellow" @click="gotoPage('record', { type: 'alarm', date: 'today' })">{{ today }}</div>
          <div class="alarm-name">今日总告警</div>
        </div>
        <div class="alarm-item">
          <div class="alarm-data round-box box-blue" @click="gotoPage('record', { type: 'alarm', date: 'yesterday' })">{{ yesterday }}</div>
          <div class="alarm-name">昨日总告警</div>
        </div>
        <div class="alarm-item">
          <div class="alarm-data round-box box-red" @click="gotoPage('record', { type: 'alarm' })">{{ total }}</div>
          <div class="alarm-name">所有总告警</div>
        </div>
        <div class="alarm-item">
          <div class="alarm-data round-box box-skyblue" @click="gotoPage('maintenance')">{{ maint }}</div>
          <div class="alarm-name">需保养设备</div>
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
      diff: 0,
      today: 0,
      yesterday: 0,
      total: 0,
      maint: 0,
      alarmLevel: {
        critical: '1级',
        warning: '2级',
        important: '3级',
        notice: '4级',
      },
      tableData: {
        height: '100%',
        type: [
          {
            key: 'alarm_source',
            label: '告警来源',
          },
          {
            key: 'alarm_data',
            label: '告警数值',
          },
          {
            key: 'alarm_time',
            label: '告警时间',
          },
          {
            key: 'level_text',
            label: '告警等级',
          },
          {
            key: 'alarm_text',
            label: '告警文本',
          },
        ],
        list: [],
      },
    }
  },
  mounted() {
    this.getAllAlarmCount()
    this.getTodayAlarmCount()
    this.getYesterdayAlarmCount()
    this.getAlarmData()
    this.getMaintCount()
  },
  computed: {
    date() {
      return this.$moment().date()
    },
    unhandle() {
      return this.$store.state.alarm.alarmCount
    },
  },
  watch: {
    unhandle(a, b) {
      this.diff = a - b
      this.updateAlarmData()
    },
    date() {
      this.updateAlarmCount()
    },
  },
  components: { TableLite },
  methods: {
    getMaintCount() {
      apiv2.CommonData.MaintCountReq({ risk_percentage: 75 }).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.maint = res.data.count
        }
      })
    },
    getAllAlarmCount() {
      apiv2.CommonData.AlarmCountReq().then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.total = res.data.count
        }
      })
    },
    getTodayAlarmCount() {
      const today = this.$moment().format('YYYY-MM-DD')
      const start_date = today
      const end_date = today
      apiv2.CommonData.AlarmCountReq({ start_date, end_date }).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.today = res.data.count
        }
      })
    },
    getYesterdayAlarmCount() {
      const yesterday = this.$moment().subtract(1, 'd').format('YYYY-MM-DD')
      const start_date = yesterday
      const end_date = yesterday
      apiv2.CommonData.AlarmCountReq({ start_date, end_date }).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.yesterday = res.data.count
        }
      })
    },
    getAlarmData() {
      let list = []
      const alarmData = this.$store.getters.alarmData
      for (const topic in alarmData) {
        if (alarmData.hasOwnProperty(topic)) {
          let alarm_record_id = parseInt(topic.split('/').pop())
          let data = Object.assign({ alarm_record_id }, alarmData[topic])
          data.alarm_source = data.tag_name
          if (data.device_name) {
            data.alarm_source = data.device_name + '/' + data.alarm_source
          }
          if (data.site_name) {
            data.alarm_source = data.site_name + '/' + data.alarm_source
          }
          data.alarm_data = data.alarm_value
          if (data.acq_unit) {
            data.alarm_data += ' ' + data.acq_unit
          }
          data.level_text = this.alarmLevel[data.alarm_level]
          list.push(data)
        }
      }
      this.tableData.list = list.sort((a, b) => b.alarm_record_id - a.alarm_record_id)
    },
    updateAlarmData() {
      if (this.diff) {
        this.total += this.diff
        this.today += this.diff
      }
      this.getAlarmData()
    },
    updateAlarmCount() {
      this.getTodayAlarmCount()
      this.getYesterdayAlarmCount()
      this.getAllAlarmCount()
    },
    gotoPage(name, params) {
      this.$router.push({ name, params })
    },
  },
}
</script>
<style lang="less" scoped>
.alarm {
  height: 380px;
  pointer-events: all;

  .alarm-info {
    display: flex;
    padding-top: 10px;
    justify-content: space-around;

    .alarm-item {
      gap: 10px;
      display: flex;
      align-items: center;
      flex-direction: column;

      .alarm-data {
        color: #fff;
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
