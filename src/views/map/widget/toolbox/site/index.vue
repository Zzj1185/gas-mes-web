<template>
  <div>
    <div class="site-btn">
      <div class="btn-icon" @click="clickBtn"></div>
      <div class="btn-name">站点管理</div>
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
        <form-dialog :dialogData="dialogData" @dialogEvent="dialogEvent" @getLocation="getLocation"></form-dialog>
      </template>
    </drawer-cmpt>
  </div>
</template>

<script>
import apiv2 from '@/api/v2'
export default {
  data() {
    // 经纬度验证
    const validateCoordinates = function (_, value, callback) {
      value = value.replace(/\s/g, '')
      const pattern = /^-?((1[0-7][0-9]|[1-9]?[0-9])\.{1}\d{1,6}|180\.{1}0{1,6}),-?([1-8]?[0-9]\.{1}\d{1,6}|90\.{1}0{1,6})$/
      if (pattern.test(value)) {
        callback()
      } else {
        callback(new Error('请输入有效的经纬坐标'))
      }
    }
    return {
      drawerData: {
        drawerVisible: false,
        title: '站点管理',
      },
      formData: {
        type: [
          {
            type: 'input',
            key: 'site_name',
            label: '站点名称',
            clearable: 'true',
            labelWidth: '150px',
          },
          {
            type: 'select',
            key: 'type_id',
            label: '站点类型',
            clearable: 'true',
            labelWidth: '150px',
            options: [],
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.SiteMgmt.ListRoute,
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: apiv2.SiteMgmt.CreateRoute,
          },
        ],
        bindData: {
          site_name: '',
          type_id: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'site_name',
            label: '站点名称',
          },
          {
            key: 'type_name',
            label: '站点类型',
          },
          {
            key: 'coordinate',
            label: '经纬度',
          },
          {
            key: 'do',
            label: '操作',
            doList: [
              { name: '编辑', type: 'warning', permissionApi: apiv2.SiteMgmt.UpdateRoute },
              { name: '删除', type: 'danger', permissionApi: apiv2.SiteMgmt.DeleteRoute },
            ],
          },
        ],
        list: [],
      },
      pageData: { page: 1, size: 20, total: 0 },
      dialogData: {
        dialogVisible: false,
        title: '新增站点',
        // 绑定表单
        form: {
          site_name: '',
          type_id: '',
          coordinate: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '站点名称',
              binding: 'site_name',
              cmpt: 'input',
            },
            {
              label: '站点类型',
              binding: 'type_id',
              cmpt: 'select',
              options: [],
            },
          ],
          [
            {
              label: '站点经纬度',
              binding: 'coordinate',
              cmpt: 'inputCoordinate',
              single: true,
            },
          ],
        ],
        // 规则验证
        rules: {
          site_name: [{ required: true, message: '请输入站点名称', trigger: 'submit' }],
          type_id: [{ required: true, message: '请选择站点类型', trigger: 'submit' }],
          coordinate: [
            { required: true, message: '请输入站点经纬度', trigger: 'submit' },
            { validator: validateCoordinates, trigger: 'blur' },
          ],
        },
        labelWidth: '100px',
      },
      siteTypeList: [],
    }
  },
  methods: {
    reset() {
      this.drawerData.drawerVisible = false
      this.pageData.page = 1
      this.pageData.size = 20
      this.pageData.total = 0
      this.formData.bindData.site_name = ''
      this.formData.bindData.type_id = ''
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
      if (this.$auth(apiv2.SiteType.SelectRoute)) {
        this.getSiteTypeList()
      }
      this.getSiteList()
      this.drawerData.drawerVisible = true
    },
    closeDrawer() {
      this.reset()
    },
    formEvent(type) {
      if (type == 'search' || type == 'clearFactor') {
        this.pageData.page = 1
        this.getSiteList()
      }
      if (type == 'add') {
        this.dialogData.title = '新增站点'
        this.dialogData.form = {
          site_name: '',
          type_id: '',
          coordinate: '',
        }
        this.dialogData.dialogVisible = true
      }
    },
    tableEvent(data) {
      let { row, itm } = data
      if (itm == '编辑') {
        this.dialogData.title = '编辑站点'
        this.dialogData.form = Object.assign({}, row)
        this.dialogData.dialogVisible = true
      }
      if (itm == '删除') {
        this.deleteSite({ site_id: row.site_id })
      }
    },
    pageEvent() {
      this.getSiteList()
    },
    dialogEvent(obj) {
      let data = Object.assign({}, obj)
      delete data.coordinate

      let [longitude, latitude] = obj.coordinate.split(',')
      data.longitude = longitude
      data.latitude = latitude

      if (data.site_id) {
        this.editSite(data)
      } else {
        this.addSite(data)
      }
    },
    getLocation() {
      this.$emit('getLocation')
    },
    getSiteTypeList() {
      apiv2.SiteType.SelectReq().then((res) => {
        if (res.data && res.data.list && res.data.list.length) {
          this.siteTypeList = res.data.list
          let options = this.siteTypeList.map((o) => ({ label: o.type_name, value: o.type_id }))
          let siteTypeForm = this.formData.type.find((o) => o.key == 'type_id')
          if (siteTypeForm) {
            siteTypeForm.options = options
          }
          this.dialogData.formList.forEach((formList) => {
            let siteTypeDialog = formList.find((o) => o.binding == 'type_id')
            if (siteTypeDialog) {
              siteTypeDialog.options = options
            }
          })
        }
      })
    },
    getSiteList() {
      let params = {
        page: this.pageData.page,
        size: this.pageData.size,
        site_name: this.formData.bindData.site_name,
        type_id: this.formData.bindData.type_id,
      }
      apiv2.SiteMgmt.ListReq(params).then((res) => {
        if (res.data && res.data.list && res.data.list.length) {
          this.tableData.list = res.data.list.map((o) => {
            o.coordinate = o.longitude + ',' + o.latitude
            delete o.longitude
            delete o.latitude
            return o
          })
          this.pageData.total = res.data.total
        } else {
          this.tableData.list = []
          this.pageData.total = 0
        }
      })
    },
    addSite(data) {
      apiv2.SiteMgmt.CreateReq(data).then((res) => {
        if (res.message) {
          this.$message.error('添加失败：' + res.message)
        } else {
          this.$message.success('添加成功')
          this.dialogData.dialogVisible = false
          this.getSiteList()
          this.$emit('resetSiteList')
        }
      })
    },
    editSite(data) {
      apiv2.SiteMgmt.UpdateReq(data).then((res) => {
        if (res.message) {
          this.$message.error('更新失败：' + res.message)
        } else {
          this.$message.success('更新成功')
          this.dialogData.dialogVisible = false
          this.getSiteList()
          this.$emit('resetSiteList')
        }
      })
    },
    deleteSite(data) {
      apiv2.SiteMgmt.DeleteReq(data).then((res) => {
        if (res.message) {
          this.$message.error('删除失败：' + res.message)
        } else {
          this.$message.success('删除成功')
          this.getSiteList()
          this.$emit('resetSiteList')
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.site-btn {
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
    background-image: url('@/assets/site_btn.png');
  }

  .btn-name {
    font-size: 12px;
    line-height: 20px;
    font-weight: bold;
  }
}
</style>
