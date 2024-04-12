<template></template>

<script>
import apiv2 from '@/api/v2'
export default {
  data() {
    return {
      siteMarkerList: [],
    }
  },
  mounted() {
    this.siteMarkerList = []
  },
  props: {
    map: Object,
  },
  methods: {
    // 站点标记选项
    siteMarkerOption(site) {
      let icon = `<i class="iconfont icon-${site.type_icon}" style="font-size: ${site.icon_size}px" />`
      let siteTitle = `<div class="siteTitle">${site.site_name}</div>`
      let siteData = `<div id="site${site.site_id}" class="siteData"></div>`
      let labelHtml = `<div class="siteInfo" style="background-color: ${site.icon_color};">${siteTitle}${siteData}</div>`

      return {
        extData: site,
        title: site.site_name,
        anchor: 'center',
        position: [site.longitude, site.latitude],
        content: `<div class="siteIcon" style="background-color: ${site.icon_color}">${icon}</div>`,
        label: {
          direction: 'top',
          content: labelHtml,
        },
      }
    },
    // 创建站点标记
    createSiteMarker(site) {
      let opts = this.siteMarkerOption(site)
      let siteMarker = new AMap.Marker(opts)
      if (this.$auth(apiv2.SiteTag.ViewRoute)) {
        siteMarker.on('click', () => {
          this.$emit('open-window', site)
        })
      }
      this.map.add(siteMarker)
      site.marker = siteMarker
      this.siteMarkerList.push(site)
    },
    // 更新站点标记
    updateSiteMarker(data) {
      let site = this.siteMarkerList.find((o) => o.site_id == data.site_id)
      site = Object.assign(site, data)
      let opts = this.siteMarkerOption(site)
      site.marker.setOptions(opts)
      site.marker.setPosition(opts.position)
    },
    // 删除站点标记
    deleteSiteMarker(site) {
      this.siteMarkerList = this.siteMarkerList.filter((o) => o.site_id != site.site_id)
      site.marker.destroy()
    },
  },
}
</script>
