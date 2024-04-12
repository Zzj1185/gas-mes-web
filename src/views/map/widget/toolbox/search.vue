<template>
  <div class="placeSearch">
    <el-input id="searchInput" placeholder="搜索站点或位置" v-model="searchValue" clearable>
      <el-button slot="append" icon="el-icon-search" @click="searchSite"></el-button>
    </el-input>
    <div id="searchResult" ref="searchResult"></div>
  </div>
</template>

<script>
import apiv2 from '@/api/v2'
export default {
  data() {
    return {
      searchValue: null,
      searchList: [],
      placeSearch: null,
    }
  },
  created() {
    if (this.map) {
      // 地点搜索
      this.placeSearch = new AMap.PlaceSearch()
    }
  },
  props: {
    map: Object,
  },
  watch: {
    searchValue(newValue, oldValue) {
      if (newValue != oldValue && newValue == '') {
        this.$refs['searchResult'].innerHTML = ''
        this.$refs['searchResult'].style.display = 'none'
        this.searchList = []
        this.$emit('clear-result', 'search')
      }
    },
  },
  methods: {
    // 搜索站点
    searchSite() {
      if (this.searchValue) {
        this.$refs['searchResult'].innerHTML = ''
        this.$refs['searchResult'].style.display = 'none'
        apiv2.SiteMgmt.ViewReq({ site_name: this.searchValue }).then((res) => {
          let list = []
          if (res.data) {
            for (let i = 0; i < res.data.list.length; i++) {
              let item = res.data.list[i]
              list.push({
                id: item.site_id,
                name: item.site_name,
                type: item.site_type,
                location: [item.longitude, item.latitude],
              })
            }
          }
          if (this.placeSearch) {
            this.placeSearch.search(this.searchValue, (status, result) => {
              if (status == 'complete') {
                for (let i = 0; i < result.poiList.pois.length; i++) {
                  const poi = result.poiList.pois[i]
                  list.push({
                    id: poi.id,
                    name: poi.name,
                    location: poi.location,
                  })
                }
                this.resultList(list)
              }
            })
          } else {
            this.resultList(list)
          }
        })
      }
    },
    // 输出列表
    resultList(list) {
      if (list.length) {
        for (let i = 0; i < list.length; i++) {
          const data = list[i]
          let ele = document.createElement('div')
          ele.className = 'result-item'
          ele.style.cursor = 'pointer'
          ele.innerText = data.name
          if (data.type) {
            ele.onclick = () => {
              this.$emit('to-site', data.id)
            }
          } else {
            let marker = new AMap.Marker({
              position: data.location,
              label: {
                direction: 'bottom',
                content: data.name,
              },
            })
            this.$emit('add-result', 'search', marker)
            ele.onclick = () => {
              this.map.setFitView([marker])
            }
          }
          this.$refs['searchResult'].append(ele)
        }
      } else {
        let ele = document.createElement('div')
        ele.className = 'result-item'
        ele.innerText = '无搜索结果'
        this.$refs['searchResult'].append(ele)
      }
      this.$refs['searchResult'].style.display = 'block'
    },
  },
}
</script>

<style lang="less" scoped>
.placeSearch {
  width: 100%;
  height: 100%;

  /deep/ #searchInput {
    border: none;
    color: #000000;
    height: 38px;
    line-height: 38px;
    border-radius: 8px 0 0 8px;
    padding: 13px 20px 10px 20px;
    background-color: #ffffff;
    box-shadow: inset 0px 8px 5px -5px rgba(0, 0, 0, 0.61);
  }

  /deep/ .el-input__inner::placeholder {
    color: #9a9a9a;
  }

  /deep/ .el-input-group__append {
    border: none;
    font-size: 0;
    border-radius: 0 8px 8px 0;
    padding: 12px 17px 10px 19px;
    background-color: #0c2eff;
    box-shadow: inset 0px 8px 5px -5px rgba(0, 0, 0, 0.61);

    .el-button {
      border: 0;
      margin: 0;
      padding: 0;

      i {
        color: #ffffff;
        font-size: 16px;
      }
    }
  }

  #searchResult {
    position: relative;
    background-color: transparent;
    padding: 0 20px;
    display: none;

    /deep/ .result-item {
      margin: 9px 0;
      font-size: 14px;
      font-weight: bold;
      line-height: 15px;
    }
  }
}
</style>
