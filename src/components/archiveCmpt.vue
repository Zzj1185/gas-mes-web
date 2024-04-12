<template>
  <layout-cmpt>
    <template #title>
      <title-cmpt :title="archive_type"></title-cmpt>
      <preview-cmpt ref="preview" @to-download="downloadFile"></preview-cmpt>
    </template>
    <template #form>
      <form-cmpt v-if="formData" :formData="formData" @formEvent="formEvent"></form-cmpt>
    </template>

    <template #table>
      <table-cmpt v-if="tableData" :tableData="tableData" @tableEvent="tableEvent"></table-cmpt>
    </template>

    <template #page>
      <page-cmpt v-if="pageData" :pageData="pageData" @pageEvent="pageEvent"></page-cmpt>
    </template>
    <template #special>
      <dialog-cmpt v-if="dialogData" :dialogData="dialogData" @dialogEvent="dialogEvent">
        <template #formItem>
          <el-form-item :label="archive_type + '名称'" prop="archive_name">
            <el-input size="small" v-model="dialogData.form.archive_name"
              :placeholder="'请输入' + archive_type + '名称'"></el-input>
          </el-form-item>
          <el-form-item label="上传文件" prop="file_id">
            <el-upload ref="fileUpload" style="display: flex" action="#" :multiple="false" :auto-upload="false"
              :file-list="dialogData.fileList" :on-change="onSelectFile" :on-remove="onRemoveFile">
              <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item :label="archive_type + '描述'" prop="description">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容"
              v-model="dialogData.form.description"> </el-input>
          </el-form-item>
        </template>
      </dialog-cmpt>
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'

export default {
  name: 'Archive',
  props: ['archive_type', 'category_id'],
  data() {
    return {
      formData: {
        type: [
          {
            type: 'input',
            key: 'archive_name',
            clearable: 'true',
            label: '文档名称',
          },
        ],
        btn: [
          {
            key: 'search',
            label: '查询',
          },
          {
            key: 'add',
            label: '新增',
            type: 'primary',
          },
        ],
        bindData: {
          archive_name: '',
          upload_date: '',
          category_id: this.$props.category_id,
        },
      },
      tableData: {
        type: [
          {
            key: 'archive_name',
            label: '文档名称',
          },
          {
            key: 'description',
            label: '文档描述',
          },
          {
            key: 'file_name',
            label: '上传文件',
          },
          {
            key: 'do',
            label: '操作',
            width: '300px',
            doList: [
              { name: '预览', type: 'warning' },
              { name: '下载', type: 'primary' },
              { name: '修改', type: 'success' },
              { name: '删除', type: 'danger' },
            ],
          },
        ],
        list: [],
      },
      pageData: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
      dialogData: {
        dialogVisible: false,
        title: '新增文档',
        width: '30%',
        fileList: [],
        form: {
          archive_id: 0,
          category_id: this.$props.category_id,
          archive_name: '',
          description: '',
          file_id: '',
        },
        rules: {
          archive_name: [
            {
              required: true,
              message: '请输入' + this.$props.archive_type + '名称',
              trigger: 'submit',
            },
          ],
          file_id: [{ required: true, message: '请选择上传文件', trigger: 'submit' }],
        },
        labelWidth: '150px',
      },
      fileData: {
        file_name: '',
        file_path: '',
      },
    }
  },
  mounted() {
    this.resetPage()
  },
  watch: {
    'dialogData.dialogVisible'() {
      if (this.dialogData.dialogVisible === false) {
        this.dialogData.fileList = []
      }
    },
  },
  methods: {
    resetPage() {
      this.pageData.currentPage = 1
      this.getArchiveList()
    },
    pageEvent(e) {
      this.pageData.pageSize = e.pageSize
      this.pageData.currentPage = e.currentPage
      this.getArchiveList()
    },
    tableEvent(e) {
      if (e.itm == '预览') {
        this.$refs.preview.previewFile(e.row)
      }
      if (e.itm == '下载') {
        this.downloadFile(e.row)
      }
      if (e.itm == '修改') {
        this.dialogData.title = '修改' + this.$props.archive_type
        this.dialogData.form.archive_id = e.row.archive_id
        this.dialogData.form.archive_name = e.row.archive_name
        this.dialogData.form.description = e.row.description
        this.dialogData.form.file_id = e.row.file_id
        this.dialogData.fileList = [{ name: e.row.file_name, status: 'ready' }]
        this.dialogData.dialogVisible = true
      }
      if (e.itm == '删除') {
        let data = { archive_id: e.row.archive_id }
        apiv2.ArchiveMgmt.DeleteReq(data).then((res) => {
          if (res.code == 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.getArchiveList()
          }
        })
      }
    },
    formEvent(e) {
      if (e == 'changeDate') {
        this.resetPage()
      }
      if (e == 'clearFactor') {
        this.resetPage()
      }
      if (e == 'add') {

        this.dialogData.title = '新增' + this.$props.archive_type
        this.dialogData.dialogVisible = true
      }
      if (e == 'search') {
        this.resetPage()
      }
    },
    dialogEvent() {
      console.log(1, this.dialogData);

      if (this.dialogData.fileList[0].raw) {
        this.uploadFile()
      } else {
        this.submitArchive()
      }
    },
    getArchiveList() {
      let data = {
        page: this.pageData.currentPage,
        size: this.pageData.pageSize,
        archive_name: this.formData.bindData.archive_name,
        category_id: this.$props.category_id,
      }
      apiv2.ArchiveMgmt.ListReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.error)
        } else {
          this.pageData.total = res.data.total
          this.tableData.list = res.data.list
        }
      })
    },
    onSelectFile(file) {

      this.dialogData.fileList = [file]
      this.dialogData.form.file_id = file.raw.uid
    },
    onRemoveFile() {
      this.dialogData.fileList = []
    },
    // 上传
    uploadFile() {

      const file = this.dialogData.fileList[0].raw
      const formData = new FormData()
      formData.append('file', file)
      apiv2.CommonData.FileUploadReq(formData).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.dialogData.form.file_id = res.data.file_id
          this.submitArchive()
        }
      })
      console.log(this.dialogData);

    },
    // 下载
    downloadFile(e) {
      let fileUrl = e.file_path

      let link = document.createElement('a')
      link.href = fileUrl
      link.download = e.file_name
      link.style.display = 'none'

      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
    },
    submitArchive() {

      const data = this.dialogData.form
      if (this.dialogData.title == '修改' + this.$props.archive_type) {
        apiv2.ArchiveMgmt.UpdateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.error)
          } else {
            this.dialogData.dialogVisible = false
            this.$message.success('修改成功')
            this.resetPage()
          }
        })
      }
      if (this.dialogData.title == '新增' + this.$props.archive_type) {
        apiv2.ArchiveMgmt.CreateReq(data).then((res) => {
          if (res.code) {
            this.$message.error(res.error)
          } else {
            this.dialogData.dialogVisible = false
            this.$message.success('新增成功')
            this.resetPage()
          }
        })
      }
    },
  },
}
</script>
