<template>
  <layout-cmpt>
    <template #title>
      <title-cmpt title="设备类型"></title-cmpt>
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
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
export default {
  name: 'device',
  data() {
    return {
      formData: {
        type: [
          {
            type: 'input',
            key: 'type_name',
            label: '设备类型',
            clearable: 'true',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.DeviceType.ListRoute,
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: apiv2.DeviceType.CreateRoute,
          },
        ],
        bindData: {
          type_name: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'type_name',
            label: '设备类型名称',
          },

          {
            key: 'do',
            label: '操作',
            doList: [
              { name: '编辑', type: 'warning', permissionApi: apiv2.DeviceType.UpdateRoute },
              { name: '删除', type: 'danger', permissionApi: apiv2.DeviceType.DeleteRoute },
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
          type_name: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '类型名称',
              binding: 'type_name',
              cmpt: 'input',
              single: true,
            },
          ],
        ],
        // 规则验证
        rules: {
          type_name: [{ required: true, message: '请输入设备类型名称', trigger: 'submit' }],
        },
        labelWidth: '100px',
      },
    }
  },
  mounted() {
    this.getdeviceList()
  },
  methods: {
    // 上面表单的事件 添加 查询
    formEvent(e) {
      if (e == 'add') {
        this.dialogData.dialogVisible = true
        this.dialogData.title = '添加设备类型'
      }
      if (e == 'changeSelect' || e == 'clearFactor' || e == 'search') {
        this.pageData.page = 1
        this.getdeviceList()
      }
    },
    // 翻页事件
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getdeviceList()
    },
    // 表格事件  改状态 改密码 编辑 删除
    tableEvent(e) {
      if (e.itm == '编辑') {
        this.dialogData.title = '修改设备类型'
        this.dialogData.form = Object.assign({}, e.row)
        this.dialogData.dialogVisible = true
      }
      if (e.itm == '删除') {
        apiv2.DeviceType.DeleteReq({ type_id: e.row.type_id }).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('删除设备类型成功')
            this.pageData.page = 1
            this.getdeviceList()
          }
        })
      }
    },
    // 获取列表数据
    getdeviceList() {
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.DeviceType.ListReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list
          this.pageData.total = res.data.total
        }
      })
    },
    // 弹出框表单事件 添加 修改设备类型
    dialogEvent(data) {
      if (this.dialogData.title == '添加设备类型') {
        apiv2.DeviceType.CreateReq(data).then((res) => {
          if (res.code == 0) {
            this.$message.success('添加设备类型成功')
            this.dialogData.dialogVisible = false
            this.pageData.page = 1
            this.getdeviceList()
          }
        })
      }
      if (this.dialogData.title == '修改设备类型') {
        apiv2.DeviceType.UpdateReq(data).then((res) => {
          if (res.code == 0) {
            this.$message.success('修改设备类型成功')
            this.dialogData.dialogVisible = false
            this.getdeviceList()
          }
        })
      }
    },
  },
}
</script>
