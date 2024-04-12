<template>
  <div class="chart">
    <v-chart :option="option" />
  </div>
</template>

<script>
import { use, registerMap } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { MapChart, EffectScatterChart } from 'echarts/charts'
import { TitleComponent, GeoComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import gongAnMap from '@/assets/gongAn.json'

use([CanvasRenderer, MapChart, EffectScatterChart, TitleComponent, GeoComponent])
registerMap('china', gongAnMap)

export default {
  name: 'MapChart',
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
        title: {
          text: '公安县站点分布图',
          left: 'center',
          textStyle: {
            color: '#fff',
          },
        },
        geo: {
          map: 'china',
          top: '0%',
          left: '0%',
          right: 0,

          label: {
            color: '#fff',
          },
          itemStyle: {
            areaColor: 'RGBA(56, 57, 61, 1)',
          },
          emphasis: {
            label: {
              color: '#fff',
            },
            itemStyle: {
              areaColor: 'RGBA(56, 57, 61, 1)',
              borderWidth: 0,
            },
          },

          regions: [
            {
              name: '南海诸岛',
              itemStyle: {
                opacity: 0,
              },
              emphasis: {
                label: {
                  show: false,
                },
              },
            },
          ],
        },
        series: [
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke',
            },
            symbolSize: 20,
            label: {
              show: true,
              position: 'top',
              formatter: '{b}',
              color: '#1CDDAE',
              fontSize: 20,
              backgroundColor: 'rgba(0,0,0,0.4)',
            },
            itemStyle: {
              color: '#1DE9B6',
            },
            zlevel: 1,
            data: [],
          },
        ],
      },
    }
  },
  methods: {
    loadData(dataset) {
      let data = []
      for (let i = 0; i < dataset.length; i++) {
        const item = dataset[i]
        let value = item.coordinate.split(',')
        data.push({ name: item.site_name, value })
      }
      this.option.series[0].data = data
    },
  },
}
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
