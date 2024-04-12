<template>
  <div class="tool-button">
    <div :class="enableArea ? 'active' : ''" @click="switchArea">
      <i class="iconfont icon-area"></i>
      <div>面积测量</div>
    </div>
    <div class="earth-button" :class="enableSatellite ? 'active' : ''" @click="switchSatellite">
      <i class="iconfont icon-satellite"></i>
      <div>卫星视图</div>
    </div>
    <div :class="enableRuler ? 'active' : ''" @click="switchRuler">
      <i class="iconfont icon-ruler"></i>
      <div>距离测量</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    map: Object,
    defaultStyle: String,
    customStyle: String,
  },
  data() {
    return {
      enableSatellite: false,
      enableRuler: false,
      enableArea: false,
      satelliteLayer: null,
      mouseTool: null,
      rangingNode: 0,
      measuringNode: 0,
    }
  },
  created() {
    if (this.map) {
      // 卫星图层
      this.satelliteLayer = new AMap.TileLayer.Satellite()
      // 鼠标工具
      this.mouseTool = new AMap.MouseTool(this.map)
      this.mouseTool.on('draw', () => {
        this.rangingNode = this.measuringNode = 0
        if (this.enableRuler || this.enableArea) {
          this.$emit('prompt', 'update', '')
        }
      })
      this.mouseTool.on('cancel', () => {
        this.measuringNode = 0
        if (this.enableRuler) {
          this.$emit('prompt', 'update', '')
        }
      })
    }
  },
  methods: {
    // 开关卫星视图
    switchSatellite() {
      this.enableSatellite = !this.enableSatellite
      if (this.enableSatellite) {
        this.satelliteLayer.setMap(this.map)
        this.map.setMapStyle(this.defaultStyle)
      } else {
        this.satelliteLayer.setMap(null)
        this.map.setMapStyle(this.customStyle)
      }
    },
    // 开关距离测量
    switchRuler() {
      this.enableArea = false
      this.mouseTool.off('addnode')
      this.$emit('prompt', 'remove')

      this.enableRuler = !this.enableRuler
      if (this.enableRuler) {
        if (this.mouseTool.ruler) {
          this.mouseTool.ruler.turnOn()
        } else {
          this.mouseTool.rule()
          if (this.mouseTool.ruler) {
            this.mouseTool.ruler.on('addnode', () => {
              this.rangingNode++
            })
            this.mouseTool.ruler.on('removenode', () => {
              this.rangingNode--
            })
            this.mouseTool.ruler.on('move', (e) => {
              if (this.rangingNode) {
                let value = e.distance || 0
                this.$emit('prompt', 'update', this.rulerPromptContent(value))
              }
            })
            this.mouseTool.ruler.on('cancel', () => {
              this.rangingNode = 0
              this.$emit('prompt', 'update', '')
            })
          }
        }
        this.$emit('prompt', 'add', '单击确定起点')
      } else {
        this.mouseTool.close(true)
        this.mouseTool.ruler.turnOff()
      }
    },
    // 开关面积测量
    switchArea() {
      this.enableRuler = false
      if (this.mouseTool.ruler) {
        this.mouseTool.ruler.turnOff()
      }
      this.$emit('prompt', 'remove')

      this.enableArea = !this.enableArea
      if (this.enableArea) {
        this.mouseTool.measureArea()
        this.mouseTool.on('addnode', (e) => {
          this.measuringNode = e.obj.getPath().length
        })
        this.map.on('mousemove', this.computeArea)
        this.$emit('prompt', 'add', '单击确定起点')
      } else {
        this.mouseTool.close(true)
        this.mouseTool.off('addnode')
        this.map.off('mousemove', this.computeArea)
      }
    },
    // 计算范围面积
    computeArea() {
      if (this.measuringNode) {
        if (this.measuringNode >= 3) {
          if (this.mouseTool.MeasureAreaTemp && this.mouseTool.MeasureAreaTemp.obj) {
            let area = this.mouseTool.MeasureAreaTemp.obj.getArea()
            this.$emit('prompt', 'update', this.areaPromptContent(area))
          }
        } else {
          this.$emit('prompt', 'update', '')
        }
      }
    },
    // 修改距离提示
    rulerPromptContent(value) {
      if (this.rangingNode) {
        return '<div>总长：' + this.formatRulerDistance(value, 'color:#FE383A;font-weight:bold') + '</div><div>单击继续，双击或右键结束</div>'
      }
      return value
    },
    // 格式化标尺距离
    formatRulerDistance(value, style) {
      var regExp = /^[\d.]+$/
      if (regExp.test(value)) {
        if (value < 1e3) {
          let newValue = value.toFixed(0)
          return '<span' + (style ? ' style="' + style + '"' : '') + '>' + newValue + '</span>米'
        }
        let newValue = (value / 1e3).toFixed(1)
        return '<span' + (style ? ' style="' + style + '"' : '') + '>' + newValue + '</span>公里'
      }
      return value
    },
    // 修改面积提示
    areaPromptContent(value) {
      if (this.measuringNode) {
        if (this.measuringNode >= 3) {
          return '<div>总面积：' + this.formatMeasureArea(value, 'color:#FE383A;font-weight:bold') + '</div><div>单击继续，双击或右键结束</div>'
        } else {
          return '单击继续，双击或右键结束'
        }
      }
      return value
    },
    // 格式化测量面积
    formatMeasureArea(value, style) {
      var regExp = /^[\d.]+$/
      if (regExp.test(value)) {
        if (value < 1e6) {
          let newValue = value.toFixed(1)
          return '<span' + (style ? ' style="' + style + '"' : '') + '>' + newValue + '</span>平方米'
        }
        let newValue = (value / 1e6).toFixed(2)
        return '<span' + (style ? ' style="' + style + '"' : '') + '>' + newValue + '</span>平方公里'
      }
      return value
    },
  },
}
</script>

<style lang="less" scoped>
.tool-button {
  display: flex;
  align-items: center;
  justify-content: space-between;

  >div {
    cursor: pointer;
    color: #ffffff;
    width: 115px;
    height: 33px;
    display: flex;
    font-size: 16px;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    background-color: #5d5d5d;

    i {
      font-size: 18px;
    }

    &.active {
      background-color: #0c2eff;
    }

    &.earth-button {
      width: 80px;
      height: 70px;
      flex-direction: column;

      i {
        font-size: 36px;
      }

      div {
        font-size: 14px;
      }
    }
  }
}
</style>
