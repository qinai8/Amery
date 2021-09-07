import axios from 'axios';
import Cookies from 'js-cookie';  
import Base from '../../Base64.js'; 
import router from "@/router";

const instance = axios.create({
    baseURL: 'http://192.168.1.54:8080', //url
    timeout: 5000,//请求超时
});


// 添加请求拦截器  记得return
instance.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    // 给每个请求添加token
	config.headers['X-Litemall-Admin-Token']= Cookies.get('token')
    // config.headers['AdminToken'] = Cookies.get('token');
    return config;
  }, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器---令牌刷新
instance.interceptors.response.use(function (response) {
  //把重新登录之后的token重新赋值给请求头
  let errno = response.data.errno  //拿到响应数据
  if(errno==501){ 
    let account = Cookies.get('account')
    let password = Base.decode( Cookies.get('password'))
    if(account != ''){  //如果是记住密码
      return login(account, password,response) //调用函数刷新令牌
    }else{   //否则跳回到登录页面
       router.replace('/')
    }
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

async function login(account, password,response){
  await instance({
    method:'get',
	url:'/admin/auth/login',
    data:{
      username : account,
      password : password
    }
  }).then((res)=>{
		  if(res.data.errmsg=='成功'){
          window.sessionStorage.setItem('token', res.data.data.token)
		  }
  })
  const req = await axios.request(response.config) // 重新执行原请求
   return req
}


export default instance