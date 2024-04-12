<template>
  <div class="mapBox">
    <VChart ref="charts" id="custom-map" :option="option" @click="clickSite"></VChart>
  </div>
</template>

<script>
import apiv2 from '@/api/v2'
import { use, registerMap } from 'echarts/core'
import { MapChart, ScatterChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { GeoComponent } from 'echarts/components'
import { Scatter3DChart } from 'echarts-gl/charts'
import { Geo3DComponent, Mapbox3DComponent } from 'echarts-gl/components'
import VChart from 'vue-echarts'
import mapJson from '@/assets/map/421022.json'

use([MapChart, ScatterChart, CanvasRenderer, GeoComponent, Scatter3DChart, Geo3DComponent, Mapbox3DComponent])
registerMap('公安县', mapJson)

export default {
  data() {
    const symbolImg =
      'path://M512.392533 68.266667C314.760533 68.266667 154.4704 219.648 153.6 408.4736l0.085333 7.850667c1.536 65.160533 22.272 127.0784 59.460267 180.258133l4.010667 5.614933 1.826133 2.952534 1.6896 2.525866c1.143467 1.621333 2.3552 3.157333 3.703467 4.676267l0.3072 0.341333 233.335466 296.021334a68.266667 68.266667 0 0 0 11.349334 11.3664l3.003733 2.218666a68.266667 68.266667 0 0 0 92.859733-13.585066L798.5664 612.693333l-1.6384 1.774934c2.901333-2.9696 5.12-5.905067 7.3216-9.301334l2.1504-3.464533c40.482133-55.0912 63.146667-122.026667 64-192.631467C870.4 220.091733 709.632 68.266667 512.392533 68.266667z m0 68.266666C672.785067 136.533333 802.133333 258.679467 802.133333 408.644267a264.1408 264.1408 0 0 1-51.643733 153.9072l-3.618133 5.632a11.895467 11.895467 0 0 1 1.3824-1.604267l-2.474667 2.798933-234.154667 297.079467-234.154666-297.079467-1.3312-1.570133-2.542934-4.027733 1.9968 3.413333-0.170666-0.170667 0.324266 0.443734C239.616 517.461333 221.866667 464.4352 221.866667 408.644267 222.549333 258.372267 351.573333 136.533333 512.392533 136.533333z M512 261.0176a153.6 153.6 0 1 0 0 307.2 153.6 153.6 0 0 0 0-307.2z m0 68.266667a85.333333 85.333333 0 1 1 0 170.666666 85.333333 85.333333 0 0 1 0-170.666666z'
    return {
      siteList: [],
      option: {
        geo: {
          show: false,
          type: 'map',
          map: '公安县',
          zoom: 0.94,
          width: 554,
          height: 800,
          top: -118,
          left: 92,
        },
        geo3D: {
          map: '公安县',
          left: -20,
          bottom: 25,
          silent: true,
          shading: 'realistic',
          realisticMaterial: {
            detailTexture: '/img/mapBg.png',
          },
          itemStyle: {
            opacity: 0.9,
            borderWidth: 2,
            borderColor: '#fff',
          },
          label: {
            show: true,
            color: '#fff',
            fontSize: 14,
          },
          viewControl: {
            distance: 120,
            alpha: 90,
            beta: 60,
            center: [0, 0, 0],
            rotateSensitivity: [0, 0],
            zoomSensitivity: 0,
            panSensitivity: 0,
          },
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: symbolImg,
            symbolSize: 30,
            symbolRotate: 60,
            itemStyle: {
              opacity: 1,
              color: '#0f8',
            },
            label: {
              show: true,
              color: '#0f8',
              fontSize: 18,
              fontWeight: 'bold',
              position: 'top',
              offset: [-20, 0],
              formatter: '{b0}',
              rotate: 60,
              backgroundColor: 'transparent',
            },
            emphasis: {
              label: {
                color: 'red',
              },
              itemStyle: {
                color: 'red',
              },
            },
            data: [],
          },
        ],
      },
    }
  },
  mounted() {
    this.getSiteList()
  },
  components: { VChart },
  methods: {
    getSiteList() {
      apiv2.CommonData.AllSiteReq({ type_id: 1 }).then((res) => {
        this.siteList = res.data.list.map((item) => ({
          name: item.site_name,
          value: [item.longitude, item.latitude],
        }))
        this.option.series[0].data = this.siteList
      })
    },
    clickSite(e) {
      this.$router.push({ name: 'process', params: { name: e.data.name } })
    },
  },
}
</script>
<style lang="less" scoped>
.mapBox {
  flex: 1;

  #custom-map {
    width: 100%;
    height: 100%;
    /deep/ canvas {
      background-color: transparent;
    }
    /deep/ canvas:last-child {
      transform: rotateZ(60deg);
    }
  }
}
</style>
