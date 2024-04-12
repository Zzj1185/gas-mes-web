<template>
  <div class="titleBox">
    <div class="title">{{ title }}</div>
    <div>
      <slot name="rightSlot"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '默认标题',
    },
  },
}
</script>

<style lang="less" scoped>
.titleBox {
  display: flex;
  justify-content: space-between;
  background: url('@/assets/columnBg.png') no-repeat;
  width: 718px;
  height: 43px;
  border-radius: 8px 0 0 8px;
  position: relative;
}
.title {
  font-size: 25px;
  font-family: SourceHanSansSC;
  font-weight: 400;
  color: #fefefe;
  text-indent: 10px;
  line-height: 46px;
  position: absolute;
}
</style>
