<template>
  <layout-cmpt>
    <template #title>
      <title-cmpt title="系统配置"></title-cmpt>
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
  name: 'config',
  data() {
    return {
      formData: {
        type: [
          {
            type: 'select',
            key: 'state',
            label: '配置状态',
            options: [
              {
                value: 'active',
                label: '启用',
              },
              {
                value: 'deactive',
                label: '停用',
              },
            ],
          },
          {
            type: 'input',
            key: 'cfg_name',
            label: '配置名称',
            clearable: 'true',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.SystemConfig.ListRoute,
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: apiv2.SystemConfig.CreateRoute,
          },
        ],
        bindData: {
          state: '',
          fullname: '',
          email: '',
          phone: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'cfg_name',
            label: '配置名称',
            width: 200,
          },
          {
            key: 'state',
            label: '配置状态',
            cmpt: 'switch',
            permissionApi: apiv2.SystemConfig.StateRoute,
          },
          {
            key: 'cfg_note',
            label: '配置备注',
            width: 200,
          },
          {
            key: 'cfg_value',
            label: '配置值',
          },
          {
            key: 'do',
            label: '操作',
            doList: [
              { name: '编辑', type: 'warning', permissionApi: apiv2.SystemConfig.UpdateRoute },
              { name: '删除', type: 'danger', permissionApi: apiv2.SystemConfig.DeleteRoute },
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
        width: '50%',
        // 绑定表单
        form: {
          cfg_id: 0,
          cfg_name: '',
          cfg_note: '',
          cfg_value: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '配置名称',
              binding: 'cfg_name',
              cmpt: 'input',
            },
            {
              label: '配置备注',
              binding: 'cfg_note',
              cmpt: 'input',
            },
          ],
          [
            {
              label: '配置值',
              binding: 'cfg_value',
              cmpt: 'inputTextarea',
              single: true,
            },
          ],
        ],
        // 规则验证
        rules: {
          cfg_name: [{ required: true, message: '请输入配置名称', trigger: 'submit' }],
          cfg_value: [{ required: true, message: '请输入配置值', trigger: 'submit' }],
        },
        labelWidth: '100px',
      },
    }
  },
  mounted() {
    this.getConfigList()
  },
  methods: {
    // 上面表单的事件 添加 查询
    formEvent(e) {
      if (e == 'add') {
        this.dialogData.dialogVisible = true
        this.dialogData.title = '添加配置'
      } else if (e == 'changeSelect' || e == 'clearFactor' || e == 'search') {
        this.pageData.page = 1
        this.getConfigList()
      }
    },
    // 翻页事件
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getConfigList()
    },
    // 表格事件  改状态 改密码 编辑 删除
    tableEvent(e) {
      if (e.itm == '编辑') {
        this.dialogData.title = '修改配置'
        this.dialogData.dialogVisible = true
        this.dialogData.form = Object.assign({}, e.row)
      }
      if (e.itm == '修改状态') {
        let data = { cfg_id: e.row.cfg_id, state: e.row.state }
        apiv2.SystemConfig.StateReq(data).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '修改配置状态成功',
              duration: 1000,
            })
            this.getConfigList()
          }
        })
      }
      if (e.itm == '删除') {
        let data = { cfg_id: e.row.cfg_id }
        apiv2.SystemConfig.DeleteReq(data).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '删除配置成功',
              duration: 1000,
            })
            this.getConfigList()
          }
        })
      }
    },
    // 获取列表数据
    getConfigList() {
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.SystemConfig.ListReq(data).then((res) => {
        if (res.code == 0) {
          this.tableData.list = res.data.list
          this.pageData.total = res.data.total
        } else {
          this.tableData.list = []
          this.pageData.total = 0
          this.$message.error(res.message)
        }
      })
    },
    // 弹出框表单事件
    dialogEvent(data) {
      if (this.dialogData.title == '添加配置') {
        apiv2.SystemConfig.CreateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('添加配置成功')
            this.dialogData.dialogVisible = false
            this.getConfigList()
          }
        })
      }
      if (this.dialogData.title == '修改配置') {
        apiv2.SystemConfig.UpdateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('修改配置成功')
            this.dialogData.dialogVisible = false
            this.getConfigList()
          }
        })
      }
    },
  },
}
</script>
