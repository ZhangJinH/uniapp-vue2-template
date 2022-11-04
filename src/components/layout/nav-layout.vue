<template>
  <view class="layout">
    <u-navbar :leftText="title" placeholder @leftClick="handleBack"></u-navbar>
    <slot></slot>
  </view>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '默认导航'
      }
    },
    methods: {
      handleBack() {
        uni.navigateBack({
          delta: 1
        })
      }
    }
  }
</script>

<style lang="scss"></style>
