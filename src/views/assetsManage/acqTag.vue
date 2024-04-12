<template>
  <layout-cmpt :titleFlag="false">
    <template #form>
      <form-cmpt :formData="formData" @formEvent="formEvent"></form-cmpt>
    </template>
    <template #table>
      <table-cmpt :tableData="tableData" @tableEvent="tableEvent"></table-cmpt>
    </template>
    <template #page>
      <page-cmpt :pageData="pageData" @pageEvent="pageEvent"></page-cmpt>
    </template>
    <template #special>
      <form-dialog :dialogData="dialogData" @dialogEvent="dialogEvent"></form-dialog>
      <el-dialog class="alarm-rule" width="75%" top="0" title="告警规则" :visible.sync="innerVisible" :modal="false" :close-on-click-modal="false">
        <AlarmRuleCmpt v-if="innerVisible" :tagId="dialog_tag_id" />
      </el-dialog>
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
import AlarmRuleCmpt from './alarmRule.vue'
export default {
  name: 'AcqTag',
  components: { AlarmRuleCmpt },
  props: {
    deviceId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    const acqTypeOptions = [
      { value: 'analog', label: '模拟采集' },
      { value: 'digital', label: '数字采集' },
    ]
    return {
      dialog_tag_id: 0,
      innerVisible: false,
      acqTypeOptions: acqTypeOptions,
      formData: {
        type: [
          {
            type: 'input',
            key: 'tag_name',
            label: '标签名',
            clearable: 'true',
          },
          {
            type: 'input',
            key: 'topic',
            label: '订阅主题',
            clearable: 'true',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.DeviceTag.ListRoute,
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: apiv2.DeviceTag.CreateRoute,
          },
        ],
        bindData: {
          device_id: this.$props.deviceId,
          tag_name: '',
          topic: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'device_name',
            label: '所属设备',
          },
          {
            key: 'topic',
            label: '订阅主题',
          },
          {
            key: 'tag_name',
            label: '标签名称',
          },
          {
            key: 'tag_code',
            label: '标签代码',
          },
          {
            key: 'acq_unit',
            label: '采集单位',
          },
          {
            key: 'type_name',
            label: '采集类型',
          },
          {
            doName: '标记标签',
            key: 'is_key',
            label: '关键标签',
            cmpt: 'switch',
            activeText: '是',
            activeValue: 'true',
            inactiveText: '否',
            inactiveValue: 'false',
            permissionApi: apiv2.SiteTag.MarkRoute,
          },
          {
            key: 'do',
            label: '操作',
            width: '300px',
            doList: [
              { name: '告警规则', type: 'success', permissionApi: apiv2.AlarmRule.ListRoute },
              { name: '编辑', type: 'warning', permissionApi: apiv2.DeviceTag.UpdateRoute },
              { name: '删除', type: 'danger', permissionApi: apiv2.DeviceTag.DeleteRoute },
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
          device_id: this.$props.deviceId,
          topic: '',
          tag_name: '',
          tag_code: '',
          acq_unit: '',
          acq_type: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '订阅主题',
              binding: 'topic',
              cmpt: 'input',
              single: true,
            },
          ],
          [
            {
              label: '标签名称',
              binding: 'tag_name',
              cmpt: 'input',
            },
            {
              label: '标签代码',
              binding: 'tag_code',
              cmpt: 'input',
            },
          ],
          [
            {
              label: '采集类型',
              binding: 'acq_type',
              cmpt: 'select',
              options: acqTypeOptions,
            },
            {
              label: '采集单位',
              binding: 'acq_unit',
              cmpt: 'input',
            },
          ],
        ],
        // 规则验证
        rules: {
          topic: [{ required: true, message: '请输入订阅主题', trigger: 'submit' }],
          tag_name: [{ required: true, message: '请输入标签名称', trigger: 'submit' }],
          tag_code: [{ required: true, message: '请输入标签代码', trigger: 'submit' }],
          acq_type: [{ required: true, message: '请选择采集类型', trigger: 'submit' }],
        },
        labelWidth: '120px',
      },
    }
  },
  mounted() {
    this.getAcqTagList()
  },
  methods: {
    getAcqTagList() {
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.DeviceTag.ListReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((item) => {
            let acq_type = this.acqTypeOptions.find((o) => o.value == item.acq_type)
            item.type_name = acq_type ? acq_type.label : ''
            item.is_key = String(item.is_key)
            return item
          })
          this.pageData.total = res.data.total
        }
      })
    },
    /* 采集标签 */
    formEvent(e) {
      if (e == 'add') {
        this.dialogData.title = '新增采集点位'
        this.dialogData.dialogVisible = true
      }
      if (e == 'search' || e == 'clearFactor') {
        this.pageData.page = 1
        this.getAcqTagList()
      }
    },
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getAcqTagList()
    },
    tableEvent(e) {
      if (e.itm == '编辑') {
        this.dialogData.title = '编辑采集点位'
        this.dialogData.dialogVisible = true
        this.dialogData.form = e.row
      }
      if (e.itm == '删除') {
        let data = { tag_id: e.row.tag_id }
        apiv2.DeviceTag.DeleteReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('删除采集点位成功')
            this.dialogData.dialogVisible = false
            this.getAcqTagList()
          }
        })
      }
      if (e.itm == '告警规则') {
        this.dialog_tag_id = e.row.tag_id
        this.innerVisible = true
      }
      if (e.itm == '标记标签') {
        //关键标签
        let state = JSON.parse(e.row.is_key)
        let mark_mode = state ? 'mark' : 'unmark'
        let message = state ? '标记' : '撤销'
        apiv2.SiteTag.MarkReq({ site_id: e.row.site_id, tag_id: e.row.tag_id, mark_mode }).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success(message + '关键标签成功')
            this.getAcqTagList()
          }
        })
      }
    },
    dialogEvent(data) {
      if (this.dialogData.title == '编辑采集点位') {
        apiv2.DeviceTag.UpdateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('编辑采集点位成功')
            this.dialogData.dialogVisible = false
            this.getAcqTagList()
          }
        })
      }
      if (this.dialogData.title == '新增采集点位') {
        apiv2.DeviceTag.CreateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('新增采集点位成功')
            this.dialogData.dialogVisible = false
            this.pageData.page = 1
            this.getAcqTagList()
          }
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .alarm-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0004;

  > .el-dialog {
    margin: 0;
    height: 75%;
    display: flex;
    flex-direction: column;

    > .el-dialog__body {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
  }
}
</style>
