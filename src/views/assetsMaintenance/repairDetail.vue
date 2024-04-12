<template>
  <layout-cmpt :formFlag="false" :titleFlag="false" :tableFlag="false" :pageFlag="false">
    <template #special>
      <table-cmpt :tableData="tableData" @tableEvent="tableEvent"></table-cmpt>
      <el-image v-if="imageList.length" ref="image" style="display: none" :src="imageList[0]" :preview-src-list="imageList" @load="showImages"></el-image>
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
export default {
  props: {
    ticketId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      imageList: [],
      tableData: {
        type: [
          {
            key: 'record_user',
            label: '记录人员',
          },
          {
            key: 'record_time',
            label: '记录时间',
          },
          {
            key: 'record_detail',
            label: '记录详情',
          },
          {
            key: 'do',
            label: '操作',
            width: '300px',
            doList: [{ name: '查看图片', type: 'success', check: 'has_file' }],
          },
        ],
        list: [],
      },
    }
  },
  mounted() {
    this.getDetailList()
  },
  methods: {
    getDetailList() {
      apiv2.RepairDetail.ViewReq({ ticket_id: this.$props.ticketId }).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((item) => {
            item.has_file = item.file_list.length > 0
            return item
          })
        }
      })
    },
    tableEvent(e) {
      if (e.itm == '查看图片') {
        this.imageList = []
        this.$nextTick(() => {
          this.loadImages(e.row.file_list)
        })
      }
    },
    loadImages(file_list) {
      this.imageList = file_list
    },
    showImages() {
      this.$refs.image.$el.firstChild.click()
    },
  },
}
</script>
