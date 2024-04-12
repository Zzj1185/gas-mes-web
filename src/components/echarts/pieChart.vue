<template>
  <v-chart :option="option" />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent])

export default {
  name: 'PieChart',
  components: {
    VChart,
  },
  props: {
    title: {
      type: String,
      default: 'Pie Chart',
    },
    pieColor: {
      type: Array,
      default: () => ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293'],
    },
  },
  data() {
    return {
      option: {
        title: {
          text: this.$props.title,
          left: 'center',
          textStyle: {
            color: '#fff',
          },
        },
        color: this.$props.pieColor,
        tooltip: {},
        series: [],
      },
    }
  },
  methods: {
    loadData(dataset) {
      let series = []
      for (let i = 0; i < dataset.length; i++) {
        series.push({
          type: 'pie',
          radius: dataset[i].radius ? dataset[i].radius : '75%',
          name: dataset[i].name,
          data: dataset[i].data,
          label: {
            borderWidth: 0,
            color: '#fff',
            fontSize: 14,
          },
        })
      }
      this.option.series = series
    },
  },
}
</script>
