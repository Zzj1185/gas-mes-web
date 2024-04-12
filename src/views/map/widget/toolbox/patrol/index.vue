<template>
  <div>
    <div class="patrol-btn">
      <div class="btn-icon" @click="clickBtn"></div>
      <div class="btn-name">巡检任务</div>
    </div>
    <drawer-cmpt :drawerData="drawerData">
      <template #form>
        <form-cmpt :formData="formData" @formEvent="formEvent"></form-cmpt>
      </template>
      <template #table>
        <table-cmpt :tableData="tableData" @tableEvent="tableEvent"></table-cmpt>
      </template>
      <template #page>
        <page-cmpt :pageData="pageData" @pageEvent="pageEvent"></page-cmpt>
      </template>
      <template #dialog>
        <form-dialog :dialogData="dialogData" @dialogEvent="dialogEvent" @changeSelect="changeSelect" @drawRange="drawRange"></form-dialog>
      </template>
      <template #special>
        <PatrolReport ref="report" :map="map" />
      </template>
    </drawer-cmpt>
  </div>
</template>

<script>
import apiv2 from '@/api/v2'
import PatrolReport from './reportDrawer.vue'
export default {
  data() {
    // 站点数量验证
    const validateSiteNum = function (_, value, callback) {
      if (value > 0) {
        callback()
      } else {
        callback(new Error('巡检范围内没有任何站点'))
      }
    }
    const cycleUnitOptions = [
      { value: 'day', label: '天' },
      { value: 'week', label: '周' },
      { value: 'month', label: '月' },
      { value: 'year', label: '年' },
    ]

    var validateNumber = (rule, value, callback) => {
      if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
        callback(new Error('巡检周期只能为数字值'))
      } else {
        callback()
      }
    }

    return {
      cycleUnitList: { day: '天', week: '周', month: '月', year: '年' },
      drawerData: {
        drawerVisible: false,
        title: '巡检任务',
      },
      formData: {
        type: [
          {
            type: 'input',
            key: 'task_name',
            label: '任务名称',
            clearable: 'true',
            labelWidth: '115px',
          },
          {
            type: 'input',
            key: 'patrol_user',
            label: '巡检人员',
            clearable: 'true',
            labelWidth: '115px',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.PatrolTask.ListRoute,
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: apiv2.PatrolTask.CreateRoute,
          },
        ],
        bindData: {
          task_name: '',
          patrol_user: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'task_name',
            label: '任务名称',
          },
          {
            key: 'patrol_user',
            label: '巡检人员',
          },
          {
            key: 'patrol_cycle',
            label: '巡检周期',
          },
          {
            key: 'site_count',
            label: '检测点',
          },
          {
            key: 'completion_rate',
            label: '完成度',
            width: '300px',
          },
          {
            key: 'do',
            label: '操作',
            width: '134px',
            doList: [
              [{ name: '查看汇报', type: 'success', permissionApi: apiv2.PatrolReport.ViewRoute, style: { width: '114px' } }],
              [
                { name: '编辑', type: 'warning', permissionApi: apiv2.PatrolTask.UpdateRoute },
                { name: '删除', type: 'danger', permissionApi: apiv2.PatrolTask.DeleteRoute },
              ],
            ],
          },
        ],
        list: [],
      },
      pageData: { page: 1, size: 20, total: 0 },
      dialogData: {
        dialogVisible: false,
        title: '新增巡检任务',
        // 绑定表单
        form: {
          task_id: 0,
          task_name: '',
          site_type_id: '',
          patrol_range: '',
          site_ids: [],
          site_num: 0,
          patrol_user_id: '',
          cycle: '',
          cycle_unit: '',
          note: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '任务名称',
              binding: 'task_name',
              cmpt: 'input',
            },
            {
              label: '巡检人员',
              binding: 'patrol_user_id',
              cmpt: 'select',
              options: [],
            },
          ],
          [
            {
              label: '巡检周期',
              binding: 'cycle',
              cmpt: 'number',
              min: 1,
            },
            {
              label: '周期单位',
              binding: 'cycle_unit',
              cmpt: 'select',
              options: cycleUnitOptions,
            },
          ],
          [
            {
              label: '站点类型',
              binding: 'site_type_id',
              cmpt: 'select',
              options: [],
            },
            {
              label: '站点数量',
              binding: 'site_num',
              drawing: false,
              cmpt: 'selectRange',
            },
          ],
          [
            {
              label: '备注',
              binding: 'note',
              cmpt: 'inputTextarea',
              single: true,
            },
          ],
        ],
        // 规则验证
        rules: {
          task_name: [{ required: true, message: '请输入任务名称', trigger: 'submit' }],
          patrol_user_id: [{ required: true, message: '请选择巡检站点', trigger: 'submit' }],
          cycle: [
            { required: true, message: '请输入巡检周期', trigger: 'submit' },
            { validator: validateNumber, trigger: 'blur' },
          ],
          site_num: [
            { required: true, message: '请选择巡检站点', trigger: 'submit' },
            { validator: validateSiteNum, trigger: 'blur' },
          ],
        },
        labelWidth: '100px',
      },
      siteTypeList: [],
      patrolUserList: [],
    }
  },
  mounted() {
    if (this.$auth(apiv2.SiteType.SelectRoute)) {
      this.getAllSiteType()
    }
    if (this.$auth(apiv2.PatrolTask.UserRoute)) {
      this.getAllPatrolUser()
    }
  },
  props: {
    map: Object,
  },
  components: { PatrolReport },
  methods: {
    getAllSiteType() {
      apiv2.SiteType.SelectReq().then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.siteTypeList = res.data.list.map((o) => ({ label: o.type_name, value: o.type_id }))

          this.dialogData.formList.forEach((list) => {
            const formSiteTypeId = list.find((o) => o.binding == 'site_type_id')
            if (formSiteTypeId) {
              formSiteTypeId.options = this.siteTypeList
            }
          })
        }
      })
    },
    getAllPatrolUser() {
      apiv2.PatrolTask.UserReq().then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.patrolUserList = res.data.list.map((o) => ({ label: o.fullname, value: o.user_id }))

          this.dialogData.formList.forEach((list) => {
            const formPatrolUserId = list.find((o) => o.binding == 'patrol_user_id')
            if (formPatrolUserId) {
              formPatrolUserId.options = this.patrolUserList
            }
          })
        }
      })
    },
    getPatrolTaskList() {
      let params = Object.assign({}, this.pageData, this.formData.bindData)
      apiv2.PatrolTask.ListReq(params).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((o) => {
            o.patrol_cycle = o.cycle + '次/每' + this.cycleUnitList[o.cycle_unit]
            o.site_num = o.site_ids.length
            o.site_count = o.site_num + '个'
            o.formula = `${o.report_count}/${o.site_ids.length * o.cycle}`
            let value = o.report_count / (o.site_ids.length * o.cycle)
            if (isNaN(value)) {
              value = 0
            }
            o.completion_rate = parseFloat((value * 100).toFixed(2))
            return o
          })
          this.pageData.total = res.data.total
        }
      })
    },
    reset() {
      this.drawerData.drawerVisible = false
      this.pageData.page = 1
      this.pageData.size = 20
      this.pageData.total = 0
      this.formData.bindData.task_name = ''
      this.formData.bindData.patrol_user = ''
      this.tableData.list = []
      if (this.$refs.report) {
        this.$refs.report.close()
      }
    },
    clickBtn() {
      if (!this.drawerData.drawerVisible) {
        this.openDrawer()
      } else {
        this.closeDrawer()
      }
    },
    openDrawer() {
      this.$emit('close-all')
      this.getPatrolTaskList()
      this.drawerData.drawerVisible = true
    },
    closeDrawer() {
      this.reset()
    },
    formEvent(type) {
      if (type == 'search') {
        this.pageData.page = 1
        this.getPatrolTaskList()
      }
      if (type == 'add') {
        this.dialogData.title = '新增巡检任务'
        this.dialogData.dialogVisible = true
      }
    },
    tableEvent(data) {
      let { row, itm } = data
      if (itm == '查看汇报') {
        this.$refs.report.open(row.task_id, row.cycle_unit)
      }
      if (itm == '编辑') {
        this.changeSelect()
        this.dialogData.title = '编辑巡检任务'
        this.dialogData.form = row
        this.dialogData.dialogVisible = true
      }
      if (itm == '删除') {
        this.deletePatrolTask({ task_id: row.task_id })
      }
    },
    pageEvent() {
      this.getPatrolTaskList()
    },
    dialogEvent(data) {
      if (data.task_id) {
        this.editPatrolTask(data)
      } else {
        this.addPatrolTask(data)
      }
    },
    changeSelect() {
      this.dialogData.formList.forEach((list) => {
        const formSiteNum = list.find((o) => o.binding == 'site_num')
        if (formSiteNum) {
          formSiteNum.drawing = true
        }
      })
    },
    drawRange() {
      let path = []
      let data = this.dialogData.form.patrol_range
      if (data) {
        let list = data.split(',')
        if (list.length % 2) {
          this.$message.error('范围数据存在问题')
        } else {
          for (let i = 0; i < list.length; ) {
            const p1 = list[i++]
            const p2 = list[i++]
            path.push([p1, p2])
          }
        }
      }
      let type_id = this.dialogData.form.site_type_id
      this.$emit('drawRange', type_id, path)
    },
    // 更新范围
    updateRange(path, ids) {
      this.dialogData.form.site_ids = ids
      this.dialogData.form.patrol_range = path
      this.dialogData.form.site_num = ids.length
    },
    addPatrolTask(data) {
      apiv2.PatrolTask.CreateReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.$message.success('添加成功')
          this.dialogData.dialogVisible = false
          this.getPatrolTaskList()
        }
      })
    },
    editPatrolTask(data) {
      apiv2.PatrolTask.UpdateReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.$message.success('更新成功')
          this.dialogData.dialogVisible = false
          this.getPatrolTaskList()
        }
      })
    },
    deletePatrolTask(data) {
      apiv2.PatrolTask.DeleteReq(data).then((res) => {
        if (res.message) {
          this.$message.error('删除失败：' + res.message)
        } else {
          this.$message.success('删除成功')
          this.getPatrolTaskList()
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.patrol-btn {
  width: 58px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .btn-icon {
    cursor: pointer;
    width: 46px;
    height: 46px;
    background-size: 100%;
    background-repeat: no-repeat;
    background-image: url('@/assets/patrol_btn.png');
  }

  .btn-name {
    font-size: 12px;
    line-height: 20px;
    font-weight: bold;
  }
}
</style>
