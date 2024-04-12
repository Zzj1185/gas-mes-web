<template>
  <layout-cmpt>
    <template #title>
      <title-cmpt title="角色管理"></title-cmpt>
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
      <el-dialog class="role-permission" width="95%" top="0" title="分配权限" :visible.sync="innerVisible" :modal="false" :close-on-click-modal="false">
        <PermissionCmpt v-if="innerVisible" :roleId="dialog_role_id" />
      </el-dialog>
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
import PermissionCmpt from './permission.vue'
export default {
  name: 'Role',
  components: { PermissionCmpt },
  data() {
    return {
      dialog_role_id: 0,
      innerVisible: false,
      formData: {
        type: [
          {
            type: 'input',
            key: 'role_name',
            label: '角色名称',
            clearable: 'true',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.SystemRole.ListRoute,
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: apiv2.SystemRole.CreateRoute,
          },
        ],
        bindData: {
          role_name: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'role_name',
            label: '角色名称',
          },
          {
            key: 'do',
            label: '操作',
            width: '300px',
            doList: [
              { name: '分配权限', type: 'success', permissionApi: apiv2.RoleAuth.ViewRoute },
              { name: '编辑', type: 'warning', permissionApi: apiv2.SystemRole.UpdateRoute },
              { name: '删除', type: 'danger', permissionApi: apiv2.SystemRole.DeleteRoute },
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
        width: '20%',
        // 绑定表单
        form: {
          role_name: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '角色名称',
              binding: 'role_name',
              cmpt: 'input',
              single: true,
            },
          ],
        ],
        // 规则验证
        rules: {
          role_name: [{ required: true, message: '请输入角色名称', trigger: 'submit' }],
        },
        labelWidth: '100px',
      },
      dialogDataAuth: {
        dialogVisible: false,
        width: '90%',
      },
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    // 获取列表数据
    getRoleList() {
      this.tableData.list = []
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.SystemRole.ListReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list
          this.pageData.total = res.data.total
        }
      })
    },
    // 上面表单的事件 添加 查询
    formEvent(e) {
      if (e == 'add') {
        this.dialogData.dialogVisible = true
        this.dialogData.title = '添加角色'
      }
      if (e == 'search' || e == 'clearFactor') {
        this.pageData.page = 1
        this.getRoleList()
      }
    },
    // 翻页事件
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getRoleList()
    },
    // 表格事件  改状态 改密码 编辑 删除
    tableEvent(e) {
      if (e.itm == '分配权限') {
        this.dialog_role_id = e.row.role_id
        this.innerVisible = true
      }
      if (e.itm == '编辑') {
        this.dialogData.title = '修改角色'
        this.dialogData.dialogVisible = true
        this.dialogData.form = Object.assign({}, e.row)
      }
      if (e.itm == '删除') {
        let data = { role_id: e.row.role_id }
        apiv2.SystemRole.DeleteReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('删除角色成功')
            this.getRoleList()
          }
        })
      }
    },
    // 弹出框表单事件
    dialogEvent(data) {
      if (this.dialogData.title == '添加角色') {
        apiv2.SystemRole.CreateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('添加角色成功')
            this.dialogData.dialogVisible = false
            this.getRoleList()
          }
        })
      }
      if (this.dialogData.title == '修改角色') {
        apiv2.SystemRole.UpdateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('修改角色成功')
            this.dialogData.dialogVisible = false
            this.getRoleList()
          }
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .role-permission {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0004;

  > .el-dialog {
    margin: 0;
    display: flex;
    flex-direction: column;

    > .el-dialog__body {
      flex: 1;
    }
  }
}
</style>
