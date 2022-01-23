<template>
    <div>
        <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer" >
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>

            <el-form-item prop="password">
                <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>

            <el-form-item prop="code">
                <el-input type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更新4位字符的验证码" style="width: 250px; margin-right:5px"></el-input>
                <!-- 验证码图片 -->
                <img :src="captchaUrl" @click="updateCaptcha()">
            </el-form-item>

            <el-form-item>
                <!-- 登录按钮 -->
                <el-button type="primary" style="width:100%" @click="submitLogin('loginForm')">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "Login",
    data(){
        return{
            captchaUrl: '/captcha?time=' + new Date(),
            loginForm:{
                username:'admin',
                password:'123',
                code:''
            },
            rules:{
                username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
            }
        };
    },

    methods:{
        updateCaptcha(){
            this.captchaUrl = '/captcha?time=' + new Date();
        },
        submitLogin(loginForm){
            this.$refs[loginForm].validate((valid) => {
                if (valid) {
                    this.postRequest('/login', this.loginForm).then(resp=>{
                        if(resp){
                            // 存储用户token
                            const tokenStr = resp.obj.tokenHead+resp.obj.token;
                            window.sessionStorage.setItem('tokenStr', tokenStr);
                            // alert("/login请求登录成功，在session中存入了tokenStr，即将replace到/home");
                            // 跳转到Home页面，且不可回退 这里注销后点两次才能登录的bug需要解决
                            // 解决方法是：在这下面补充代码，还有完善main.js中的beforeEach()方法结尾部分
                            let path = this.$route.query.redirect;
                            this.$router.replace((path=='/'||path==undefined)?'/home':path);
                            // alert("理论上来说我已经跳转到/home了。。。。。")
                        }
                    })
                
                } else {
                    this.$message.error('无法提交:具有未填写的表单项!');
                    return false;
                }
            });
        }
    }
}
</script>


<style>
    .loginContainer{
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background-color: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .loginTitle{
        margin: 0px auto 30px auto;
        text-align: center;
    }

    /* 调整验证码图片的位置 */
    .el-form-item__content{
        display: flex;
        align-items: center;
    }

</style>