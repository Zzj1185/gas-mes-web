<template>
  <v-chart :option="option" />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, RadarChart, TooltipComponent])

export default {
  name: 'RadarChart',
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
        tooltip: {},
        radar: {
          shape: 'circle',
          radius: '65%',
          indicator: [{ name: '高高' }, { name: '高' }, { name: '低低' }, { name: '低' }],
          axisName: {
            color: '#b7e9fd',
            fontSize: 18,
          },
          axisLine: {
            lineStyle: {
              color: '#5aa3d0',
            },
          },
          splitLine: {
            lineStyle: {
              color: '#63c0fb33',
              width: 2,
            },
          },
          splitArea: {
            areaStyle: {
              color: '#1b324266',
            },
          },
        },
        series: [
          {
            type: 'radar',
            lineStyle: {
              color: '#66ffff',
            },
            areaStyle: {
              color: '#66ffff66',
            },
            data: [
              {
                name: '报警类型',
                value: [],
              },
            ],
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
      let data = []
      for (let i = 0; i < this.option.radar.indicator.length; i++) {
        const item = this.option.radar.indicator[i]
        const row = this.$props.dataset.find((o) => o.name == item.name)
        let value = row ? row.value : 0
        data.push(value)
      }
      this.option.series[0].data[0].value = data
    },
  },
}
</script>
