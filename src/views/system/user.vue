<template>
  <layout-cmpt>
    <template #title>
      <title-cmpt title="用户管理"></title-cmpt>
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
            type: 'select',
            key: 'state',
            label: '用户状态',
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
            key: 'fullname',
            label: '用户名称',
            clearable: 'true',
          },
          {
            type: 'input',
            key: 'email',
            label: '电子邮箱',
            clearable: 'true',
          },
          {
            type: 'input',
            key: 'phone',
            label: '手机号码',
            clearable: 'true',
          },
        ],

        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.SystemUser.ListRoute,
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: apiv2.SystemUser.CreateRoute,
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
            key: 'username',
            label: '用户账号',
          },
          {
            key: 'fullname',
            label: '用户名称',
          },
          {
            key: 'state',
            label: '用户状态',
            cmpt: 'switch',
            check: 'not_self',
            permissionApi: apiv2.SystemUser.StateRoute,
          },
          {
            key: 'role_name',
            label: '用户角色',
          },
          {
            key: 'email',
            label: '电子邮箱',
          },
          {
            key: 'phone',
            label: '手机号码',
          },
          {
            key: 'note',
            label: '用户备注',
          },
          {
            key: 'do',
            label: '操作',
            width: 150,
            doList: [
              { name: '编辑', type: 'warning', check: 'not_self', permissionApi: apiv2.SystemUser.UpdateRoute },
              { name: '删除', type: 'danger', check: 'not_self', permissionApi: apiv2.SystemUser.DeleteRoute },
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
          user_id: 0,
          role_id: '',
          username: '',
          password: '',
          fullname: '',
          email: '',
          phone: '',
          note: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '用户账号',
              binding: 'username',
              cmpt: 'input',
            },
            {
              label: '用户名称',
              binding: 'fullname',
              cmpt: 'input',
            },
          ],
          [
            {
              label: '账号密码',
              binding: 'password',
              type: 'password',
              cmpt: 'input',
              single: true,
            },
          ],
          [
            {
              label: 'email',
              binding: 'email',
              cmpt: 'input',
            },
            {
              label: '手机号码',
              binding: 'phone',
              cmpt: 'input',
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
          username: [{ required: true, message: '请输入用户账号', trigger: 'submit' }],
          fullname: [{ required: true, message: '请输入用户名称', trigger: 'submit' }],
          role_id: [{ required: true, message: '请选择用户角色', trigger: 'submit' }],
        },
        labelWidth: '100px',
      },
    }
  },
  mounted() {
    if (this.$auth(apiv2.SystemRole.SelectRoute)) {
      this.getRoleSelect()
    }
    this.getUserList()
  },
  methods: {
    // 上面表单的事件 添加 查询
    formEvent(e) {
      if (e == 'add') {
        this.dialogData.title = '添加用户'
        this.dialogData.dialogVisible = true
      }
      if (e == 'search' || e == 'clearFactor') {
        this.pageData.page = 1
        this.getUserList()
      }
    },
    // 翻页事件
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getUserList()
    },
    // 表格事件
    tableEvent(e) {
      if (e.itm == '编辑') {
        this.dialogData.title = '修改用户'
        this.dialogData.dialogVisible = true
        this.dialogData.form = Object.assign({}, e.row)
      }
      if (e.itm == '修改状态') {
        let data = { user_id: e.row.user_id, state: e.row.state }
        apiv2.SystemUser.StateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('修改用户状态成功')
            this.getUserList()
          }
        })
      }
      if (e.itm == '删除') {
        let data = { user_id: e.row.user_id }
        apiv2.SystemUser.DeleteReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('删除用户成功')
            this.getUserList()
          }
        })
      }
    },
    // 获取用户列表
    getUserList() {
      this.tableData.list = []
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.SystemUser.ListReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((o) => {
            o.not_self = o.username != this.$store.getters.getUserInfo.username
            return o
          })
          this.pageData.total = res.data.total
        }
      })
    },
    // 获取角色选择列表
    getRoleSelect() {
      apiv2.SystemRole.SelectReq().then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          let options = res.data.list.map((o) => ({ label: o.role_name, value: o.role_id }))
          this.dialogData.formList.forEach((formList) => {
            let passwordDialog = formList.find((o) => o.binding == 'password')
            if (passwordDialog) {
              passwordDialog.single = false
              formList.push({
                label: '用户角色',
                binding: 'role_id',
                cmpt: 'select',
                options,
              })
            }
          })
        }
      })
    },
    // 弹出框表单事件
    dialogEvent(data) {
      if (this.dialogData.title == '添加用户') {
        apiv2.SystemUser.CreateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('添加用户成功')
            this.dialogData.dialogVisible = false
            this.getUserList()
          }
        })
      }
      if (this.dialogData.title == '修改用户') {
        apiv2.SystemUser.UpdateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('修改用户成功')
            this.dialogData.dialogVisible = false
            this.getUserList()
          }
        })
      }
    },
  },
}
</script>
