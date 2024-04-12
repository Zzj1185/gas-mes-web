<template>
  <el-dialog destroy-on-close :fullscreen="isFullscreen" :show-close="false" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="previewData.dialogVisible" @close="closeDialog" custom-class="preview-container">
    <div slot="title">
      {{ previewData.title }}
      <div class="el-dialog__headerbtn" @click="isFullscreen = !isFullscreen" :title="isFullscreen ? '窗口化' : '最大化'">
        <i class="el-icon-copy-document" v-if="isFullscreen"></i>
        <i class="el-icon-full-screen" v-else></i>
      </div>
    </div>
    <file-preview v-show="previewData.file_url" :url="previewData.file_url" />
    <div slot="footer">
      <el-button type="primary" @click="previewData.dialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { host } from '@/utils/request'
export default {
  name: 'Preview',
  data() {
    return {
      isFullscreen: false,
      previewData: {
        dialogVisible: false,
        title: '',
        file_url: '',
      },
    }
  },
  methods: {
    previewFile(file) {
      let split = file.file_name.split('.')
      let suffix = split.pop()
      let types = 'jpeg,bmp,jpg,png,tif,gif,svg,wmf,webp,'
      types += 'txt,xlsx,docx,pdf'
      if (types.split(',').includes(suffix)) {
        if (file.file_size <= 1024 * 1024) {
          this.openDialog(file)
        } else {
          this.$confirm('文件过大，建议下载后使用本地工具查看', {
            closeOnClickModal: false,
            distinguishCancelAndClose: true,
            cancelButtonText: '依旧预览',
            confirmButtonText: '下载查看',
          })
            .then(() => {
              this.$emit('to-download', file)
            })
            .catch((res) => {
              if (res == 'cancel') {
                this.openDialog(file)
              }
            })
        }
      } else {
        this.$message.warning('不支持的格式，请下载后使用本地工具查看')
      }
    },
    openDialog(file) {
      this.previewData.title = file.file_name
      this.previewData.file_url = file.file_path

      this.previewData.dialogVisible = true
    },
    closeDialog() {
      this.$nextTick(() => {
        this.isFullscreen = false
        this.previewData.title = ''
        this.previewData.file_url = ''
      })
    },
  },
}
</script>

<style lang="less" scoped>
:deep(.preview-container) {
  height: 70%;
  display: flex;
  flex-direction: column;

  &.is-fullscreen {
    height: 100%;
  }

  .el-dialog__body {
    height: 100%;
    overflow: hidden;

    .file-preview {
      > .wrap {
        display: flex;
        justify-content: center;
        align-items: center;

        > * {
          overflow: auto;
        }

        > div {
          width: 100%;
          height: 100%;
        }

        > image {
          max-width: 100%;
          max-height: 100%;
        }

        .x-spreadsheet {
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;

          .x-spreadsheet-sheet {
            max-width: 100%;
            max-height: 100%;

            .x-spreadsheet-scrollbar.vertical {
              height: 100% !important;
            }

            .x-spreadsheet-scrollbar.horizontal {
              width: 100% !important;
            }
          }
        }
      }
    }
  }
}
</style>
