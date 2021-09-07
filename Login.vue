<template>
	<div class="textsBox">
		<div class="sub-title">管理员登录</div>
		<el-form :model="ruleForm" status-icon  ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item prop="checkPass"><el-input type="text" v-model="ruleForm.account" placeholder="管理员账户" autocomplete="off"></el-input></el-form-item>
			<el-form-item prop="pass"><el-input type="password" v-model="ruleForm.password" placeholder="管理员密码" autocomplete="off"></el-input></el-form-item>
			<el-form-item><el-checkbox style="color:#a0a0a0;margin-top:-10px;" v-model="ruleForm.remember">记住密码</el-checkbox></el-form-item>
			<el-form-item><el-button type="primary" @click="show()" style="width: 400px;">提交</el-button></el-form-item>
		</el-form>
		<div class="active">
			<ul>
				<li class="el-table--striped_01">
					超级管理员用户名: admin123 超级管理员用户名：admin123 商城管理员用户名: mall123 商城管理员用户名：mall123 推广管理员用户名: promotion123
					推广管理员用户名：promotion123
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import Base64 from '../../Base64.js'
// const Base64 = require('js-base64').Base64
export default {
  data () {
    return {
      ruleForm: {
        account: '',
        password: '',
        remember: ''
      }
    }
  },
  created () {
    // 在页面加载时从cookie获取登录信息
    const account = this.getCookie('account')
    const password = Base64.decode(this.getCookie('password'))
    console.log(password)
    // 如果存在赋值给表单，并且将记住密码勾选
    if (account) {
      this.ruleForm.account = account
      this.ruleForm.password = password
      this.ruleForm.remember = true
    }
  },
  methods: {
    // 管理员信息
    kityo () {
      const that = this
      this.axios
        .get('http://192.168.1.54:8080/admin/auth/info', {
          headers: {
            'X-Litemall-Admin-Token': that.getCookie('token')
          }
        })
        .then(res => {
          window.sessionStorage.setItem('perms', res.data.data.perms)
          that.$router.push('/home')
        })
    },
    show () {
      this.axios
        .post('http://192.168.1.54:8080/admin/auth/login', {
          username: this.ruleForm.account,
          password: this.ruleForm.password
        })
        .then(res => {
          this.setCookie('token', res.data.data.token)
          // 跳转到首页
          this.$router.push('/about')
          // 储存登录信息
          this.setUserInfo()
          sessionStorage.setItem('token', res.data.data.token)
          this.kityo()
        })
      if (this.mess) {
        this.mess.close()
      }
      this.mess = this.$message('登录成功')
    },
    setUserInfo: function () {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
      // 如果没有勾选，储存的信息为空
      if (this.ruleForm.remember) {
        this.setCookie('account', this.ruleForm.account, 7)
        // base64加密密码
        const passWord = Base64.encode(this.ruleForm.password)
        this.setCookie('password', passWord, 7)
      } else {
        this.setCookie('account', '')
        this.setCookie('password', '')
      }
    },
    getCookie: function (key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + '=')
        if (start !== -1) {
          start = start + key.length + 1
          var end = document.cookie.indexOf(';', start)
          if (end === -1) end = document.cookie.length
          return unescape(document.cookie.substring(start, end))
        }
      }
      return ''
    },
    // 保存cookie
    setCookie: function (cName, value, expiredays) {
      var exdate = new Date()
      exdate.setDate(exdate.getDate() + expiredays)
      document.cookie = cName + '=' + decodeURIComponent(value) + (expiredays == null ? '' : ';expires=' + exdate.toGMTString())
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style type="text/css">
.textsBox {
	width: 500px;
	margin: 0 auto;
	padding: 160px 35px 0;
}
.sub-title {
	height: 60px;
	font-size: 20px;
	text-align: center;
	margin-left: 80px;
	color: burlywood;
}
.el-table--striped_01 {
	width: 403px;
	/* height: 84px; */
	margin: auto;
	list-style: none;
	margin-left: 100px;
	font-size: 14px;
}
</style>
