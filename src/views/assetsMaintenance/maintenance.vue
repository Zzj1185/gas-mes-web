<template>
  <layout-cmpt>
    <template #title>
      <title-cmpt title="设备生命周期管理"></title-cmpt>
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
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
export default {
  name: 'maintenance',
  data() {
    const stateOptions = [
      { value: 'idle', label: '闲置中' },
      { value: 'running', label: '运行中' },
      { value: 'repair', label: '维修中' },
    ]
    return {
      stateOptions,
      deviceTypeOptions: [],
      formData: {
        type: [
          {
            type: 'select',
            key: 'type_id',
            label: '设备类型',
            clearable: 'true',
            options: [],
            permissionApi: apiv2.DeviceType.SelectRoute
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
            key: 'state_name',
            label: '设备状态',
          },
          {
            key: 'purchase_date',
            label: '采购日期',
          },
          {
            key: 'last_date',
            label: '上次保养日期',
          },
          {
            key: 'max_interval',
            label: '保养间隔天数',
          },
          {
            key: 'next_date',
            label: '下次保养日期',
          },
          {
            key: 'risk_percentage',
            label: '故障风险百分比',
          },
          {
            key: 'do',
            label: '操作',
            doList: [{ name: '更新', type: 'success', permissionApi: apiv2.DeviceMaint.UpdateRoute }],
          },
        ],
        list: [],
      },
      pageData: {
        page: 1,
        size: 20,
        total: 0,
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
        }
      })
    },
    // 上面表单的事件 添加 查询
    formEvent(e) {
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
    // 表格事件
    tableEvent(e) {
      if (e.itm == '更新') {
        this.$confirm('此操作将更新设备保养，是否继续？', { type: 'warning' })
          .then(() => {
            let data = { device_id: e.row.device_id }
            apiv2.DeviceMaint.UpdateReq(data).then((res) => {
              if (res.code) {
                this.$message.error(res.message)
              } else {
                this.$message.success('设备保养更新成功')
                this.getDeviceList()
              }
            })
          })
          .catch(() => {})
      }
    },
    // 获取列表数据
    getDeviceList() {
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.DeviceMaint.ListReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((item) => {
            let state = this.stateOptions.find((o) => o.value == item.state)
            item.state_name = state ? state.label : ''
            item.purchase_date = this.$moment(item.purchase_date).format('YYYY-MM-DD')
            item.last_date = this.$moment(item.last_date).format('YYYY-MM-DD')
            item.next_date = this.$moment(item.next_date).format('YYYY-MM-DD')
            return item
          })
          this.pageData.total = res.data.total
        }
      })
    },
  },
}
</script>
