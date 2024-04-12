<template>
  <layout-cmpt :formFlag="formFlag" :tableFlag="tableFlag" :pageFlag="pageFlag">
    <template #title>
      <title-cmpt title="记录报表"></title-cmpt>
    </template>
    <template #special>
      <div class="tabBox">
        <el-button v-for="item in tabList" :key="item.value" :type="tabSelect == item.value ? 'primary' : ''"
          @click="tabClick(item.value)">{{ item.label }}</el-button>
      </div>
    </template>
    <template #form>
      <form-cmpt :formData="formData" @formEvent="formEvent"></form-cmpt>
    </template>
    <template #table>
      <table-cmpt :tableData="tableData" :loading="loading"></table-cmpt>
    </template>
    <template #page>
      <page-cmpt :pageData="pageData" @pageEvent="pageEvent"></page-cmpt>
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
export default {
  name: 'record',
  data() {
    const alarmLevelOptions = [
      { value: 'critical', label: '1级' },
      { value: 'warning', label: '2级' },
      { value: 'important', label: '3级' },
      { value: 'notice', label: '4级' },
    ]
    const handleModeOptions = [
      { value: 'confirm', label: '确认' },
      { value: 'ignore', label: '忽略' },
    ]
    const eventTypeOptions = [
      { label: '数字信号', value: 'signal' },
      { label: '设备网络', value: 'network' },
    ]
    const logTypeOptions = [
      { value: 'login', label: '登录' },
      { value: 'add', label: '新建' },
      { value: 'edit', label: '更新' },
      { value: 'set', label: '设置' },
      { value: 'delete', label: '删除' },
    ]
    return {
      tabSelect: '',
      tabList: [],
      siteList: null,
      alarmLevelOptions,
      handleModeOptions,
      eventTypeOptions,
      logTypeOptions,
      alarmFormData: {
        bindData: {
          site_id: '',
          device_id: '',
          tag_id: '',
          alarm_date: '',
          alarm_level: '',
          handle_mode: '',
        },
        type: [
          {
            width: '270px',
            format: 'yyyy-MM-dd',
            type: 'datePicker',
            key: 'alarm_date',
            label: '选择日期',
          },
          {
            width: '150px',
            type: 'select',
            key: 'site_id',
            label: '选择站点',
            options: [],
          },
          {
            width: '150px',
            type: 'select',
            key: 'device_id',
            label: '选择设备',
            options: [],
          },
          {
            width: '150px',
            type: 'select',
            key: 'tag_id',
            label: '选择标签',
            options: [],
          },
          {
            width: '100px',
            type: 'select',
            key: 'alarm_level',
            label: '告警等级',
            options: alarmLevelOptions,
          },
          {
            width: '100px',
            type: 'select',
            key: 'handle_mode',
            label: '处置模式',
            options: handleModeOptions,
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
          },
        ],
      },
      alarmTableType: [
        { key: 'alarm_time', label: '告警时间' },
        { key: 'alarm_source', label: '告警来源' },
        { key: 'alarm_level_text', label: '告警等级' },
        { key: 'alarm_value', label: '告警值' },
        { key: 'alarm_text', label: '告警文本' },
        { key: 'handle_mode_text', label: '处理模式' },
        { key: 'handle_user', label: '处理人' },
        { key: 'handle_time', label: '处理时间' },
        { key: 'handle_value', label: '处理值' },
        { key: 'handle_note', label: '处理备注' },
      ],
      eventFormData: {
        bindData: {
          event_date: '',
          event_type: '',
          ref_name: '',
        },
        type: [
          {
            width: '270px',
            format: 'yyyy-MM-dd',
            type: 'datePicker',
            key: 'event_date',
            label: '选择日期',
          },
          {
            width: '120px',
            type: 'select',
            key: 'event_type',
            label: '事件类型',
            options: eventTypeOptions,
          },
          {
            type: 'input',
            key: 'ref_name',
            label: '关联名称',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
          },
        ],
      },
      eventTableType: [
        { key: 'event_time', label: '事件时间' },
        { key: 'event_type_text', label: '事件类型' },
        { key: 'event_status_text', label: '事件状态' },
        { key: 'ref_name', label: '关联名称' },
        { key: 'event_content', label: '事件内容' },
      ],
      acqFormData: {
        bindData: {
          site_id: '',
          device_id: '',
          tag_id: '',
          acq_date: '',
        },
        type: [
          {
            width: '270px',
            format: 'yyyy-MM-dd',
            type: 'datePicker',
            key: 'acq_date',
            label: '选择日期',
          },
          {
            width: '150px',
            type: 'select',
            key: 'site_id',
            label: '选择站点',
            options: [],
          },
          {
            width: '150px',
            type: 'select',
            key: 'device_id',
            label: '选择设备',
            options: [],
          },
          {
            width: '150px',
            type: 'select',
            key: 'tag_id',
            label: '选择标签',
            options: [],
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
          },
        ],
      },
      acqTableType: [
        { key: 'acq_time', label: '采集时间' },
        { key: 'site_name', label: '站点名称' },
        { key: 'device_name', label: '设备名称' },
        { key: 'tag_name', label: '标签名称' },
        { key: 'acq_value', label: '采集数值' },
      ],
      logFormData: {
        bindData: {
          log_type: '',
          log_date: '',
          log_user: '',
        },
        type: [
          {
            width: '270px',
            format: 'yyyy-MM-dd',
            type: 'datePicker',
            key: 'log_date',
            label: '选择日期',
          },
          {
            width: '100px',
            type: 'select',
            key: 'log_type',
            label: '日志类型',
            options: logTypeOptions,
          },
          {
            type: 'input',
            key: 'log_user',
            label: '日志用户',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
          },
        ],
      },
      logTableType: [
        { key: 'log_time', label: '日志时间' },
        { key: 'log_type_text', label: '日志类型' },
        { key: 'log_user', label: '日志用户' },
        { key: 'log_event', label: '日志事件' },
      ],
      formFlag: false,
      formData: null,
      tableFlag: false,
      tableData: null,
      pageFlag: false,
      pageData: null,
      loading: false,
      dateRange: {
        start_date: "",
        end_date: ""
      }
    }
  },
  mounted() {
    if (this.$route.params) {
      if (this.$route.params.type == 'alarm') {
        if (this.$route.params.date == 'today') {
          this.formData.bindData.alarm_date = this.$moment().format('YYYY-MM-DD')
        }
        if (this.$route.params.date == 'yesterday') {
          this.formData.bindData.alarm_date = this.$moment().subtract(1, 'd').format('YYYY-MM-DD')
        }
      }
    }
    if (this.$auth(apiv2.DataRecord.AlarmRoute)) {
      this.tabList.push({ value: 'alarm', label: '告警记录' })
    }
    if (this.$auth(apiv2.DataRecord.EventRoute)) {
      this.tabList.push({ value: 'event', label: '事件记录' })
    }
    if (this.$auth(apiv2.DataRecord.AcquisitionRoute)) {
      this.tabList.push({ value: 'acq', label: '采集记录' })
    }
    if (this.$auth(apiv2.DataRecord.LogRoute)) {
      this.tabList.push({ value: 'log', label: '日志记录' })
    }
    this.tabClick(this.tabList[0].value)
  },
  methods: {
    tabClick(type) {
      this.tabSelect = type
      this.pageData = { page: 1, size: 20, total: 0 }

      this.formFlag = false
      this.tableFlag = false
      this.pageFlag = type != 'acq'

      let today = this.$moment().format('YYYY-MM-DD')
      this.$nextTick(() => {
        if (type == 'alarm') {

          this.alarmFormData.bindData.alarm_date = today
          this.formData = this.alarmFormData
          this.tableData = { type: this.alarmTableType, list: [] }
          if (this.$auth(apiv2.SiteMgmt.SelectRoute)) {
            this.getAllSite()
          }
        }
        if (type == 'event') {
          this.eventFormData.bindData.event_date = today
          this.formData = this.eventFormData
          this.tableData = { type: this.eventTableType, list: [] }
        }
        if (type == 'acq') {
          this.acqFormData.bindData.acq_date = today
          this.formData = this.acqFormData
          this.tableData = { type: this.acqTableType, list: [] }
          if (this.$auth(apiv2.SiteMgmt.SelectRoute)) {
            this.getAllSite()
          }
        }
        if (type == 'log') {
          this.logFormData.bindData.log_date = today
          this.formData = this.logFormData
          this.tableData = { type: this.logTableType, list: [] }
        }

        this.formFlag = true
        this.tableFlag = true

        this.getRecordList()
      })
    },
    formEvent(type, data) {
      if (type == 'changeSelect') {
        if (data.key == 'site_id') {
          if (this.$auth(apiv2.DeviceMgmt.SelectRoute)) {
            this.getSiteDevice()
          }
        }
        if (data.key == 'device_id') {
          if (this.$auth(apiv2.DeviceTag.SelectRoute)) {
            this.getDeviceTag()
          }
        }
      }


      if (type == 'search' || type == 'clearFactor' || type == 'changeDate' || type == 'changeSelect') {

        this.pageData.page = 1
        this.getRecordList()
      }
    },
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getRecordList()
    },
    getRecordList() {

      this.loading = true
      if (this.tabSelect == 'alarm') {


        this.dateRange = {
          start_date: this.formData.bindData.alarm_date ? this.formData.bindData.alarm_date[0] : "",
          end_date: this.formData.bindData.alarm_date ? this.formData.bindData.alarm_date[1] : "",
        }


        if (this.$auth(apiv2.DataRecord.AlarmRoute)) {
          this.getAlarmList()
        }
      }
      if (this.tabSelect == 'event') {



        this.dateRange = {
          start_date: this.formData.bindData.event_date ? this.formData.bindData.event_date[0] : "",
          end_date: this.formData.bindData.event_date ? this.formData.bindData.event_date[1] : "",
        }


        if (this.$auth(apiv2.DataRecord.EventRoute)) {
          this.getEventList()
        }
      }
      if (this.tabSelect == 'acq') {


        this.dateRange = {
          start_date: this.formData.bindData.acq_date ? this.formData.bindData.acq_date[0] : "",
          end_date: this.formData.bindData.acq_date ? this.formData.bindData.acq_date[1] : "",
        }


        if (this.$auth(apiv2.DataRecord.AcquisitionRoute)) {
          this.getAcqList()
        }
      }
      if (this.tabSelect == 'log') {

        this.dateRange = {
          start_date: this.formData.bindData.log_date ? this.formData.bindData.log_date[0] : "",
          end_date: this.formData.bindData.log_date ? this.formData.bindData.log_date[1] : "",
        }

        if (this.$auth(apiv2.DataRecord.LogRoute)) {
          this.getLogList()
        }
      }
    },
    getAlarmList() {
      let copyBindData = Object.assign({}, this.formData.bindData);
      delete copyBindData.alarm_date;
      let data = Object.assign({}, copyBindData, this.pageData, this.dateRange)
      apiv2.DataRecord.AlarmReq(data).then((res) => {
        this.loading = false
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((o) => {
            o.alarm_source = [o.site_name, o.device_name, o.tag_name].join('/')
            let alarm_level = this.alarmLevelOptions.find((t) => t.value == o.alarm_level)
            o.alarm_level_text = alarm_level ? alarm_level.label : ''
            let handle_mode = this.handleModeOptions.find((t) => t.value == o.handle_mode)
            o.handle_mode_text = handle_mode ? handle_mode.label : ''
            if (o.acq_unit) {
              o.alarm_value += ' ' + o.acq_unit
              if (o.handle_mode) {
                o.handle_value += ' ' + o.acq_unit
              }
            }
            return o
          })
          this.pageData.total = res.data.total
        }
      })
    },
    getEventList() {
      let copyBindData = Object.assign({}, this.formData.bindData);
      delete copyBindData.event_date;
      let data = Object.assign({}, copyBindData, this.pageData, this.dateRange)
      apiv2.DataRecord.EventReq(data).then((res) => {
        this.loading = false
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((o) => {
            let event_type = this.eventTypeOptions.find((t) => t.value == o.event_type)
            o.event_type_text = event_type ? event_type.label : ''
            o.event_status_text = o.event_status ? '开' : '关'
            return o
          })
          this.pageData.total = res.data.total
        }
      })
    },
    getAcqList() {
      let copyBindData = Object.assign({}, this.formData.bindData);
      delete copyBindData.acq_date;
      let data = Object.assign({}, copyBindData, this.dateRange)
      apiv2.DataRecord.AcquisitionReq(data).then((res) => {
        this.loading = false
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((o) => {
            if (o.acq_unit) {
              o.acq_value += ' ' + o.acq_unit
            }
            return o
          })
        }
      })
    },
    getLogList() {
      let copyBindData = Object.assign({}, this.formData.bindData);
      delete copyBindData.log_date;
      let data = Object.assign({}, copyBindData, this.pageData, this.dateRange)
      apiv2.DataRecord.LogReq(data).then((res) => {
        this.loading = false
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((o) => {
            let log_type = this.logTypeOptions.find((t) => t.value == o.log_type)
            o.log_type_text = log_type ? log_type.label : ''
            return o
          })
          this.pageData.total = res.data.total
        }
      })
    },
    getAllSite() {
      this.formData.bindData.site_id = ''
      const formSiteId = this.formData.type.find((o) => o.key == 'site_id')
      if (formSiteId) {
        if (this.siteList) {
          formSiteId.options = this.siteList
          if (!formSiteId.options.length) {
            this.$message.warning('暂无站点')
          }
        } else {
          formSiteId.options = []
          apiv2.SiteMgmt.SelectReq().then((res) => {
            if (res.error) {
              this.$message.error(res.error)
            } else {
              this.siteList = res.data.list.map((item) => ({ value: item.site_id, label: item.site_name }))
              formSiteId.options = this.siteList
              if (!formSiteId.options.length) {
                this.$message.warning('暂无站点')
              }
            }
          })
        }
      } else {
        this.$message.error('未找到站点选项')
      }
    },
    getSiteDevice() {
      this.formData.bindData.device_id = ''
      const formDeviceId = this.formData.type.find((o) => o.key == 'device_id')
      if (formDeviceId) {
        formDeviceId.options = []
        if (this.formData.bindData.site_id) {
          let data = { site_id: this.formData.bindData.site_id }
          apiv2.DeviceMgmt.SelectReq(data).then((res) => {
            if (res.error) {
              this.$message.error(res.error)
            } else {
              formDeviceId.options = res.data.list.map((item) => ({ value: item.device_id, label: item.device_name }))
              if (!formDeviceId.options.length) {
                this.$message.warning('暂无设备')
              }
            }
          })
        }
      } else {
        this.$message.error('未找到设备选项')
      }
    },
    getDeviceTag() {
      this.formData.bindData.tag_id = ''
      const formTagId = this.formData.type.find((o) => o.key == 'tag_id')
      if (formTagId) {
        formTagId.options = []
        if (this.formData.bindData.device_id) {
          let data = { device_id: this.formData.bindData.device_id }
          apiv2.DeviceTag.SelectReq(data).then((res) => {
            if (res.error) {
              this.$message.error(res.error)
            } else {
              formTagId.options = res.data.list.map((item) => ({ value: item.tag_id, label: item.tag_name }))
              if (!formTagId.options.length) {
                this.$message.warning('暂无设备')
              }
            }
          })
        }
      } else {
        this.$message.error('未找到标签选项')
      }
    },
  },
}
</script>
