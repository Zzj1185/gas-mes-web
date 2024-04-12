<template>
  <div class="containerBox">
    <div class="map">
      <slot name="map"></slot>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.containerBox {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  .map {
    width: 1920px;
    height: 1080px;
  }
}
</style>
