<template>
  <layout-cmpt>
    <template #title>
      <title-cmpt title="知识类别"></title-cmpt>
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
  name: 'User',
  data() {
    return {
      formData: {
        type: [
          {
            type: 'input',
            key: 'category_name',
            label: '知识类别名称',
            clearable: 'true',
            labelWidth: '100px',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            categoryApi: apiv2.ArchiveType.ListRoute,
          },
          {
            key: 'add',
            label: '添加',
            type: 'primary',
            categoryApi: apiv2.ArchiveType.CreateRoute,
          },
        ],
        bindData: {
          category_name: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'category_name',
            label: '知识类别名称',
          },

          {
            key: 'do',
            label: '操作',
            doList: [
              { name: '编辑', type: 'warning', categoryApi: apiv2.ArchiveType.UpdateRoute },
              { name: '删除', type: 'danger', categoryApi: apiv2.ArchiveType.DeleteRoute },
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
          category_id: 0,
          pid: 0,
          category_name: 'string',
        },
        // 循环表单
        formList: [
          [
            {
              label: '知识类别名称',
              binding: 'category_name',
              cmpt: 'input',
              single: true,
            },
          ],
        ],
        // 规则验证
        rules: {
          category_name: [{ required: true, message: '请输入知识类别名称', trigger: 'submit' }],
        },
        labelWidth: '150px',
      },
    }
  },
  mounted() {
    this.getcategoryList()
  },
  methods: {
    // 上面表单的事件 添加 查询
    formEvent(e) {
      if (e == 'add') {
        this.dialogData.title = '添加知识类别'

        // 对话框所有绑定的数据置空
        Object.keys(this.dialogData.form).forEach((key) => {
          this.dialogData.form[key] = ''
        })
        this.dialogData.dialogVisible = true
        this.getcategoryList()
      } else if (e == 'changeSelect' || e == 'clearFactor' || e == 'search') {
        this.getcategoryList()
      }
    },
    // 翻页事件
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getcategoryList()
    },
    // 表格事件  改状态 改密码 编辑 删除
    tableEvent(e) {
      if (e.itm == '编辑') {
        this.dialogData.title = '修改知识类别'
        this.dialogData.dialogVisible = true
        this.dialogData.form = Object.assign({}, e.row)
      }
      if (e.itm == '删除') {
        apiv2.ArchiveType.DeleteReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('删除知识类别成功')
            this.getcategoryList()
          }
        })
      }
    },
    // 获取列表数据
    getcategoryList() {
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.ArchiveType.ListReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list
          this.pageData.total = res.data.total
        }
      })
    },
    // 弹出框表单事件 添加 修改知识类别
    dialogEvent(data) {
      if (this.dialogData.title == '添加知识类别') {
        apiv2.ArchiveType.CreateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('添加知识类别成功')
            this.dialogData.dialogVisible = false
            this.getcategoryList()
          }
        })
      }
      if (this.dialogData.title == '修改知识类别') {
        apiv2.ArchiveType.UpdateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('修改知识类别成功')
            this.dialogData.dialogVisible = false
            this.getcategoryList()
          }
        })
      }
    },
  },
}
</script>
