<template>
	<view class="demo">
		<u-cell-group>
			<u-cell title="导航" isLink url="/pages/layout/nav"></u-cell>
			<u-cell title="请求" isLink url="/pages/request/index"></u-cell>
			<u-cell title="图片" isLink url="/pages/images/index"></u-cell>
		</u-cell-group>
	</view>
</template>

<script>
export default {
	onShow() {
		uni.showLoading({
			title: '加载中'
		})

		setTimeout(() => {
			uni.hideLoading()
		}, 2000)
	}
}
</script>

<style lang="scss">
.demo {
	padding-top: 80rpx;
}
</style>
