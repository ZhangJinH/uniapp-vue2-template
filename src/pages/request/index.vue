<template>
	<nav-layout title="请求">
		<view class="nav-container">
			<u-cell-group>
				<u-cell @click="login" title="login"></u-cell>
				<u-cell @click="get" title="get"></u-cell>
				<u-cell @click="post" title="post"></u-cell>
				<u-cell @click="put" title="put"></u-cell>
				<u-cell @click="deleteMethod" title="delete"></u-cell>
				<u-cell @click="upload" title="upload"></u-cell>
				<u-cell @click="download" title="download"></u-cell>
				<u-cell @click="batchGet" title="批量请求"></u-cell>
			</u-cell-group>
		</view>
	</nav-layout>
</template>

<script>
import { authDelete, authDownload, authGet, authPost, authPut, authUpload, login } from '@/apis'

export default {
	onShow() {
		this.login()
	},
	methods: {
		login() {
			login().then(res => {
				console.log(res.data)
				uni.setStorageSync('token', res.data.token)
			})
		},
		batchGet() {
			Promise.all([authGet(), authPost(), authPut()])
		},
		get() {
			authGet().then(res => {
				console.log(res.data)
			})
		},
		post() {
			authPost().then(res => {
				console.log(res.data)
			})
		},
		put() {
			authPut().then(res => {
				console.log(res.data)
			})
		},
		deleteMethod() {
			authDelete().then(res => {
				console.log(res.data)
			})
		},
		download() {
			authDownload().then(res => {
				console.log(res.data)
			})
		},
		upload() {
			authUpload().then(res => {
				console.log(res.data)
			})
		}
	}
}
</script>

<style lang="scss">
.nav-container {
	flex: 1;
	min-width: 0;
	min-height: 0;
}
</style>
