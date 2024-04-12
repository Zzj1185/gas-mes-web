<template>
  <div>
    <div class="sitetype-btn">
      <div class="btn-icon" @click="clickBtn"></div>
      <div class="btn-name">站点类型</div>
    </div>
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
  data() {
    return {
      drawerData: {
        drawerVisible: false,
        title: '站点类型',
      },
      formData: {
        type: [
          {
            type: 'input',
            key: 'type_name',
            label: '类型名称',
            clearable: 'true',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.SiteType.ListRoute,
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: apiv2.SiteType.CreateRoute,
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
            label: '类型名称',
          },
          {
            key: 'type_icon',
            label: '类型图标',
          },
          {
            key: 'icon_color',
            label: '类型颜色',
            cmpt: 'iconDot',
          },
          {
            key: 'icon_size',
            label: '类型大小',
          },
          {
            key: 'do',
            label: '操作',
            doList: [
              { name: '编辑', type: 'warning', permissionApi: apiv2.SiteType.UpdateRoute },
              { name: '删除', type: 'danger', permissionApi: apiv2.SiteType.DeleteRoute },
            ],
          },
        ],
        list: [],
      },
      pageData: { page: 1, size: 20, total: 0 },
      dialogData: {
        dialogVisible: false,
        title: '新增站点类型',
        // 绑定表单
        form: {
          pid: 0,
          type_name: '',
          type_icon: '',
          icon_color: '',
          icon_size: 10,
        },
        // 循环表单
        formList: [
          [
            {
              label: '类型名称',
              binding: 'type_name',
              cmpt: 'input',
            },
            {
              label: '类型图标',
              binding: 'type_icon',
              cmpt: 'select',
              options: [
                {
                  value: 'factory',
                  label: 'factory',
                },
                {
                  value: 'valve',
                  label: 'valve',
                },
                {
                  value: 'house',
                  label: 'house',
                },
              ],
            },
          ],
          [
            {
              label: '图标颜色',
              binding: 'icon_color',
              cmpt: 'color',
            },
            {
              label: '图标大小',
              binding: 'icon_size',
              cmpt: 'number',
              min: 1,
            },
          ],
        ],
        // 规则验证
        rules: {
          type_name: [{ required: true, message: '请输入站点类型名称', trigger: 'submit' }],
          type_icon: [{ required: true, message: '请选择站点类型图标', trigger: 'submit' }],
          icon_color: [{ required: true, message: '请选择站点类型颜色', trigger: 'submit' }],
          icon_size: [{ required: true, message: '请输入站点类型大小', trigger: 'submit' }],
        },
        labelWidth: '100px',
      },
    }
  },
  methods: {
    reset() {
      this.drawerData.drawerVisible = false
      this.pageData.page = 1
      this.pageData.size = 20
      this.pageData.total = 0
      this.formData.bindData.type_name = ''
      this.tableData.list = []
    },
    clickBtn() {
      if (!this.drawerData.drawerVisible) {
        this.openDrawer()
      } else {
        this.closeDrawer()
      }
    },
    openDrawer() {
      this.$emit('close-all')
      this.getSiteTypeList()
      this.drawerData.drawerVisible = true
    },
    closeDrawer() {
      this.reset()
    },
    formEvent(type) {
      if (type == 'search' || type == 'clearFactor') {
        this.pageData.page = 1
        this.getSiteTypeList()
      }
      if (type == 'add') {
        this.dialogData.title = '新增站点类型'
        this.dialogData.form = {
          pid: 0,
          type_name: '',
          type_icon: '',
          icon_color: '',
          icon_size: 10,
        }
        this.dialogData.dialogVisible = true
      }
    },
    tableEvent(data) {
      let { row, itm } = data
      if (itm == '编辑') {
        this.dialogData.title = '编辑站点类型'
        this.dialogData.form = Object.assign({}, row)
        this.dialogData.dialogVisible = true
      }
      if (itm == '删除') {
        this.deleteSiteType({ type_id: row.type_id })
      }
    },
    pageEvent() {
      this.getSiteTypeList()
    },
    dialogEvent(data) {
      if (data.type_id) {
        this.editSiteType(data)
      } else {
        this.addSiteType(data)
      }
    },
    getSiteTypeList() {
      let params = {
        page: this.pageData.page,
        size: this.pageData.size,
        type_name: this.formData.bindData.type_name,
      }
      apiv2.SiteType.ListReq(params).then((res) => {
        if (res.data && res.data.list && res.data.list.length) {
          this.tableData.list = res.data.list
          this.pageData.total = res.data.total
        } else {
          this.tableData.list = []
          this.pageData.total = 0
        }
      })
    },
    addSiteType(data) {
      apiv2.SiteType.CreateReq(data).then((res) => {
        if (res.message) {
          this.$message.error('添加失败：' + res.message)
        } else {
          this.$message.success('添加成功')
          this.dialogData.dialogVisible = false
          this.getSiteTypeList()
          this.$emit('resetSiteList')
        }
      })
    },
    editSiteType(data) {
      apiv2.SiteType.UpdateReq(data).then((res) => {
        if (res.message) {
          this.$message.error('更新失败：' + res.message)
        } else {
          this.$message.success('更新成功')
          this.dialogData.dialogVisible = false
          this.getSiteTypeList()
          this.$emit('resetSiteList')
        }
      })
    },
    deleteSiteType(data) {
      apiv2.SiteType.DeleteReq(data).then((res) => {
        if (res.message) {
          this.$message.error('删除失败：' + res.message)
        } else {
          this.$message.success('删除成功')
          this.getSiteTypeList()
          this.$emit('resetSiteList')
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.sitetype-btn {
  width: 58px;
  height: 66px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .btn-icon {
    cursor: pointer;
    width: 46px;
    height: 46px;
    background-size: 100%;
    background-repeat: no-repeat;
    background-image: url('@/assets/site_type_btn.png');
  }

  .btn-name {
    font-size: 12px;
    line-height: 20px;
    font-weight: bold;
  }
}
</style>
