<template>
  <v-chart class="chart" ref="chart" :option="option" :update-options="updateOptions" :loading="loading"
    :loadingOptions="loadingOptions" />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, TooltipComponent, LegendComponent, GridComponent])

export default {
  name: 'LineCompareChart',
  components: {
    VChart,
  },
  props: {
    dataset: {
      type: Array,
      default: () => [],
    },
    grid: {
      type: Object,
      default: () => ({
        top: '5%',
        left: '5%',
        right: '5%',
        bottom: '5%',
      }),
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    showYUnit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let tooltipColor = '#d4ffff'
    let axisColor = '#90979c'
    return {
      updateOptions: {
        notMerge: true,
      },
      loadingOptions: {
        textColor: '#fff',
        maskColor: 'rgba(0, 0, 0, 0.75)',
      },
      option: {
        color: [],
        legend: {
          icon: 'circle',
          textStyle: {
            color: '#fff',
          },
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#0000004d',
          borderColor: tooltipColor,
          textStyle: {
            color: tooltipColor,
          },
        },
        grid: this.grid,
        xAxis: {
          type: 'category',
          axisLabel: {
            color: axisColor,
            overflow: 'break',
            interval: 0,
            width: 70,
          },
          axisLine: {
            lineStyle: {
              color: axisColor,
            },
          },
        },
        yAxis: {
          name: '单位:',

          nameTextStyle: {
            color: '#fff',
            nameLocation: 'start',
            fontSize: 14,
          },
          axisLine: {
            show: true,
          },
          axisLabel: {
            color: axisColor,
          },
          splitLine: {
            lineStyle: {
              color: axisColor,
              type: 'dashed',
            },
          },
        },
        series: [],
      },
    }
  },
  watch: {
    dataset: {
      handler: function () {
        this.loadData()
      },
      deep: true,
    },
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      let series = []
      for (let i = 0; i < this.$props.dataset.length; i++) {
        const item = this.$props.dataset[i]

        // 添加series参数
        item.type = 'line'
        item.smooth = true
        item.symbolSize = 10

        // 添加数值显示后缀
        if (item.suffix) {
          item.tooltip = {
            valueFormatter: (value) => value + ` ${item.suffix}`,
          }
        }
        // 添加颜色
        if (item.color) {
          this.option.color[i] = item.color
        } else {
          this.option.color[i] = this.randomLightColor()
        }
        let color = this.option.color[i]
        item.areaStyle = this.setAraeStyle(color)

        // 设置y轴单位
        this.option.yAxis.name = this.showYUnit ? `单位:${item.suffix}` : ''

        series.push(item)
      }

      this.option.series = series
    },
    setAraeStyle(color) {
      if (color[0] !== '#') {
        color = this.rgbToHex(color)
      }
      let startColor = {
        offset: 0,
        color: color + '66',
      }
      let endColor = {
        offset: 0,
        color: color + '1a',
      }
      let colorStyle = { type: 'linear', x: 0, y: 0, x2: 0, y2: 1 }
      colorStyle.colorStops = [startColor, endColor]
      let opts = { color: colorStyle, shadowColor: '#0000001a' }
      return opts
    },
    rgbToHex(rgb) {
      // 将字符串中的空格和括号删除
      rgb = rgb.replace(/[\s()]/g, '')

      // 解析出三个数字值
      let matches = rgb.match(/^rgb(\d+),(\d+),(\d+)$/)
      let r = parseInt(matches[1], 10)
      let g = parseInt(matches[2], 10)
      let b = parseInt(matches[3], 10)

      // RGB值转为Hex颜色代码
      r = Math.max(0, Math.min(255, Math.round(r)))
      g = Math.max(0, Math.min(255, Math.round(g)))
      b = Math.max(0, Math.min(255, Math.round(b)))
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    },
    randomLightColor() {
      var color = '#'
      var r, g, b

      // keep generating random colors until a light enough one is found
      do {
        r = Math.floor(Math.random() * 256)
        g = Math.floor(Math.random() * 256)
        b = Math.floor(Math.random() * 256)
      } while (0.2126 * r + 0.7152 * g + 0.0722 * b < 150) // luminance threshold

      color += this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b)
      return color
    },
    componentToHex(c) {
      var hex = c.toString(16)
      return hex.length == 1 ? '0' + hex : hex
    },
  },
}
</script>

<style scoped>
.chart {
  width: 100%;
}
</style>
