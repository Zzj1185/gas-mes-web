<template>
  <layout-cmpt>
    <template #title>
      <title-cmpt title="维修工单"></title-cmpt>
    </template>
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
      <el-dialog class="repair-detail" width="70%" top="0" title="维修明细" :visible.sync="innerVisible" :modal="false" :close-on-click-modal="false">
        <RepairDetailCmpt v-if="innerVisible" :ticketId="ticketId" />
      </el-dialog>
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
import RepairDetailCmpt from './repairDetail.vue'
export default {
  name: 'User',
  components: { RepairDetailCmpt },
  data() {
    const stateOptions = [
      {
        value: 'pending',
        label: '待指派',
      },
      {
        value: 'assigned',
        label: '已指派',
      },
      {
        value: 'handling',
        label: '处理中',
      },
      {
        value: 'suspend',
        label: '已暂停',
      },
      {
        value: 'completed',
        label: '已完成',
      },
    ]
    return {
      stateOptions,
      userOptions: [],
      innerVisible: false,
      ticketId: 0,
      formData: {
        type: [
          {
            type: 'select',
            key: 'state',
            label: '维修状态',
            clearable: 'true',
            options: stateOptions,
          },
          {
            type: 'select',
            key: 'repair_user_id',
            label: '维修人员',
            clearable: 'true',
            options: [],
          },
          {
            labelWidth: '100px',
            type: 'datePicker',
            format: 'yyyy-MM-dd',
            key: 'date_range',
            label: '日期段选择',
            clearable: 'true',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
          },
        ],
        bindData: {
          state: '',
          repair_user_id: '',
          date_range: [],
          start_date: '',
          end_date: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'state_name',
            label: '状态',
          },
          {
            key: 'device_name',
            label: '设备名称',
          },
          {
            key: 'problem',
            label: '问题描述',
          },
          {
            key: 'create_time',
            label: '创建时间',
          },
          {
            key: 'repair_user',
            label: '维修人员',
          },
          {
            key: 'complete_time',
            label: '完成时间',
          },
          {
            key: 'do',
            label: '操作',
            doList: [
              { name: '明细', type: 'success', permissionApi: apiv2.RepairDetail.ViewRoute },
              { name: '指派', type: 'warning', permissionApi: apiv2.RepairDetail.CreateRoute },
              { name: '删除', type: 'danger', check: 'allow_delete', permissionApi: apiv2.RepairOrder.DeleteRoute },
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
        title: '新增文档',
        width: '30%',
        // 绑定表单
        form: {
          ticket_id: 0,
          record_detail: '',
          ticket_state: '',
          repair_user_id: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '指派人员',
              binding: 'repair_user_id',
              cmpt: 'select',
              options: [],
              single: true,
            },
          ],
        ],
        // 规则验证
        rules: {
          repair_user_id: [{ required: true, message: '请选择指派人员', trigger: 'submit' }],
        },
        labelWidth: '100px',
      },
    }
  },
  mounted() {
    if (this.$route.params) {
      this.formData.bindData = Object.assign(this.formData.bindData, this.$route.params)
    }
    this.getTicketList()
  },
  created() {
    if (this.$auth(apiv2.RepairOrder.UserRoute)) {
      this.getTicketUser()
    }
  },
  methods: {
    // 上面表单的事件 添加 查询
    formEvent(e) {
      if (e == 'search' || e == 'clearFactor') {
        if (this.formData.bindData.date_range) {
          this.formData.bindData.start_date = this.formData.bindData.date_range[0]
          this.formData.bindData.end_date = this.formData.bindData.date_range[1]
        }
        this.resetPage()
      }
    },
    resetPage() {
      this.pageData.page = 1
      this.getTicketList()
    },
    // 翻页事件
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getTicketList()
    },
    // 表格事件
    tableEvent(e) {
      if (e.itm == '明细') {
        this.ticketId = e.row.ticket_id
        this.innerVisible = true
      }
      if (e.itm == '指派') {
        this.dialogData.title = '指派工单'
        this.dialogData.form.ticket_id = e.row.ticket_id
        this.dialogData.dialogVisible = true
      }
      if (e.itm == '删除') {
        apiv2.RepairOrder.DeleteReq({ ticket_id: e.row.ticket_id }).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('删除工单成功')
            this.resetPage()
          }
        })
      }
    },
    // 获取列表数据
    getTicketList() {
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.RepairOrder.ListReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((item) => {
            let state_name = this.stateOptions.find((o) => o.value == item.state)
            item.state_name = state_name ? state_name.label : ''
            item.allow_delete = item.state != 'assigned' && item.state != 'handling'
            return item
          })
          this.pageData.total = res.data.total
        }
      })
    },
    // 弹出框表单事件
    dialogEvent(data) {
      if (this.dialogData.title == '指派工单') {
        let user = this.userOptions.find((o) => o.value == data.repair_user_id).label
        data.record_detail = '维修工单指派给' + user
        data.ticket_state = 'assigned'
        apiv2.RepairDetail.CreateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.dialogData.dialogVisible = false
            this.$message.success('指派成功')
            this.getTicketList()
          }
        })
      }
    },
    getTicketUser() {
      apiv2.RepairOrder.UserReq().then((res) => {
        if (res.code == 0) {
          this.userOptions = res.data.list.map((o) => ({ label: o.fullname, value: o.user_id }))
          let userForm = this.formData.type.find((o) => o.key == 'repair_user_id')
          if (userForm) {
            userForm.options = this.userOptions
          }
          this.dialogData.formList.forEach((formList) => {
            let userDialog = formList.find((o) => o.binding == 'repair_user_id')
            if (userDialog) {
              userDialog.options = this.userOptions
            }
          })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .repair-detail {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0004;

  > .el-dialog {
    margin: 0;
    height: 50%;
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
