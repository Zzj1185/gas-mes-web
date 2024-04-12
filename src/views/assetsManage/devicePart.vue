<template>
  <layout-cmpt>
    <template #title>
      <title-cmpt title="备件管理"></title-cmpt>
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
      <form-dialog :dialogData="dialogClaimData" @dialogEvent="dialogClaimEvent"></form-dialog>
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
export default {
  name: 'part',
  data() {
    return {
      typeOptions: [],
      formData: {
        type: [
          {
            key: 'type_id',
            label: '备件类型',
            type: 'select',
            options: [],
          },
          {
            type: 'select',
            key: 'not_much',
            label: '是否告罄',
            options: [
              {
                value: true,
                label: '是',
              },
              {
                value: false,
                label: '否',
              },
            ],
          },
          {
            type: 'input',
            key: 'part_name',
            label: '备件名称',
            clearable: 'true',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
            permissionApi: apiv2.PartMgmt.ListRoute,
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
            permissionApi: apiv2.PartMgmt.CreateRoute,
          },
        ],
        bindData: {
          type_id: '',
          part_name: '',
          not_much: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'part_name',
            label: '备件名称',
          },
          {
            key: 'type_name',
            label: '类型名称',
          },
          {
            key: 'stock',
            label: '库存数量',
          },
          {
            key: 'not_much',
            label: '是否告罄',
          },
          {
            key: 'do',
            label: '操作',
            doList: [
              { name: '领取', type: 'success', permissionApi: apiv2.PartMgmt.ClaimRoute },
              { name: '编辑', type: 'warning', permissionApi: apiv2.PartMgmt.UpdateRoute },
              { name: '删除', type: 'danger', permissionApi: apiv2.PartMgmt.DeleteRoute },
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
          type_id: '',
          part_name: '',
          stock: 0,
          min_stock: 0,
        },
        formList: [
          [
            {
              label: '备件类型',
              binding: 'type_id',
              cmpt: 'select',
              options: [],
            },
            {
              label: '备件名称',
              binding: 'part_name',
              cmpt: 'input',
            },
          ],
          [
            {
              label: '库存量',
              binding: 'stock',
              cmpt: 'number',
            },
            {
              label: '最低库存量',
              binding: 'min_stock',
              cmpt: 'number',
              min: 1,
            },
          ],
        ],
        // 规则验证
        rules: {
          type_id: [{ required: true, message: '请选择备件类型', trigger: 'submit' }],
          part_name: [{ required: true, message: '请输入备件名称', trigger: 'submit' }],
          stock: [{ required: true, message: '请输入库存量', trigger: 'submit' }],
          min_stock: [{ required: true, message: '请输入最低库存量', trigger: 'submit' }],
        },
        labelWidth: '100px',
      },
      dialogClaimData: {
        dialogVisible: false,
        title: '新增文档',
        width: '30%',
        // 绑定表单
        form: {
          part_id: 0,
          quantity: 0,
        },
        formList: [
          [
            {
              label: '领取数量',
              binding: 'quantity',
              cmpt: 'number',
              min: 1,
              single: true,
            },
          ],
        ],
        // 规则验证
        rules: {
          quantity: [{ required: true, message: '请输入领取数量', trigger: 'submit' }],
        },
        labelWidth: '100px',
      },
    }
  },
  mounted() {
    if (this.$auth(apiv2.PartType.SelectRoute)) {
      this.getPartTypeList()
    }
    this.getPartList()
  },
  methods: {
    getPartTypeList() {
      apiv2.PartType.SelectReq().then((res) => {
        if (res.code == 0) {
          this.typeOptions = res.data.list.map((item) => ({ value: item.type_id, label: item.type_name }))
          let typeForm = this.formData.type.find((o) => o.key == 'type_id')
          if (typeForm) {
            typeForm.options = this.typeOptions
          }
          this.dialogData.formList.forEach((list) => {
            let typeDialog = list.find((o) => o.binding == 'type_id')
            if (typeDialog) {
              typeDialog.options = this.typeOptions
            }
          })
        }
      })
    },
    // 上面表单的事件 添加 查询
    formEvent(e) {
      if (e == 'add') {
        this.dialogData.dialogVisible = true
        this.dialogData.title = '添加备件'
      } else if (e == 'changeSelect' || e == 'clearFactor' || e == 'search') {
        this.pageData.page = 1
        this.getPartList()
      }
    },
    // 翻页事件
    pageEvent(e) {
      this.pageData.page = e.page
      this.pageData.size = e.size
      this.getPartList()
    },
    // 表格事件  改状态 改密码 编辑 删除
    tableEvent(e) {
      if (e.itm == '编辑') {
        this.dialogData.form = Object.assign({}, e.row)
        this.dialogData.title = '修改备件'
        this.dialogData.dialogVisible = true
      }
      if (e.itm == '领取') {
        this.dialogClaimData.form.part_id = e.row.part_id
        this.dialogClaimData.form.quantity = 1
        this.dialogClaimData.title = '领取备件'
        this.dialogClaimData.dialogVisible = true
      }
      if (e.itm == '删除') {
        apiv2.PartMgmt.DeleteReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('删除备件成功')
            this.pageData.page = 1
            this.getPartList()
          }
        })
      }
    },
    // 获取列表数据
    getPartList() {
      let data = Object.assign({}, this.formData.bindData, this.pageData)
      apiv2.PartMgmt.ListReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((item) => {
            item.not_much = item.not_much ? '是' : '否'
            return item
          })
          this.pageData.total = res.data.total
        }
      })
    },
    // 弹出框表单事件 添加 修改备件
    dialogEvent(data) {
      if (this.dialogData.title == '添加备件') {
        apiv2.PartMgmt.CreateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('添加备件成功')
            this.dialogData.dialogVisible = false
            this.pageData.page = 1
            this.getPartList()
          }
        })
      }
      if (this.dialogData.title == '修改备件') {
        apiv2.PartMgmt.UpdateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('修改备件成功')
            this.dialogData.dialogVisible = false
            this.getPartList()
          }
        })
      }
    },
    dialogClaimEvent(data) {
      if (this.dialogClaimData.title == '领取备件') {
        apiv2.PartMgmt.ClaimReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.message)
          } else {
            this.$message.success('领取备件成功')
            this.dialogClaimData.dialogVisible = false
            this.getPartList()
          }
        })
      }
    },
  },
}
</script>
