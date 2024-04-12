<template>
  <div>
    <div class="pipeline-btn">
      <div class="btn-icon" @click="clickBtn"></div>
      <div class="btn-name">管线管理</div>
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
        title: '管线管理',
      },
      formData: {
        type: [
          {
            type: 'input',
            key: 'line_name',
            label: '管线名称',
            clearable: 'true',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.PipeLine.ListRoute,
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: apiv2.PipeLine.CreateRoute,
          },
        ],
        bindData: {
          line_name: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'line_name',
            label: '管线名称',
          },
          {
            key: 'line_color',
            label: '管线颜色',
          },
          {
            key: 'line_width',
            label: '管线宽度',
          },
          {
            key: 'do',
            label: '操作',
            doList: [
              { name: '编辑', type: 'warning', permissionApi: apiv2.PipeLine.UpdateRoute },
              { name: '删除', type: 'danger', permissionApi: apiv2.PipeLine.DeleteRoute },
            ],
          },
        ],
        list: [],
      },
      pageData: { page: 1, size: 20, total: 0 },
      dialogData: {
        dialogVisible: false,
        title: '新增管线',
        width: '50%',
        // 绑定表单
        form: {
          line_name: '',
          line_color: '',
          line_width: 1,
          line_nodes: '',
        },
        // 循环表单
        formList: [
          [
            {
              label: '管线名称',
              binding: 'line_name',
              cmpt: 'input',
              single: true,
            },
          ],
          [
            {
              label: '管线颜色',
              binding: 'line_color',
              cmpt: 'color',
            },
            {
              label: '管线宽度',
              binding: 'line_width',
              cmpt: 'number',
              min: 1,
            },
          ],
          [
            {
              label: '管线节点',
              binding: 'line_nodes',
              cmpt: 'inputTextarea',
              single: true,
            },
          ],
        ],
        // 规则验证
        rules: {
          line_name: [{ required: true, message: '请输入管线名称', trigger: 'submit' }],
          line_color: [{ required: true, message: '请选择管线颜色', trigger: 'submit' }],
          line_width: [{ required: true, message: '请输入管线宽度', trigger: 'submit' }],
          line_nodes: [{ required: true, message: '请输入管线节点', trigger: 'submit' }],
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
      this.formData.bindData.line_name = ''
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
      this.getPipeLineList()
      this.drawerData.drawerVisible = true
    },
    closeDrawer() {
      this.reset()
    },
    formEvent(type) {
      if (type == 'search' || type == 'clearFactor') {
        this.pageData.page = 1
        this.getPipeLineList()
      }
      if (type == 'add') {
        this.dialogData.title = '新增管线'
        this.dialogData.form = {
          line_name: '',
          line_color: '',
          line_width: 1,
          line_nodes: '',
        }
        this.dialogData.dialogVisible = true
      }
    },
    tableEvent(data) {
      let { row, itm } = data
      if (itm == '编辑') {
        this.dialogData.title = '编辑管线'
        this.dialogData.form = Object.assign({}, row)
        this.dialogData.dialogVisible = true
      }
      if (itm == '删除') {
        this.deletePipeLine({ line_id: row.line_id })
      }
    },
    pageEvent() {
      this.getPipeLineList()
    },
    dialogEvent(data) {
      if (data.line_id) {
        this.editPipeLine(data)
      } else {
        this.addPipeLine(data)
      }
    },
    getPipeLineList() {
      let params = {
        page: this.pageData.page,
        size: this.pageData.size,
        line_name: this.formData.bindData.line_name,
      }
      apiv2.PipeLine.ListReq(params).then((res) => {
        if (res.data && res.data.list && res.data.list.length) {
          this.tableData.list = res.data.list
          this.pageData.total = res.data.total
        } else {
          this.tableData.list = []
          this.pageData.total = 0
        }
      })
    },
    addPipeLine(data) {
      apiv2.PipeLine.CreateReq(data).then((res) => {
        if (res.message) {
          this.$message.error('添加失败：' + res.message)
        } else {
          this.$message.success('添加成功')
          this.dialogData.dialogVisible = false
          this.getPipeLineList()
          this.$emit('resetPipeLine')
        }
      })
    },
    editPipeLine(data) {
      apiv2.PipeLine.UpdateReq(data).then((res) => {
        if (res.message) {
          this.$message.error('更新失败：' + res.message)
        } else {
          this.$message.success('更新成功')
          this.dialogData.dialogVisible = false
          this.getPipeLineList()
          this.$emit('resetPipeLine')
        }
      })
    },
    deletePipeLine(data) {
      apiv2.PipeLine.DeleteReq(data).then((res) => {
        if (res.message) {
          this.$message.error('删除失败：' + res.message)
        } else {
          this.$message.success('删除成功')
          this.getPipeLineList()
          this.$emit('resetPipeLine')
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.pipeline-btn {
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
    background-image: url('@/assets/pipeline_btn.png');
  }

  .btn-name {
    font-size: 12px;
    line-height: 20px;
    font-weight: bold;
  }
}
</style>
