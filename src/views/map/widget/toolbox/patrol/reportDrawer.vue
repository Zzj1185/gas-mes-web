<template>
  <el-drawer destroy-on-close direction="btt" size="80%" :modal="false" :title="drawerData.title" :visible.sync="drawerData.drawerVisible" :modal-append-to-body="false">
    <div class="drawer-content">
      <form-cmpt :formData="formData">
        <template #special>
          <el-form inline>
            <el-form-item label="巡检周期">
              <el-date-picker size="mini" value-format="yyyy-MM-dd" v-model="selectDate" :format="dateType == 'week' ? '第 WW 周' : ''" :picker-options="{ firstDayOfWeek: 1 }" :editable="false" :clearable="false" :append-to-body="false" :type="dateType" @change="changeDate" />
            </el-form-item>
          </el-form>
        </template>
      </form-cmpt>
      <table-cmpt :tableData="tableData" @tableEvent="tableEvent"></table-cmpt>
      <page-cmpt :pageData="pageData" @pageEvent="pageEvent"></page-cmpt>
      <el-image v-if="imageList.length" ref="image" style="display: none" :src="imageList[0]" :preview-src-list="imageList" @load="showImages"></el-image>
    </div>
    <TrackPlayer ref="player" :map="map" @change="openPlayer" />
  </el-drawer>
</template>
<script>
import apiv2 from '@/api/v2'
import TrackPlayer from './trackPlayer.vue'
export default {
  data() {
    return {
      dateType: 'date',
      selectDate: '',
      imageList: [],
      trackList: [],
      playerData: [],
      drawerData: {
        title: '任务汇报',
        drawerVisible: false,
      },
      formData: {
        special: true,
        bindData: {
          task_id: 0,
          start_date: '',
          end_date: '',
        },
      },
      tableData: {
        type: [
          {
            key: 'site_name',
            label: '站点名称',
          },
          {
            key: 'report_user',
            label: '汇报人员',
          },
          {
            width: 100,
            key: 'report_time',
            label: '汇报时间',
          },
          {
            width: 70,
            key: 'report_state',
            label: '状态',
            cmpt: 'tag',
            types: {
              故障: 'info',
              正常: 'success',
            },
          },
          {
            key: 'note',
            label: '备注',
          },
          {
            key: 'do',
            width: 100,
            label: '汇报拍照',
            doList: [[{ name: '查看图片', type: 'success', check: 'file_count' }]],
          },
          {
            key: 'do',
            width: 100,
            label: '巡检轨迹',
            doList: [[{ name: '查看轨迹', type: 'info', permissionApi: apiv2.PatrolReport.TrackRoute }]],
          },
        ],
        list: [],
      },
      pageData: { page: 1, size: 20, total: 0 },
    }
  },
  props: {
    map: Object,
  },
  components: { TrackPlayer },
  methods: {
    open(task_id, cycle_unit) {
      this.dateType = cycle_unit == 'day' ? 'date' : cycle_unit
      this.selectDate = this.$moment().format('YYYY-MM-DD')
      this.formData.bindData.task_id = task_id
      this.drawerData.drawerVisible = true
      this.changeDate()
    },
    close() {
      this.drawerData.drawerVisible = false
    },
    changeDate() {
      let end_date, start_date
      end_date = start_date = this.selectDate
      if (this.dateType == 'week') {
        start_date = this.$moment(start_date).day(1).format('YYYY-MM-DD')
        end_date = this.$moment(start_date).add(1, 'w').add(-1, 'd').format('YYYY-MM-DD')
      }
      if (this.dateType == 'month') {
        start_date = this.$moment(start_date).format('YYYY-MM-01')
        end_date = this.$moment(start_date).add(1, 'M').add(-1, 'd').format('YYYY-MM-DD')
      }
      if (this.dateType == 'year') {
        start_date = this.$moment(start_date).format('YYYY-01-01')
        end_date = this.$moment(start_date).add(1, 'y').add(-1, 'd').format('YYYY-MM-DD')
      }

      this.formData.bindData.start_date = start_date
      this.formData.bindData.end_date = end_date
      this.getReportList()
    },
    getReportList() {
      this.imageList = []
      let params = Object.assign({}, this.pageData, this.formData.bindData)
      apiv2.PatrolReport.ViewReq(params).then((res) => {
        if (res && res.data && res.data.list) {
          this.tableData.list = res.data.list.map((o, idx) => {
            o.idx = idx + 1
            o.report_state = o.is_fault ? '故障' : '正常'
            return o
          })
          this.pageData.total = res.data.total
        }
      })
    },
    getTrackList(task_id, track_user_id, start_time, end_time) {
      const size = 500
      let data = { task_id, track_user_id, start_time, end_time, size }
      apiv2.PatrolReport.TrackReq(data).then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          const list = res.data.list.map((o) => {
            o.position = [o.longitude, o.latitude]
            return o
          })
          this.trackList.push(...list)
          if (list.length == size) {
            const lastData = this.trackList.pop()
            start_time = lastData.track_time
            this.getTrackList(task_id, track_user_id, start_time, end_time)
          } else {
            this.analysisTrackRecord()
          }
        }
      })
    },
    analysisTrackRecord() {
      let trackArray = []
      for (let i = 0; i < this.trackList.length; i++) {
        const current = this.trackList[i]
        if (trackArray.length) {
          let recentArray = trackArray[trackArray.length - 1]
          if (recentArray.length) {
            const recent = recentArray[recentArray.length - 1]
            const diff = this.$moment(current.track_time).diff(this.$moment(recent.track_time))
            if (diff > 10000) {
              trackArray.push([current])
            } else {
              recentArray.push(current)
            }
          } else {
            recentArray.push(current)
          }
        } else {
          trackArray.push([current])
        }
      }
      this.playerData = trackArray
      this.openPlayer(this.playerData.length)
    },
    openPlayer(page) {
      this.$refs.player.openPlayer(this.playerData[page - 1], page, this.playerData.length)
    },
    tableEvent(e) {
      if (e.itm == '查看图片') {
        this.imageList = []
        this.$nextTick(() => {
          this.loadImages(e.row.file_list)
        })
      }
      if (e.itm == '查看轨迹') {
        this.trackList = []
        const track_user_id = e.row.report_user_id
        const task_id = this.formData.bindData.task_id
        const start_time = this.$moment(this.formData.bindData.start_date).format('YYYY-MM-DD 00:00:00')
        const end_time = this.$moment(this.formData.bindData.end_date).format('YYYY-MM-DD 23:59:59')
        this.getTrackList(task_id, track_user_id, start_time, end_time)
      }
    },
    pageEvent() {
      this.getReportList()
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
<style lang="less" scoped>
.el-drawer__wrapper {
  left: auto;
  width: 736px;

  .drawer-content {
    gap: 20px;
    height: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
