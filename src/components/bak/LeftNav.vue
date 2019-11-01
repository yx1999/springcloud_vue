<template>
	<el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#334157"
	 text-color="#fff" active-text-color="#ffd04b" :collapse="collapsed" :collapse-transition="my">
		<!-- <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path" unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b"> -->
		<div class="logobox">
			<img class="logoimg" src="../assets/img/logo.png" alt="">
		</div>
		<el-submenu v-for="na in treeNodeList" index="1">
			<template slot="title">
				<i class="el-icon-location"></i>
				<span>{{na.treeNodeName}}</span>
			</template>
			<el-menu-item index="1-3">选项1</el-menu-item>
			<!-- <el-menu-item-group>
				<template slot="title">分组一</template>
				<el-menu-item index="1-1">选项1</el-menu-item>
				<el-menu-item index="1-2">选项2</el-menu-item>
			</el-menu-item-group>
			<el-menu-item-group title="分组2">
				<el-menu-item index="1-3">选项3</el-menu-item>
			</el-menu-item-group>
			<el-submenu index="1-4">
				<template slot="title">选项4</template>
				<el-menu-item index="1-4-1">选项1</el-menu-item>
			</el-submenu> -->
		</el-submenu>
		
	</el-menu>
</template>
<script>
	export default {
		data: function() {
			return {
				collapsed: false,
				my: true,
				treeNodeList:[]
			};
		},
		created: function() {
			this.$root.Bus.$on("aside-toggle", (v) => {
				this.collapsed = v;
			});
			let url = this.axios.urls.SYS_TREENODE_LISTALL;
			console.log(url);
			this.axios.post(url,{}).then((resp) => {
				this.treeNodeList=resp.data.date;
				console.log('成功！');
			}).catch((error) => {
				console.log('error');
			});
		},
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			}
		},

	}
</script>
<style>
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 240px;
		min-height: 400px;
	}

	.el-menu-vertical-demo:not(.el-menu--collapse) {
		border: none;
		text-align: left;
	}

	.el-menu-item-group__title {
		padding: 0px;
	}

	.el-menu-bg {
		background-color: #1f2d3d !important;
	}

	.el-menu {
		border: none;
	}

	.logobox {
		height: 40px;
		line-height: 40px;
		color: #9d9d9d;
		font-size: 20px;
		text-align: center;
		padding: 20px 0px;
	}

	.logoimg {
		height: 40px;
	}
</style>
