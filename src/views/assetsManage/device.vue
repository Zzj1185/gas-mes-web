<template>
  <layout-cmpt>
    <template #title>
      <title-cmpt title="设备管理"></title-cmpt>
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
      <form-dialog :dialogData="dialogDataDevice" @dialogEvent="dialogEventDevice"></form-dialog>
      <form-dialog :dialogData="dialogDataRepair" @dialogEvent="dialogEventRepair"></form-dialog>
      <el-dialog class="acq-tag" width="80%" top="0" title="采集标签" :visible.sync="innerVisible" :modal="false" :close-on-click-modal="false">
        <AcqTagCmpt v-if="innerVisible" :deviceId="dialog_device_id" />
      </el-dialog>
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
import AcqTagCmpt from './acqTag.vue'
export default {
  name: 'devices',
  components: { AcqTagCmpt },
  data() {
    const stateOptions = [
      { value: 'idle', label: '闲置中' },
      { value: 'repair', label: '维修中' },
      { value: 'running', label: '运行中' },
    ]
    return {
      dialog_device_id: 0,
      innerVisible: false,
      deviceTypeOptions: [],
      formData: {
        type: [
          {
            type: 'select',
            key: 'type_id',
            label: '设备类型',
            clearable: 'true',
            options: [],
            permissionApi: apiv2.DeviceType.SelectRoute,
          },
          {
            type: 'select',
            key: 'state',
            label: '设备状态',
            options: stateOptions,
          },
          {
            type: 'input',
            key: 'device_name',
            label: '设备名称',
            clearable: 'true',
          },
          {
            type: 'input',
            key: 'device_no',
            label: '设备编号',
            clearable: 'true',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.DeviceMgmt.ListRoute,
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: apiv2.DeviceMgmt.CreateRoute,
          },
        ],
        bindData: {
          type_id: '',
          state: '',
          device_name: '',
          device_no: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'device_no',
            label: '设备编号',
          },
          {
            key: 'device_name',
            label: '设备名称',
          },
          {
            key: 'type_name',
            label: '设备类型',
          },
          {
            key: 'state',
            label: '设备状态',
            cmpt: 'switch',
            activeText: '运行中',
            activeValue: 'running',
            inactiveText: '闲置中',
            inactiveValue: 'idle',
            permissionApi: apiv2.DeviceMgmt.StateRoute,
          },
          {
            key: 'purchase_date',
            label: '采购日期',
          },
          {
            key: 'do',
            label: '操作',
            width: '300px',
            doList: [
              { name: '采集点位', type: 'success', permissionApi: apiv2.DeviceTag.ListRoute },
              { name: '报修', type: 'info', check: 'allow_repair', permissionApi: apiv2.RepairOrder.CreateRoute },
              { name: '编辑', type: 'warning', permissionApi: apiv2.DeviceMgmt.UpdateRoute },
              { name: '删除', type: 'danger', permissionApi: apiv2.DeviceMgmt.DeleteRoute },
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
      dialogDataDevice: {
        dialogVisible: false,
        width: '50%',
        // 绑定表单
        form: {
          type_id: '',
          device_name: '',
          device_no: '',
          purchase_date: '',
          max_interval: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '设备编号',
              binding: 'device_no',
              cmpt: 'input',
              single: true,
            },
          ],
          [
            {
              label: '设备名称',
              binding: 'device_name',
              cmpt: 'input',
            },
            {
              label: '设备类型',
              binding: 'type_id',
              cmpt: 'select',
              options: [],
            },
          ],
          [
            {
              label: '采购日期',
              binding: 'purchase_date',
              cmpt: 'datePicker',
            },
            {
              label: '保养间隔天数',
              binding: 'max_interval',
              cmpt: 'number',
              min: 1,
            },
          ],
        ],
        // 规则验证
        rules: {
          device_no: [{ required: true, message: '请输入设备编号', trigger: 'submit' }],
          device_name: [{ required: true, message: '请输入设备名称', trigger: 'submit' }],
          type_id: [{ required: true, message: '请选择设备类型', trigger: 'submit' }],
          purchase_date: [{ required: true, message: '请输入购买日期', trigger: 'submit' }],
          max_interval: [{ required: true, message: '请输入保养间隔天数', trigger: 'submit' }],
        },
        labelWidth: '120px',
      },
      dialogDataRepair: {
        dialogVisible: false,
        width: '50%',
        // 绑定表单
        form: {
          device_id: 0,
          problem: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '问题描述',
              binding: 'problem',
              cmpt: 'inputTextarea',
              single: true,
            },
          ],
        ],
        // 规则验证
        rules: {
          problem: [{ required: true, message: '请输入问题描述', trigger: 'submit' }],
        },
        labelWidth: '120px',
      },
    }
  },
  mounted() {
    if (this.$auth(apiv2.DeviceType.SelectRoute)) {
      this.getDeviceTypeAll()
    }
    this.getDeviceList()
  },
  methods: {
    getDeviceTypeAll() {
      apiv2.DeviceType.SelectReq().then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.deviceTypeOptions = res.data.list.map((item) => ({ value: item.type_id, label: item.type_name }))

          const formDeviceTypeId = this.formData.type.find((o) => o.key == 'type_id')
          if (formDeviceTypeId) {
            formDeviceTypeId.options = this.deviceTypeOptions
          }

          this.dialogDataDevice.formList.forEach((list) => {
            const formDeviceTypeId = list.find((o) => o.binding == 'type_id')
            if (formDeviceTypeId) {
              formDeviceTypeId.options = this.deviceTypeOptions
            }
          })
        }
      })
    },
    getDeviceList() {
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.DeviceMgmt.ListReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((item) => {
            item.purchase_date = this.$moment(item.purchase_date).format('YYYY-MM-DD')
            item.allow_repair = item.state != 'repair'
            return item
          })
          this.pageData.total = res.data.total
        }
      })
    },
    // 上面表单的事件 添加 查询
    formEvent(e) {
      if (e == 'add') {
        delete this.dialogDataDevice.form.device_id
        this.dialogDataDevice.dialogVisible = true
        this.dialogDataDevice.title = '添加设备'
      }
      if (e == 'search' || e == 'clearFactor') {
        this.pageData.page = 1
        this.getDeviceList()
      }
    },
    // 翻页事件
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getDeviceList()
    },
    tableEvent(e) {
      if (e.itm == '修改状态') {
        let data = { device_id: e.row.device_id, state: e.row.state }
        apiv2.DeviceMgmt.StateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('设备状态修改成功')
            this.getDeviceList()
          }
        })
      }

      if (e.itm == '编辑') {
        this.dialogDataDevice.form = Object.assign({}, e.row)
        this.dialogDataDevice.title = '修改设备'
        this.dialogDataDevice.dialogVisible = true
      }

      if (e.itm == '删除') {
        let data = { device_id: e.row.device_id }
        apiv2.DeviceMgmt.DeleteReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('设备删除成功')
            this.getDeviceList()
          }
        })
      }

      if (e.itm == '采集点位') {
        this.dialog_device_id = e.row.device_id
        this.innerVisible = true
      }

      if (e.itm == '报修') {
        this.dialogDataRepair.form.device_id = e.row.device_id
        this.dialogDataRepair.title = '设备报修'
        this.dialogDataRepair.dialogVisible = true
      }
    },
    dialogEventDevice(e) {
      if (e.device_id) {
        this.editDevice(e)
      } else {
        this.addDevice(e)
      }
    },
    dialogEventRepair(data) {
      apiv2.RepairOrder.CreateReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.$message.success('设备报修成功')
          this.dialogDataRepair.dialogVisible = false
          this.getDeviceList()
        }
      })
    },
    addDevice(data) {
      apiv2.DeviceMgmt.CreateReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.$message.success('添加设备成功')
          this.dialogDataDevice.dialogVisible = false
          this.getDeviceList()
        }
      })
    },
    editDevice(data) {
      apiv2.DeviceMgmt.UpdateReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.$message.success('修改设备成功')
          this.dialogDataDevice.dialogVisible = false
          this.getDeviceList()
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .acq-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0004;

  > .el-dialog {
    margin: 0;
    height: 80%;
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
