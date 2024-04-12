<template>
  <layout-cmpt :titleFlag="false" :pageFlag="false">
    <template #form>
      <form-cmpt :formData="formData" @formEvent="formEvent"></form-cmpt>
    </template>
    <template #table>
      <table-cmpt :tableData="tableData" @tableEvent="tableEvent"></table-cmpt>
    </template>
    <template #special>
      <form-dialog :dialogData="dialogData" @dialogEvent="dialogEvent"></form-dialog>
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
export default {
  name: 'AlarmRule',
  props: {
    tagId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    const stateOptions = [
      { value: 'active', label: '启用' },
      { value: 'deactive', label: '停用' },
    ]
    const compareModeOptions = [
      { value: 'eq', label: '等于' },
      { value: 'gt', label: '大于' },
      { value: 'gte', label: '大于等于' },
      { value: 'lt', label: '小于' },
      { value: 'lte', label: '小于等于' },
      { value: 'neq', label: '不等于' },
    ]
    const alarmLevelOptions = [
      { value: 'critical', label: '1级' },
      { value: 'warning', label: '2级' },
      { value: 'important', label: '3级' },
      { value: 'notice', label: '4级' },
    ]
    return {
      compareModeOptions,
      alarmLevelOptions,
      formData: {
        type: [
          {
            type: 'select',
            key: 'state',
            label: '启用状态',
            clearable: 'true',
            options: stateOptions,
          },
          {
            type: 'select',
            key: 'compare_mode',
            label: '比较模式',
            clearable: 'true',
            options: compareModeOptions,
          },
          {
            type: 'select',
            key: 'alarm_level',
            label: '告警等级',
            clearable: 'true',
            options: alarmLevelOptions,
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.AlarmRule.ListRoute,
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: apiv2.AlarmRule.CreateRoute,
          },
        ],
        bindData: {
          tag_id: this.$props.tagId, //点击 告警规则绑定
          state: '',
          compare_mode: '',
          alarm_level: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'tag_name',
            label: '所属标签',
          },
          {
            key: 'state',
            label: '启用状态',
            cmpt: 'switch',
            permissionApi: apiv2.AlarmRule.StateRoute,
          },
          {
            key: 'level_name',
            label: '告警等级',
          },
          {
            key: 'alarm_rule',
            label: '告警规则',
          },
          {
            key: 'alarm_text',
            label: '告警文本',
          },
          {
            key: 'do',
            label: '操作',
            doList: [
              { name: '编辑', type: 'warning', permissionApi: apiv2.AlarmRule.UpdateRoute },
              { name: '删除', type: 'danger', permissionApi: apiv2.AlarmRule.DeleteRoute },
            ],
          },
        ],
        list: [],
      },
      pageData: {
        page: 1,
        size: 20,
        total: 0,
      },
      dialogData: {
        dialogVisible: false,
        width: '50%',
        // 绑定表单
        form: {
          tag_id: this.$props.tagId,
          compare_mode: '',
          compare_value: '',
          alarm_level: '',
          alarm_text: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '比较模式',
              binding: 'compare_mode',
              cmpt: 'select',
              options: compareModeOptions,
            },
            {
              label: '比较数值',
              binding: 'compare_value',
              cmpt: 'input',
            },
          ],
          [
            {
              label: '告警等级',
              binding: 'alarm_level',
              cmpt: 'select',
              options: alarmLevelOptions,
            },
            {
              cmpt: 'input',
              binding: 'alarm_text',
              label: '告警文本',
              clearable: 'true',
            },
          ],
        ],
        // 规则验证
        rules: {
          compare_mode: [{ required: true, message: '请选择比较模式', trigger: 'submit' }],
          compare_value: [{ required: true, message: '请输入比较数值', trigger: 'submit' }],
          alarm_level: [{ required: true, message: '请选择告警等级', trigger: 'submit' }],
          alarm_text: [{ required: true, message: '请输入告警文本', trigger: 'submit' }],
        },
        labelWidth: '120px',
      },
    }
  },
  mounted() {
    this.getAlarmList()
  },
  methods: {
    getAlarmList() {
      apiv2.AlarmRule.ListReq(this.formData.bindData).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((item) => {
            let compare_mode = this.compareModeOptions.find((o) => o.value == item.compare_mode)
            item.alarm_rule = compare_mode ? compare_mode.label + ' ' + item.compare_value + ' ' + item.acq_unit : ''
            let alarm_level = this.alarmLevelOptions.find((o) => o.value == item.alarm_level)
            item.level_name = alarm_level ? alarm_level.label : ''
            return item
          })
          this.pageData.total = res.data.list.length
        }
      })
    },
    formEvent(e) {
      if (e == 'add') {
        this.dialogData.title = '新增告警规则'
        this.dialogData.dialogVisible = true
      }
      if (e == 'search' || e == 'clearFactor') {
        this.pageData.page = 1
        this.getAlarmList()
      }
    },
    tableEvent(e) {
      if (e.itm == '编辑') {
        this.dialogData.form = Object.assign({}, e.row)
        this.dialogData.title = '编辑告警规则'
        this.dialogData.dialogVisible = true
      }
      if (e.itm == '删除') {
        let data = { rule_id: e.row.rule_id }
        apiv2.AlarmRule.DeleteReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('删除告警规则成功')
            this.pageData.page = 1
            this.getAlarmList()
          }
        })
      }
      if (e.itm == '修改状态') {
        let data = { rule_id: e.row.rule_id, state: e.row.state }
        apiv2.AlarmRule.StateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('告警规则状态修改成功')
            this.getAlarmList()
          }
        })
      }
    },
    dialogEvent(data) {
      if (this.dialogData.title == '编辑告警规则') {
        this.editAlarmRule(data)
      }
      if (this.dialogData.title == '新增告警规则') {
        this.addAlarmRule(data)
      }
    },
    addAlarmRule(data) {
      apiv2.AlarmRule.CreateReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.$message.success('添加告警规则成功')
          this.dialogData.dialogVisible = false
          this.pageData.page = 1
          this.getAlarmList()
        }
      })
    },
    editAlarmRule(data) {
      apiv2.AlarmRule.UpdateReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.$message.success('修改告警规则成功')
          this.dialogData.dialogVisible = false
          this.getAlarmList()
        }
      })
    },
  },
}
</script>
