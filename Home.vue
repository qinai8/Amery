<template>
	<div>
		<div id="">
			<el-container>
				<el-aside>
					<el-menu
						default-active="1-4-1"
						class="el-menu-vertical-demo number"
						:collapse="isCollapse"
						background-color="#304156"
						text-color="#fff"
						active-text-color="#ffd04b"
						router
					>
						<el-menu-item index="/home">
							<i class="el-icon-menu"></i>
							<span slot="title">首页</span>
						</el-menu-item>
						<!-- <el-submenu v-for="item in indexleft" :index="item.path">
							<template slot="title">
								<i :class="item.meta.icon"></i>
								<span slot="title">{{ item.meta.title }}</span>
							</template>
							<el-menu-item-group>
								<el-menu-item v-for="item1 in item.children" :index="item.path + '/' + item1.path">{{ item1.meta.title }}</el-menu-item>
							</el-menu-item-group>
						</el-submenu> -->

						<el-submenu v-for="(item, index) in indexleft" :key="index" :index="item.path">
							<template slot="title">
								<i :class="qwer(item.meta, 'icon')"></i>
								<span slot="title">{{ qwer(item.meta, 'title') }}</span>
							</template>
							<el-menu-item-group>
								<el-menu-item v-for="item1 in item.children" :index="rewq(item.path, item1.path)">{{ qwer(item1.meta, 'title') }}</el-menu-item>
							</el-menu-item-group>
						</el-submenu>
					</el-menu>
				</el-aside>
				<el-container>
					<el-header
						style="display: inline-block;height: 105px;line-height: 90px;    border-bottom: 1px solid #d8dce5;
    -webkit-box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);"
					>
						<el-menu :default-active="this.$route.path" class="el-menu-demo" mode="horizontal">
							<el-menu-item index="1" class="el-menu-item">
								<el-radio-group v-model="isCollapse"><el-radio-button @click="open()">展开</el-radio-button></el-radio-group>
							</el-menu-item>
							<el-menu-item index="2" class="el-menu-item">
								<el-breadcrumb separator="/">
									<el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
									<el-breadcrumb-item v-for="item in TITLE">{{ item }}</el-breadcrumb-item>
								</el-breadcrumb>
							</el-menu-item>
							<el-submenu index="3" style="float: right;" class="el-menu-item">
								<template slot="title">
									<img src="../assets/1.gif" style="width:40px;height:40px;border-radius: 10px;" />
								</template>
								<el-menu-item index="2-1">选项1</el-menu-item>
								<el-menu-item index="2-2">选项2</el-menu-item>
								<el-menu-item index="2-3" @click="getupdata()">退出登录</el-menu-item>
							</el-submenu>
							<el-menu-item index="4" style="float: right;" class="el-menu-item">
								<div class="box_disapp_01">
									<el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
										<div class="box_right"><i class="el-icon-full-screen"></i></div>
									</el-tooltip>
									<el-tooltip class="item" effect="dark" content="布局大小" placement="bottom">
										<div class="box_right"><i class="el-icon-rank"></i></div>
									</el-tooltip>
									<el-tooltip class="item" effect="dark" content="通知中心" placement="bottom">
										<div class="box_right"><i class="el-icon-bell"></i></div>
									</el-tooltip>
								</div>
							</el-menu-item>
						</el-menu>
						<div id="Illustrations"><vTable :ontice="auther"></vTable></div>
					</el-header>
					<el-main><router-view></router-view></el-main>
				</el-container>
			</el-container>
		</div>
	</div>
</template>

<script>
import vTable from '../components/Resey/gortup.vue'
export default {
  data () {
    return {
      indexleft: [],
      // 定义一个空数组用来给父元素传值
      auther: [],
      // 组件
      name: 'v-Table',
      // 取反
      isCollapse: true,
      // 获取到路由数据并转递给上面
      TITLE: []
      // 导航栏
    }
  },
  comments: {
    hdah () {
      return global.antRouter
    }
  },
  mounted () {
    this.indexleft = global.antRouter
    console.log(this.indexleft, 11)
  },
  methods: {
    getupdata () {
      this.axios
        .post('http://192.168.1.54:8080/admin/auth/logout', {
          headers: {
            token: sessionStorage.getItem('token')
          }
        })
        .then(res => {
          console.log(res, '65654454654545465654546154')
          sessionStorage.clear()
          localStorage.clear()
          window.location.href = window.location.origin + window.location.pathname
          this.$router.push('/login')
        })
    },
    open () {
      this.isCollapse = !this.isCollapse
    },
    qwer (item, title) {
      const ite = Object.assign({}, item)
      return ite[title]
    },
    rewq (one, tow) {
      return one + '/' + tow
    }
  },
  components: {
    vTable
  },
  watch: {
    $route () {
      this.TITLE = []
      for (let i = 0; i < this.$route.matched.length; i++) {
        this.TITLE.push(this.$route.matched[i].meta.title)
      }
      this.auther.push({
        name: this.$route.matched[this.$route.matched.length - 1].meta.title,
        path: this.$route.matched[this.$route.matched.length - 1].meta.path
      })
    }
  },
  beforeMount () {
    this.TITLE = []
    for (let i = 0; i < this.$route.matched.length; i++) {
      this.TITLE.push(this.$route.matched[i].meta.title)
    }

    this.auther.push({
      name: this.$route.matched[this.$route.matched.length - 1].meta.title,
      path: this.$route.matched[this.$route.matched.length - 1].meta.path
    })
  }
}
</script>

<style scoped>
#Illustrations {
	width: 100%;
	height: 40px;
}
.box_right {
	display: inline-block;
	margin: 0 8px;
	line-height: 60px;
	vertical-align: top;
}
.box_disapp_01 {
	float: right;
	height: 100%;
}
.el-breadcrumb {
	display: inline-block;
	font-size: 14px;
	text-align: left;
	margin-left: 10px;
	float: left;
}
.el-divider--horizontal {
	display: flex;
	height: 1px;
	width: 100%;
	margin: 24px 0;
}
.mybox >>> .el-submenu {
	height: 50px;
	line-height: 50px;
}
.el-menu-item {
	height: 50px;
	line-height: 50px;
}
.el-aside {
	width: 100px;
	display: contents;
}
.el-breadcrumb[data-v-fae5bece] {
	text-align: left;
	margin-left: 0px;
	float: none;
}
.el-submenu__title {
	width: 200px;
}
</style>
