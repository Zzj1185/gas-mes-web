<template>
  <layout-cmpt :tableFlag="false">
    <template #title>
      <title-cmpt title="告警处置"></title-cmpt>
    </template>
    <template #special>
      <table-cmpt :tableData="tableData" @tableEvent="tableEvent"></table-cmpt>
      <form-dialog :dialogData="dialogData" @dialogEvent="dialogEvent"></form-dialog>
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
export default {
  name: 'AlarmHandle',
  data() {
    return {
      alarmLevel: {
        critical: '1级',
        warning: '2级',
        important: '3级',
        notice: '4级',
      },
      tableData: {
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
          {
            key: 'do',
            label: '操作',
            doList: [{ name: '处置', type: 'warning', permissionApi: apiv2.AlarmMgmt.HandleRoute }],
          },
        ],
        list: [],
      },
      dialogData: {
        dialogVisible: false,
        width: '30%',
        form: {
          alarm_record_id: 0,
          handle_mode: '',
          note: '',
        },
        formList: [
          [
            {
              label: '处置模式',
              binding: 'handle_mode',
              cmpt: 'select',
              options: [
                { value: 'confirm', label: '确认' },
                { value: 'ignore', label: '忽略' },
              ],
              single: true,
            },
          ],
          [
            {
              label: '处置备注',
              binding: 'note',
              cmpt: 'inputTextarea',
              single: true,
            },
          ],
        ],
        rules: {
          handle_mode: [{ required: true, message: '请选择处置模式', trigger: 'submit' }],
        },
        labelWidth: '120px',
      },
    }
  },
  mounted() {
    this.updateAlarmData()
  },
  computed: {
    alarmCount() {
      return this.$store.state.alarm.alarmCount
    },
  },
  watch: {
    alarmCount() {
      this.updateAlarmData()
    },
  },
  methods: {
    updateAlarmData() {
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
    tableEvent(e) {
      if (e.itm == '处置') {
        this.dialogData.form.alarm_record_id = e.row.alarm_record_id
        this.dialogData.title = '告警处置'
        this.dialogData.dialogVisible = true
      }
    },
    dialogEvent(data) {
      this.handleUpdate(data)
    },
    handleUpdate(data) {
      apiv2.AlarmMgmt.HandleReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.dialogData.dialogVisible = false
          this.$message.success('处置成功')
        }
      })
    },
  },
}
</script>
