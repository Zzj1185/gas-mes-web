<template>
  <div>
    <el-button type="primary" v-if="checkAuth()" size="mini" class="videoManage" @click="clickBtn">工艺管理</el-button>
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
        <form-dialog :dialogData="dialogData" @dialogEvent="dialogEvent"></form-dialog>
      </template>
    </drawer-cmpt>
  </div>
</template>

<script>
import apiv2 from '@/api/v2'
export default {
  name: 'ProcessMng',
  data() {
    return {
      drawerData: {
        drawerVisible: false,
        title: '工艺管理',
      },
      siteOptions: [],
      formData: {
        type: [
          {
            type: 'input',
            key: 'title',
            label: '工艺名称',
            clearable: 'true',
            size: 'mini',
            width: '100px',
          },
          {
            type: 'select',
            key: 'site_id',
            label: '所属站点',
            clearable: 'true',
            size: 'mini',
            width: '100px',
            options: [],
            permissionApi: apiv2.SiteMgmt.SelectRoute,
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            size: 'mini',
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            size: 'mini',
          },
        ],
        bindData: {
          site_id: '',
          title: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'title',
            label: '工艺名称',
          },
          {
            key: 'sort',
            label: '排序',
          },
          {
            key: 'site_name',
            label: '所属站点',
          },
          {
            key: 'do',
            label: '操作',
            doList: [
              { name: '编辑', type: 'warning', permissionApi: apiv2.ProcessMgmt.UpdateRoute },
              { name: '删除', type: 'danger', permissionApi: apiv2.ProcessMgmt.DeleteRoute },
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
          process_id: 0,
          title: '',
          sort: 0,
          site_id: '',
          diagram_data: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '工艺名称',
              binding: 'title',
              cmpt: 'input',
              single: true,
            },
          ],
          [
            {
              label: '所属站点',
              binding: 'site_id',
              cmpt: 'select',
              options: [],
            },
            {
              label: '排序',
              binding: 'sort',
              cmpt: 'number',
              min: 0,
            },
          ],
          [
            {
              label: '工艺数据',
              binding: 'diagram_data',
              cmpt: 'inputTextarea',
              single: true,
            },
          ],
        ],
        // 规则验证
        rules: {
          title: [{ required: true, message: '请输入工艺名称', trigger: 'submit' }],
          site_id: [{ required: true, message: '请选择所属站点', trigger: 'submit' }],
          diagram_data: [{ required: true, message: '请输入工艺数据', trigger: 'submit' }],
        },
        labelWidth: '100px',
      },
    }
  },
  mounted() {
    if (this.$auth(apiv2.SiteMgmt.SelectRoute)) {
      this.getSiteAll()
    }
  },
  methods: {
    // 校验权限
    checkAuth() {
      return this.$auth(apiv2.ProcessMgmt.ListRoute)
    },
    clickBtn() {
      this.pageData.page = 1
      this.pageData.size = 20
      this.pageData.total = 0
      this.formData.bindData.title = ''
      this.tableData.list = []
      this.getProcessList()
      this.drawerData.drawerVisible = true
    },
    // 上面表单的事件 添加 查询
    formEvent(e) {
      if (e == 'add') {
        this.dialogData.dialogVisible = true
        this.dialogData.title = '添加工艺'
      }
      if (e == 'changeSelect' || e == 'clearFactor' || e == 'search') {
        this.pageData.page = 1
        this.getProcessList()
      }
    },
    // 翻页事件
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getProcessList()
    },
    // 表格事件  改状态 改密码 编辑 删除
    tableEvent(e) {
      if (e.itm == '编辑') {
        this.dialogData.form = Object.assign({}, e.row)
        this.dialogData.title = '修改工艺'
        this.dialogData.dialogVisible = true
      }
      if (e.itm == '删除') {
        apiv2.ProcessMgmt.DeleteReq({ process_id: e.row.process_id }).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('删除站点工艺成功')
            this.pageData.page = 1
            this.getProcessList()
            this.$emit('update')
          }
        })
      }
    },
    // 获取列表数据
    getProcessList() {
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.ProcessMgmt.ListReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list
          this.pageData.total = res.data.total
        }
      })
    },
    // 弹出框表单事件 添加 修改站点工艺
    dialogEvent(data) {
      if (this.dialogData.title == '添加工艺') {
        apiv2.ProcessMgmt.CreateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('添加工艺成功')
            this.dialogData.dialogVisible = false
            this.pageData.page = 1
            this.getProcessList()
            this.$emit('update')
          }
        })
      }
      if (this.dialogData.title == '修改工艺') {
        apiv2.ProcessMgmt.UpdateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('修改工艺成功')
            this.dialogData.dialogVisible = false
            this.getProcessList()
            this.$emit('update')
          }
        })
      }
    },
    // 查询站点All
    getSiteAll() {
      apiv2.SiteMgmt.SelectReq({ type_id: 1 }).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.siteOptions = res.data.list.map((o) => ({ label: o.site_name, value: o.site_id }))
          let siteForm = this.formData.type.find((o) => o.key == 'site_id')
          if (siteForm) {
            siteForm.options = this.siteOptions
          }
          this.dialogData.formList.forEach((list) => {
            let siteDialog = list.find((o) => o.binding == 'site_id')
            if (siteDialog) {
              siteDialog.options = this.siteOptions
            }
          })
        }
      })
    },
  },
}
</script>
<style scoped lang="less">
.processContainer {
  position: fixed;
  left: 0;
  top: 0;
  background: blue;
}
.drawerLayout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  border: 1px solid red;

  //   align-items: center;
}
</style>
