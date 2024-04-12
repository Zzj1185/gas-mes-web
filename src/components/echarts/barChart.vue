<template>
  <v-chart :option="option" />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent])

export default {
  name: 'BarChart',
  components: {
    VChart,
  },
  props: {
    title: {
      type: String,
      default: 'Bar Chart',
    },
    barColor: {
      type: Array,
      default: () => ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293'],
    },
    grid: {
      type: Object,
      default: () => {},
    },
    label: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    let defaultGrid = {
      top: '15%',
      left: '10%',
      right: '5%',
      bottom: '10%',
    }
    return {
      option: {
        title: {
          text: this.$props.title,
          left: 'center',
          textStyle: {
            color: '#fff',
          },
        },
        color: this.$props.barColor,
        tooltip: {
          trigger: 'axis',
        },
        grid: Object.assign(defaultGrid, this.$props.grid),
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            color: '#b7e9fd',
          },
        },
        yAxis: {
          axisLabel: {
            color: '#b7e9fd',
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(255,255,255,0.2)',
            },
          },
        },
        series: [],
      },
    }
  },
  methods: {
    loadData(dataset) {
      let series = []
      for (let i = 0; i < dataset.length; i++) {
        series.push({
          type: 'bar',
          name: dataset[i].name,
          data: dataset[i].data,
          barWidth: 20,
          label: Object.assign({ show: false }, this.label),
        })
      }
      this.option.series = series
    },
  },
}
</script>

<style scoped>
.chart {
  width: 100%;
}
</style>
