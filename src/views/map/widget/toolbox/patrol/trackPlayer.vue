<template>
  <div class="track-player" v-if="show">
    <div class="boxes">
      <el-form class="query-box" inline>
        <el-form-item label="选择轨迹">
          <el-pagination layout="prev, slot, next, total" :current-page="query.page" :page-size="query.size" :total="query.total" @current-change="handleQuery">
            <el-input-number v-model="query.page" size="small" :min="1" :max="query.total" :step="1" :controls="false" step-strictl @change="handleQuery" />
          </el-pagination>
        </el-form-item>
        <el-form-item class="close">
          <el-button size="mini" type="danger" icon="el-icon-close" @click="closePlayer"></el-button>
        </el-form-item>
      </el-form>
      <div class="player-box" v-if="trackData.length">
        <div class="slider">
          <el-slider v-model="step" :min="0" :max="movePath.length" :format-tooltip="formatTooltip" @mousedown.native="onTouch"></el-slider>
          <div class="play-time">
            <i class="el-icon-time"></i><span>{{ time }}</span>
          </div>
        </div>
        <el-button v-if="pause" size="mini" type="success" @click="onPlay">播放</el-button>
        <el-button v-else size="mini" type="danger" @click="onPause">暂停</el-button>
      </div>
      <div class="empty-box" v-else>
        <span>没有轨迹记录</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      step: 0,
      pause: true,
      moveTimer: null,
      clockTimer: null,
      timestamp: 0,
      trackLine: null,
      passedLine: null,
      patrolMarker: null,
      trackData: [],
      movePath: [],
      trackUser: '',
      query: {
        page: 1,
        size: 1,
        total: 1,
      },
    }
  },
  created() {
    this.createPlayer()
  },
  beforeDestroy() {
    this.closePlayer()

    if (this.trackLine) {
      this.trackLine.setMap(null)
      this.trackLine.destroy()
      this.trackLine = null
    }
    if (this.passedLine) {
      this.passedLine.setMap(null)
      this.passedLine.destroy()
      this.passedLine = null
    }
    if (this.patrolMarker) {
      this.patrolMarker.setMap(null)
      this.patrolMarker.remove()
      this.patrolMarker = null
    }
  },
  props: {
    map: Object,
  },
  computed: {
    time() {
      return this.timestamp ? this.$moment(this.timestamp).format('YYYY/MM/DD HH:mm:ss') : '--/--/-- --:--:--'
    },
  },
  watch: {
    step() {
      if (this.step) {
        let linePath = []
        for (let i = 0; i <= this.step; i++) {
          const item = this.trackData[i]
          linePath.push(item.position)
        }
        this.passedLine.setPath(linePath)
        this.passedLine.show()
      } else {
        this.passedLine.hide()
      }
      if (this.pause) {
        this.transfer()
      }
    },
  },
  methods: {
    // 创建播放器
    createPlayer() {
      // 巡检人
      this.patrolMarker = new AMap.Marker({
        map: this.map,
        position: [0, 0],
        content: '<i class="el-icon-user-solid" style="font-size: 25px; color: #FF0;" />',
        anchor: 'center',
      })
      this.patrolMarker.hide()
      // 轨迹线
      this.trackLine = new AMap.Polyline({
        map: this.map,
        showDir: true,
        strokeColor: '#F82', //线颜色
        strokeWeight: 6, //线宽
      })
      this.trackLine.hide()
      // 经过线
      this.passedLine = new AMap.Polyline({
        map: this.map,
        strokeColor: '#AF5', //线颜色
        strokeWeight: 6, //线宽
      })
      this.passedLine.hide()
      // 移动绑定
      this.patrolMarker.on('moving', (e) => {
        if (!this.pause) {
          this.passedLine.show()
          if (this.step) {
            let linePath = this.passedLine.getPath()
            if (linePath.length == this.step + 1) {
              linePath.push(e.passedPath[1])
            } else {
              linePath[this.step + 1] = e.passedPath[1]
            }
            this.passedLine.setPath(linePath)
          } else {
            this.passedLine.setPath([this.trackData[0].position, e.passedPath[1]])
          }
        }
        this.map.setCenter(e.target.getPosition(), true)
      })
    },
    // 打开
    openPlayer(list, page, total) {
      this.show = true
      this.trackData = list
      this.trackUser = list[0].track_user
      this.query.page = page
      this.query.total = total
      if (this.trackData.length) {
        this.drawTrack()
      } else {
        this.resetPlayer()
      }
    },
    // 关闭
    closePlayer() {
      this.show = false
      this.resetPlayer()
    },
    // 重置
    resetPlayer() {
      this.onPause()
      this.patrolMarker.hide()
      this.trackLine.hide()
      this.passedLine.hide()
      this.step = 0
    },
    // 查询
    handleQuery(page) {
      this.$emit('change', page)
    },
    // 绘制轨迹
    drawTrack() {
      this.step = 0
      let linePath = this.trackData.map((v) => v.position)
      this.trackLine.setPath(linePath)
      this.trackLine.show()
      this.patrolMarker.setPosition(linePath[0])
      let label = { content: `<span style="color: #FF0;">${this.trackUser}</span>`, direction: 'top', offset: [0, -5] }
      this.patrolMarker.setLabel(label)
      this.patrolMarker.show()
      this.map.setFitView(this.trackLine, false, [200, 50, 50, 50])

      // 移动路线
      this.movePath = []
      for (let i = 1; i < linePath.length; i++) {
        // 下一个坐标点
        const nextPosition = linePath[i]
        // 上一个坐标点
        const lastPosition = linePath[i - 1]
        // 两坐标点的距离
        const distance = AMap.GeometryUtil.distance(nextPosition, lastPosition)
        // 下一个时间点
        const nextTime = new Date(this.trackData[i].track_time).getTime()
        // 下一个时间点
        const lastTime = new Date(this.trackData[i - 1].track_time).getTime()
        // 计算时间差
        const duration = nextTime - lastTime
        this.movePath.push({ position: nextPosition, duration, distance })
      }
      // 初始时间
      this.timestamp = new Date(this.trackData[0].track_time).getTime()
    },
    // 格式化提示
    formatTooltip() {
      return this.trackData[this.step].track_time
    },
    // 播放
    onPlay() {
      if (this.step < this.movePath.length) {
        this.clockTimer = setInterval(() => {
          this.timestamp += 1000
        }, 1000)
        this.pause = false
        this.move()
      }
    },
    // 暂停
    onPause() {
      clearTimeout(this.moveTimer)
      clearInterval(this.clockTimer)
      this.pause = true
      this.patrolMarker.stopMove()
    },
    // 点击
    onTouch(e) {
      if (e.target.className != 'el-slider') {
        this.onPause()
      }
    },
    // 移动
    move() {
      let next = this.movePath[this.step]
      let current = {}
      current.position = this.patrolMarker.getPosition().toArray()
      current.distance = AMap.GeometryUtil.distance(current.position, next.position)
      let duration = next.duration
      if (next.distance) {
        duration = (current.distance / next.distance) * next.duration
      }
      this.patrolMarker.moveTo(next.position, {
        autoRotation: false,
        duration,
      })

      this.moveTimer = setTimeout(() => {
        this.step++
        if (this.step < this.movePath.length) {
          this.move()
        } else {
          this.onPause()
        }
      }, duration)
    },
    // 传送
    transfer() {
      this.timestamp = new Date(this.trackData[this.step].track_time).getTime()
      let data = this.trackData[this.step]
      this.patrolMarker.moveTo(data.position, {
        autoRotation: false,
        duration: 0,
      })
    },
  },
}
</script>
<style lang="less" scoped>
.track-player {
  top: 88px;
  left: 50%;
  width: 400px;
  height: 150px;
  position: fixed;
  border-radius: 5px;
  margin-left: -200px;
  background-color: #222933;

  .boxes {
    padding: 10px;

    .query-box {
      display: flex;
      justify-content: space-between;

      /deep/ .el-form-item {
        .el-pagination {
          padding: 0;

          span,
          button {
            vertical-align: middle;
          }
        }

        .el-input-number {
          width: 50px;
        }
      }

      .close {
        margin-right: 0;

        .el-button--mini {
          padding: 7px;
        }
      }
    }

    .player-box {
      display: flex;
      justify-content: space-between;

      .slider {
        width: 100%;
        padding-left: 10px;
        padding-right: 20px;

        .play-time {
          text-align: center;

          i {
            margin-right: 5px;
          }
        }
      }
    }

    .empty-box {
      text-align: center;
    }
  }
}
</style>
