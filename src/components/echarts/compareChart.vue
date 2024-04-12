<template>
  <v-chart :option="option" />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, LineChart, TooltipComponent, LegendComponent])

export default {
  name: 'BarChart',
  components: {
    VChart,
  },
  props: {
    dataset: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
            },
          },
        },
        legend: {
          top: '0%',
          textStyle: {
            color: '#ffffff',
          },
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#b7e9fd',
            },
          },
          axisTick: {
            show: true,
          },
          axisLabel: {
            show: true,
            color: '#b7e9fd',
          },
        },
        yAxis: [
          {
            name: '(m³/h) 工况',
            splitLine: {
              show: false,
            },
            axisTick: {
              show: true,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#b7e9fd',
              },
            },
            axisLabel: {
              show: true,
              color: '#b7e9fd',
            },
          },
          {
            name: '标况 (m³/h)',
            position: 'right',
            splitLine: {
              show: false,
            },
            axisTick: {
              show: true,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#b7e9fd',
              },
            },
            axisLabel: {
              show: true,
              color: '#b7e9fd',
            },
          },
        ],
        series: [
          {
            type: 'line',
            name: '工况流量',
            smooth: true,
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 5,
            itemStyle: {
              color: '#058cff',
            },
            lineStyle: {
              color: '#058cff',
            },
            areaStyle: {
              color: 'rgba(5,140,255, 0.2)',
            },
            data: [],
          },
          {
            type: 'bar',
            name: '标况流量',
            yAxisIndex: 1,
            barWidth: 10,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#00FFE3',
                  },
                  {
                    offset: 1,
                    color: '#4693EC',
                  },
                ],
              },
            },
            data: [],
          },
        ],
      },
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      if (this.$props.dataset.length == 2) {
        this.option.series[0].data = this.$props.dataset[0]
        this.option.series[1].data = this.$props.dataset[1]
      }
    },
  },
}
</script>

<style scoped>
.chart {
  width: 100%;
}
</style>
