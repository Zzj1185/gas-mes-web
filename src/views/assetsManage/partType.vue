<template>
  <layout-cmpt>
    <template #title>
      <title-cmpt title="备件类型"></title-cmpt>
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
  name: 'type',
  data() {
    return {
      formData: {
        type: [
          {
            type: 'input',
            key: 'type_name',
            labelWidth: '100px',
            label: '备件类型名称',
            clearable: 'true',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.PartType.ListRoute,
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: apiv2.PartType.CreateRoute,
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
            label: '备件类型名称',
          },

          {
            key: 'do',
            label: '操作',
            doList: [
              { name: '编辑', type: 'warning', permissionApi: apiv2.PartType.UpdateRoute },
              { name: '删除', type: 'danger', permissionApi: apiv2.PartType.DeleteRoute },
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
              label: '备件类型',
              binding: 'type_name',
              cmpt: 'input',
              single: true,
            },
          ],
        ],
        // 规则验证
        rules: {
          type_name: [{ required: true, message: '请输入备件类型名称', trigger: 'submit' }],
        },
        labelWidth: '100px',
      },
    }
  },
  mounted() {
    this.getTypeList()
  },
  methods: {
    // 上面表单的事件 添加 查询
    formEvent(e) {
      if (e == 'add') {
        this.dialogData.dialogVisible = true
        this.dialogData.title = '添加备件类型'
      }
      if (e == 'changeSelect' || e == 'clearFactor' || e == 'search') {
        this.pageData.page = 1
        this.getTypeList()
      }
    },
    // 翻页事件
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getTypeList()
    },
    // 表格事件
    tableEvent(e) {
      if (e.itm == '编辑') {
        this.dialogData.form = Object.assign({}, e.row)
        this.dialogData.title = '修改备件类型'
        this.dialogData.dialogVisible = true
      }
      if (e.itm == '删除') {
        apiv2.PartType.DeleteReq({ type_id: e.row.type_id }).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('删除备件类型成功')
            this.pageData.page = 1
            this.getTypeList()
          }
        })
      }
    },
    // 获取列表数据
    getTypeList() {
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.PartType.ListReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list
          this.pageData.total = res.data.total
        }
      })
    },
    // 弹出框表单事件
    dialogEvent(data) {
      if (this.dialogData.title == '添加备件类型') {
        apiv2.PartType.CreateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('添加备件类型成功')
            this.dialogData.dialogVisible = false
            this.pageData.page = 1
            this.getTypeList()
          }
        })
      }
      if (this.dialogData.title == '修改备件类型') {
        apiv2.PartType.UpdateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('修改备件类型成功')
            this.dialogData.dialogVisible = false
            this.getTypeList()
          }
        })
      }
    },
  },
}
</script>
