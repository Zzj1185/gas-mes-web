<template>
  <layout-cmpt :tableFlag="false">
    <template #title>
      <title-cmpt title="视频监控"></title-cmpt>
    </template>
    <template #manageBtn>
      <cameraManage @update="getCameraList"></cameraManage>
    </template>
    <template #special>
      <div class="videoBox">
        <div class="content">
          <div class="operate">
            <!-- 通道转换按钮 -->
            <el-row type="flex" justify="space-around" style="margin-bottom: 10px">
              <el-col :span="6" v-for="(item, index) in channelList" :key="index">
                <div class="cameraBtn" :class="channelIdx == index ? 'activeCameraBtn' : ''" @click="changeChannel(index)">{{ item }}</div>
              </el-col>
            </el-row>
            <!-- 列表 -->
            <div class="tableHead">
              <div>视频名称</div>
              <div>操作</div>
            </div>
            <template v-for="(itm, index) in tableData.list">
              <div class="tableRow" :key="index">
                <div>{{ itm.name }}</div>
                <div class="tableRowBtnBox">
                  <div class="tableRowBtn" :class="itm.state && 'tableRowBtnActive'" @click="handleDoVideo(itm, index)">
                    {{ itm.state ? '断开' : '连接' }}
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div :class="'videoContainer channel' + channelIdx" id="videoContainer">
            <template v-for="(video, index) in videoList">
              <div class="singleVideo" :key="index" v-show="index < channelNums[channelIdx]">
                <div class="title">{{ video.name }}</div>
                <div class="toggleFullscreen" @click="toggleFullscreen($event)" :title="rightBtnText">
                  <i :class="rightBtnIcon"></i>
                </div>
                <template v-if="video.source && video.state">
                  <iframe v-if="video.html" class="player" :src="video.source"></iframe>
                  <video-cmpt v-else class="player" ref="videojs" :options="video.options" @play="clickVideo(index, true)" @pause="clickVideo(index, false)" />
                </template>
                <template v-else>
                  <img class="player" src="@/assets/video_no_signal.jpg" />
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </layout-cmpt>
</template>

<script>
import apiv2 from '@/api/v2'
import videoCmpt from '@/components/videoCmpt.vue'
import cameraManage from './cameraManageCmpt.vue'
export default {
  components: { videoCmpt, cameraManage },
  name: 'Video',
  data() {
    return {
      tableData: {
        type: [
          { key: 'name', label: '视频名称' },
          { key: 'doVideo', label: '操作' },
        ],
        list: [],
      },
      videoList: [],
      channelList: ['4通道', '9通道', '16通道'],
      channelNums: [4, 9, 16],
      channelIdx: 1,
      isFullscreen: false,
    }
  },
  mounted() {
    this.getCameraList()
  },
  computed: {
    rightBtnText() {
      return this.isFullscreen ? '切换窗口化' : '切换最大化'
    },
    rightBtnIcon() {
      return this.isFullscreen ? 'el-icon-copy-document' : 'el-icon-full-screen'
    },
  },
  methods: {
    changeChannel(index) {
      this.channelIdx = index
    },
    handleDoVideo(itm, index) {
      itm.state = !itm.state
      this.tableData.list[index].state = itm.state
    },
    clickVideo(index, state) {
      this.tableData.list[index].state = state
    },
    toggleFullscreen(e) {
      const grid = document.getElementById('videoContainer')
      if (grid) {
        const box = e.target.parentElement
        if (box.classList.contains('one')) {
          this.isFullscreen = false
          box.classList.remove('one')
          grid.classList.remove('channelOne')
        } else {
          this.isFullscreen = true
          box.classList.add('one')
          grid.classList.add('channelOne')
        }
      }
    },
    getCameraList() {
      apiv2.MonitorMgmt.ViewReq().then((res) => {
        if (res.code) {
          this.$message.error(res.message)
        } else {
          this.tableData.list = res.data.list.map((item) => {
            return {
              name: item.title,
              disabled: false,
              state: false,
              source: item.channel,
              html: item.channel.search(/\.(flv|mp4|m3u8)/) < 0,
              options: { autoplay: true, source: item.channel },
            }
          })
          this.videoList = this.tableData.list.slice(0, 16)

          // 数量补齐
          const diff = 16 - this.videoList.length
          for (let i = 0; i < diff; i++) {
            this.videoList.push({ name: '', state: false, source: '' })
          }
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.videoBox {
  height: 100%;
  position: relative;
  box-sizing: border-box;
  font-size: 17px;
  font-weight: 400;
  color: #ffffff;

  .content {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;

    .operate {
      width: 384px;
      height: 924px;
      background: url('../../assets/monitor/videoTableBg.png');
      background-size: 100% 100%;
      padding-top: 20px;

      .cameraBtn {
        width: 80px;
        height: 33px;
        background: #4e4e4e;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
      }

      .activeCameraBtn {
        background: #0c2eff;
      }

      .tableHead {
        width: 384px;
        height: 31px;
        background: url('../../assets/monitor/tableHeadBg.png');
        display: flex;
        justify-content: space-around;
        align-items: center;
      }

      .tableHead > div:nth-child(1),
      .tableRow > div:nth-child(1) {
        width: 55%;
        text-align: center;
      }

      .tableHead > div:nth-child(2),
      .tableRowBtnBox {
        width: 45%;
        text-align: center;
        display: flex;
        justify-content: center;
      }

      .tableRow {
        height: 38px;
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
        justify-content: space-around;

        .tableRowBtn {
          width: 61px;
          height: 25px;
          background: #4e4e4e;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 13px;
        }

        .tableRowBtnActive {
          background: #00a610;
        }
      }
    }

    .videoContainer {
      width: 1486px;
      height: 924px;
      background: url('../../assets/monitor/videoBg.png');
      background-size: 100% 100%;
      display: grid;
      gap: 5px;
      padding: 20px;
      box-sizing: border-box;

      &.channel0 {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
      }

      &.channel1 {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
      }

      &.channel2 {
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
      }

      &.channelOne {
        grid-template-columns: repeat(1, 1fr);
        grid-template-rows: repeat(1, 1fr);

        .singleVideo {
          display: none;

          &.one {
            display: block;
          }
        }
      }

      .singleVideo {
        position: relative;
        width: 100%;
        height: 100%;

        .title {
          position: absolute;
          z-index: 1;
          top: 1px;
          left: 1px;
          font-size: 1rem;
          color: #fff;
          padding: 5px;
        }

        .toggleFullscreen {
          cursor: pointer;
          position: absolute;
          z-index: 1;
          right: 1px;
          font-size: 1rem;
          color: #fff;
          padding: 5px;

          i {
            pointer-events: none;
          }
        }

        .player {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          border: 0.5px solid rgb(55, 116, 229);

          /deep/ .video-js {
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
