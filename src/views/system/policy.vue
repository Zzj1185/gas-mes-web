<template>
  <layout-cmpt>
    <template #title>
      <title-cmpt title="权限管理"></title-cmpt>
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
  name: 'Permission',
  data() {
    return {
      pidList: [],
      formData: {
        type: [
          {
            type: 'input',
            key: 'permission_name',
            label: '权限名称',
            clearable: 'true',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.SystemAuth.ListRoute,
          },
          {
            key: 'add',
            label: '重建',
            type: 'primary',
            permissionApi: apiv2.SystemAuth.RebuildRoute,
          },
        ],
        bindData: {
          pid: 0,
          permission_name: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'sort',
            label: '排序',
            width: 50,
          },
          {
            key: 'permission_name',
            label: '权限名称',
            width: 100,
          },
          {
            key: 'permission_route',
            label: '权限路由',
          },
          {
            key: 'do',
            label: '操作',
            width: 250,
            doList: [
              { name: '子权限', type: 'success' },
              { name: '编辑', type: 'warning', permissionApi: apiv2.SystemAuth.UpdateRoute },
              { name: '删除', type: 'danger', permissionApi: apiv2.SystemAuth.DeleteRoute },
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
        title: '',
        width: '50%',
        // 绑定表单
        form: {
          pid: 0,
          sort: 0,
          permission_name: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '权限名称',
              binding: 'permission_name',
              cmpt: 'input',
            },
            {
              label: '权限序号',
              binding: 'sort',
              cmpt: 'number',
              min: 1,
            },
          ],
        ],
        // 规则验证
        rules: {
          permission_name: [{ required: true, message: '请输入权限名称', trigger: 'submit' }],
        },
        labelWidth: '100px',
      },
    }
  },
  mounted() {
    this.getPolicyList()
  },
  methods: {
    // 上面表单的事件 添加 查询
    formEvent(e) {
      if (e == 'add') {
        this.$confirm('此操作将重建所有权限，是否继续？', { type: 'warning' })
          .then(() => {
            apiv2.SystemAuth.RebuildReq().then((res) => {
              if (res.code) {
                this.$message.error(res.message)
              } else {
                this.$message.success('重建权限成功')
                this.dialogData.dialogVisible = false
                this.getPolicyList()
              }
            })
          })
          .catch(() => {})
      } else if (e == 'changeSelect' || e == 'clearFactor' || e == 'search') {
        this.pageData.page = 1
        this.getPolicyList()
      } else if (e == 'back') {
        this.formData.bindData.pid = this.pidList.pop()
        this.pageData.page = 1
        this.getPolicyList()
      }
    },
    // 翻页事件
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getPolicyList()
    },
    // 表格事件  改状态 改密码 编辑 删除
    tableEvent(e) {
      if (e.itm == '子权限') {
        this.pidList.push(this.formData.bindData.pid)
        this.formData.bindData.pid = e.row.permission_id
        this.getPolicyList()
      }
      if (e.itm == '编辑') {
        this.dialogData.title = '修改权限'
        this.dialogData.dialogVisible = true
        this.dialogData.form = Object.assign({}, e.row)
      }
      if (e.itm == '删除') {
        let data = { permission_id: e.row.permission_id }
        apiv2.SystemAuth.DeleteReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('删除权限成功')
            this.dialogData.dialogVisible = false
            this.getPolicyList()
          }
        })
      }
    },
    // 获取列表数据
    getPolicyList() {
      this.tableData.list = []
      if (this.formData.bindData.pid) {
        if (this.formData.btn[0].key != 'back') {
          this.formData.btn = [{ key: 'back', label: '返回' }, ...this.formData.btn]
        }
      } else {
        if (this.formData.btn[0].key == 'back') {
          this.formData.btn.shift()
        }
      }
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.SystemAuth.ListReq(data).then((res) => {
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
      if (this.dialogData.title == '修改权限') {
        apiv2.SystemAuth.UpdateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('修改权限成功')
            this.dialogData.dialogVisible = false
            this.getPolicyList()
          }
        })
      }
    },
  },
}
</script>
