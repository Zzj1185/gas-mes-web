<template>
  <div>
    <el-button type="primary" v-if="checkAuth()" size="mini" class="videoManage" @click="clickBtn">视频管理</el-button>
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
  name: 'CameraMng',
  data() {
    return {
      drawerData: {
        drawerVisible: false,
        title: '视频管理',
      },
      formData: {
        type: [
          {
            type: 'input',
            key: 'title',
            label: '视频名称',
            clearable: 'true',
            size: 'mini',
            width: '100px',
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
          site_id: 0,
          title: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'title',
            label: '视频名称',
          },
          {
            key: 'sort',
            label: '排序',
          },
          {
            key: 'do',
            label: '操作',
            doList: [
              { name: '编辑', type: 'warning', size: 'mini' },
              { name: '删除', type: 'danger', size: 'mini' },
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
          title: '',
          sort: 0,
          channel: '',
          camera_id: 0,
        },
        // 循环表单
        formList: [
          [
            {
              label: '视频名称',
              binding: 'title',
              cmpt: 'input',
            },
            {
              label: '排序',
              binding: 'sort',
              cmpt: 'number',
            },
          ],
          [
            {
              label: '视频通道',
              binding: 'channel',
              cmpt: 'inputTextarea',
              single: true,
            },
          ],
        ],
        // 规则验证
        rules: {
          title: [{ required: true, message: '请输入视频名称', trigger: 'submit' }],

          channel: [{ required: true, message: '请输入视频通道', trigger: 'submit' }],
        },
        labelWidth: '100px',
      },
    }
  },
  methods: {
    // 校验权限
    checkAuth() {
      return this.$auth(apiv2.MonitorMgmt.ListRoute)
    },
    clickBtn() {
      this.pageData.page = 1
      this.pageData.size = 20
      this.pageData.total = 0
      this.formData.bindData.title = ''
      this.tableData.list = []
      this.getCameraList()
      this.drawerData.drawerVisible = true
    },
    // 上面表单的事件 添加 查询
    formEvent(e) {
      if (e == 'add') {
        this.dialogData.dialogVisible = true
        this.dialogData.title = '添加视频'
      }
      if (e == 'changeSelect' || e == 'clearFactor' || e == 'search') {
        this.pageData.page = 1
        this.getCameraList()
      }
    },
    // 翻页事件
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getCameraList()
    },
    // 表格事件  改状态 改密码 编辑 删除
    tableEvent(e) {
      if (e.itm == '编辑') {
        this.dialogData.form = Object.assign({}, e.row)
        this.dialogData.title = '修改视频'
        this.dialogData.dialogVisible = true
      }
      if (e.itm == '删除') {
        apiv2.MonitorMgmt.DeleteReq({ camera_id: e.row.camera_id }).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('删除监控视频成功')
            this.pageData.page = 1
            this.getCameraList()
            this.$emit('update')
          }
        })
      }
    },
    // 获取列表数据
    getCameraList() {
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.MonitorMgmt.ListReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list
          this.pageData.total = res.data.total
        }
      })
    },
    // 弹出框表单事件 添加 修改站点视频
    dialogEvent(data) {
      if (this.dialogData.title == '添加视频') {
        apiv2.MonitorMgmt.CreateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('添加监控视频成功')
            this.dialogData.dialogVisible = false
            this.pageData.page = 1
            this.getCameraList()
            this.$emit('update')
          }
        })
      }
      if (this.dialogData.title == '修改视频') {
        apiv2.MonitorMgmt.UpdateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('修改监控视频成功')
            this.dialogData.dialogVisible = false
            this.getCameraList()
            this.$emit('update')
          }
        })
      }
    },
  },
}
</script>
<style scoped lang="less">
.cameraContainer {
  position: fixed;
  left: 0;
  top: 0;
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
