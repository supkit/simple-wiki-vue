<template>
  <div class="register">
    <div class="section">
      <div class="logo">
        <img src="./../assets/image/logo.svg">
      </div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
        <el-form-item prop="account">
          <el-input
            placeholder="请输入邮箱地址" v-model="ruleForm.account">
            <i slot="prefix" class="el-input__icon ion-android-mail"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            placeholder="请输入姓名" v-model="ruleForm.username">
            <i slot="prefix" class="el-input__icon ion-android-social-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码" type="password" v-model="ruleForm.password">
            <i slot="prefix" class="el-input__icon ion-locked"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100%;">注册</el-button>
        </el-form-item>
        <div class="back">
          <router-link to="/login">已有账号？登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  import Http from '../api/index.js'

  export default {
    data () {
      return ({
        ruleForm: {
          account: '',
          username: '',
          password: '',
          auto: true
        },
        rules: {
          account: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { min: 4, max: 40, message: '长度在 4 到 40 个字符', trigger: 'blur,change' }
          ],
          username: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur,change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur,change' }
          ]
        }
      })
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let postData = {
              account: this.ruleForm.account,
              username: this.ruleForm.username,
              password: this.ruleForm.password
            }
            Http.post('account/register', postData, response => {
              console.log(response)
              if (response.code > 0) {
                this.$message({
                  message: response.message,
                  type: 'error'
                })
                return false
              }
              this.$message({
                message: '恭喜，注册成功，请通知管理员审核',
                type: 'success'
              })
              this.$router.push({path: '/login'})
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style>
  .register .logo {
    text-align: center;
    padding-bottom: 40px;
  }
  .register {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #F0F2F5;
    background-image: url(../assets/image/login-bg.svg);
    width: 100%;
    min-height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
  }
  .register .section {
    width: 280px;
    background-color: #fff;
    padding: 40px 45px 20px 45px;
    border-radius: 3px;
    margin-bottom: 20px;
    box-shadow: 0px 0px 14px #eee;
  }
  .register .ion-android-social-user, .ion-locked {
    position: relative;
    top: 1px;
  }
  .register .back-login {
    padding-bottom: 10px;
  }
  .register .back-login a {
    color: #409EFF;
    text-decoration: none;
  }
  .register .back a {
    color: #409EFF;
    text-decoration: none;
  }
</style>

