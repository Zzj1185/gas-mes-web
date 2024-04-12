<template>
  <div class="lite-title">
    <img class="title-icon" v-if="iconName" :src="`/img/dashboard/${iconName}.png`" />
    <div class="title-text">{{ title }}</div>
  </div>
</template>
<script>
export default {
  props: {
    iconName: String,
    title: String,
  },
  methods: {},
}
</script>
<style scoped lang="less">
.lite-title {
  height: 20px;
  color: #fff;
  display: flex;
  font-size: 20px;
  align-items: center;


  .title-icon {
    height: 20px;
    margin-right: 7px;
  }
}
</style>
