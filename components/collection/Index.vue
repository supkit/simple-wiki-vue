<template>
  <div class="collection">
    <header>
      <div class="container" v-if="isLogin === false">
        <img src="./../../assets/image/logo.svg">
        <span class="register-btn"><el-button type="text" size="small" @click="routeTo('/register')" plain>注册</el-button></span>
        <span class="login-btn"><el-button type="text" size="small" @click="routeTo('/login')" plain>登陆</el-button></span>
      </div>
      <div class="container" v-else>
        <img src="./../../assets/image/logo.svg">
        <span class="register-btn"><el-button type="text" size="small" @click="logout()" plain>退出</el-button></span>
        <span class="login-btn"><el-button type="text" size="small" plain>{{user.username}}</el-button></span>
      </div>
    </header>
    <section>
      <div class="collection-row container">
        <div class="search" v-if="isLogin === true">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addCollection" plain>添加项目</el-button>
        </div>
        <div class="collection-tab">
          <el-tabs type="card" v-model="addData.public">
            <el-tab-pane label="私有项目" :key="0">
              <div class="coll-empty" v-if="collections.private.length === 0 || isLogin === false">
                <i class="ion ion-cube"></i> <span v-if="isLogin === true">暂无数据</span><span v-else>请先登录</span>
              </div>
              <div v-else>
                <div v-for="(privateList, index) in collections.private" :key="index">
                  <el-row>
                    <el-col :span="6">
                      <div class="collection-name">
                        <div class="name">
                          <h2><i class="ion ion-filing"></i>{{privateList.name}}</h2>
                        </div>
                      </div>
                      <div class="time">最后更新时间：{{timestampToTime(privateList.updated)}}</div>
                    </el-col>
                    <el-col :span="10">
                      <div class="collection-desc">{{privateList.description}}</div>
                      <div class="view"><i class="ion ion-android-social-user"></i> <span>{{JSON.parse(privateList.member).length}}</span></div>
                    </el-col>
                    <el-col :span="8">
                      <div class="collection-action">
                        <el-button size="medium" @click="routeTo('/collection/setting/'+privateList.id)">设置</el-button><el-button size="medium" @click="routeTo('/collection/wiki/'+privateList.id)">文档</el-button><el-button size="medium" @click="routeTo('/collection/debug/'+privateList.id)">调试</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="公开项目" :key="1">
              <div class="coll-empty" v-if="collections.public.length === 0">
                <i class="ion ion-cube"></i> 暂无数据
              </div>
              <div v-else>
                <div v-for="(publicList, index) in collections.public" :key="index">
                  <el-row>
                    <el-col :span="6">
                      <div class="collection-name">
                        <div class="name">
                          <h2><i class="ion ion-filing"></i>{{publicList.name}}</h2>
                        </div>
                      </div>
                      <div class="time">最后更新时间：{{timestampToTime(publicList.updated)}}</div>
                    </el-col>
                    <el-col :span="10">
                      <div class="collection-desc">{{publicList.description}}</div>
                      <div class="view"><i class="ion ion-android-social-user"></i> <span>{{JSON.parse(publicList.member).length}}</span></div>
                    </el-col>
                    <el-col :span="8">
                      <div class="collection-action">
                        <el-button size="medium" @click="routeTo('/collection/setting/'+publicList.id)">设置</el-button><el-button size="medium" @click="routeTo('/collection/wiki/'+publicList.id)">文档</el-button><el-button size="medium" @click="routeTo('/collection/debug/'+publicList.id)">调试</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-tab-pane>
            
          </el-tabs>
        </div>
      </div>
    </section>
    <footer>
        <p>chenshuo.net</p>
    </footer>
    <!-- 添加项目 start -->
    <el-dialog title="添加项目" :visible.sync="dialogVisible" width="30%">
      <el-form label-width="80px">
        <el-form-item label="项目名称">
          <el-input size="small" v-model="name" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="访问控制">
          <el-radio-group v-model="addData.public">
            <el-radio label="0">私有项目</el-radio>
            <el-radio label="1">公开项目</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input size="small" type="textarea" v-model="description" placeholder="请输入项目描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addConllectionCall" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加项目 end -->
  </div>
</template>

<script>

import Http from '../../api/index.js'

export default {
  data () {
    return {
      dialogVisible: false,
      isLogin: false,
      name: '',
      description: '',
      user: [],
      addData: {
        name: '',
        public: '0',
        description: ''
      },
      collections: {
        public: [],
        private: []
      }
    }
  },
  created () {
    document.title = '项目管理'
    Http.get('collection/item', null, response => {
      this.collections = response.data
      this.user = response.data.user
      console.log(response.data)
      this.isLogin = response.data.isLogin
      if (!this.isLogin) {
        this.addData.public = '1'
      }
    })
  },
  methods: {
    routeTo (params) {
      this.$router.push(params)
    },
    logout () {
      localStorage.removeItem('token')
      this.$router.push({path: '/login'})
    },
    addCollection () {
      this.dialogVisible = true
    },
    timestampToTime (timestamp) {
      var date = new Date(timestamp * 1000)
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      var h = date.getHours() + ':'
      var m = date.getMinutes()
      return M + D + h + m
    },
    addConllectionCall () {
      this.addData.updated = '刚刚'
      this.addData.member = '[]'
      this.addData.name = this.name
      this.addData.description = this.description

      Http.post('collection/create', this.addData, response => {
        if (response.code > 0) {
          this.$message({
            message: response.message,
            type: 'error'
          })
          return false
        }
        let id = response.data.id
        this.$message({
          message: '项目 "' + this.name + '" 创建成功',
          type: 'success'
        })
        if (this.addData.public === '0') {
          this.collections.private.unshift({
            id: id,
            name: this.name,
            description: this.description,
            updated: Date.parse(new Date()) / 1000,
            member: '[]'
          })
        } else {
          this.collections.public.unshift({
            id: id,
            name: this.name,
            description: this.description,
            updated: Date.parse(new Date()) / 1000,
            member: '[]'
          })
        }

        this.name = ''
        this.description = ''
        this.dialogVisible = false
      })
    }
  }
}
</script>
<style>
  body {
    background-color: #fafafa;
  }
  .collection .el-tabs--card>.el-tabs__header {
    border: 0;
  }
  .collection .el-tabs--card>.el-tabs__header .el-tabs__nav {
    border-bottom: 1px solid #dfe4ed;
    border-radius: 4px;
  }
  .collection .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: transparent;
  }
  .collection .el-tabs--card>.el-tabs__header .el-tabs__item {
    border-bottom: none;
  }
  .collection .el-tabs__header {
    padding: 20px 20px 10px 20px;
  }
  .collection header {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #eee;
    background-color: #fff;
  }
  .collection .container {
    width: 90%;
    margin: 0 auto;
  }
  .collection img {
    display: inline-block;
    vertical-align: middle;
  }
  .collection-tab {
    padding-bottom: 10px;
  }
  .collection .search {
    position: absolute;
    right: 20px;
    top: 24px;
    z-index: 2;
  }
  .collection .collection-row {
    margin-top: 40px;
    background-color: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    margin-bottom: 40px;
    position: relative;
  }
  .collection .collection-row .collection-tab .el-row {
    padding: 20px;
    border-top: 1px solid #f0f0f0;
  }
  .collection .collection-row .collection-action {
    text-align: right;
  }
  .collection-name {
    color: #808080;
  }
  .collection-name h2 {
    margin-bottom: 12px;
    font-size: 16px;
  }
  .collection-name h2 i {
    padding-right: 10px;
    position: relative;
    top: 3px;
    color: #ccc;
    font-size: 24px;
  }
  .collection-row .time {
    font-size: 14px;
    color: #999;
  }
  .collection-row .view a {
    color: #409EFF;
    text-decoration: none;
  }
  .collection-desc {
    font-size: 14px;
    padding-top: 5px;
    padding-bottom: 10px;
    line-height: 1.5;
    color: #888;
  }
  .collection .view {
    color: #ccc;
  }
  footer p {
    text-align: center;
    line-height: 5;
    color: #ccc;
  }
  .empty {
    height: 100px;
    line-height: 100px;
    text-align: center;
    color: #ccc;
    font-size: 14px;
  }
  .collection .login-btn, .collection .register-btn {
    float: right;
    color: #999;
  }
  .collection .register-btn {
    margin-left: 10px;
  }
  .collection .coll-empty {
    text-align: center;
    padding-top: 80px;
    padding-bottom: 100px;
    color: #ccc;
    font-size: 14px;
  }
</style>
