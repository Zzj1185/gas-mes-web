<template>
  <div>
    <video ref="videoPlayer" class="video-js" type="video/mp4"></video>
  </div>
</template>

<script>
import videojs from 'video.js'

export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      player: null,
    }
  },
  mounted() {
    let options = Object.assign({ controls: true }, this.$props.options)
    this.player = videojs(this.$refs.videoPlayer, options, () => {
      this.player.on('ready', () => {
        this.player.src(this.options.source)
      })
    })
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  },
}
</script>
