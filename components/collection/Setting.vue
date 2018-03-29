<template>
  <div class="setting-container">
    <div class="setting">
      <div class="header">
        <el-button type="text" icon="el-icon-arrow-left" @click="back()">返回</el-button>
      </div>
      <h2><i class="ion ion-android-settings"></i> 项目设置</h2>
      <div class="data-set">
        <el-form>
          <el-form-item label="项目名称">
            <el-input v-model="collection.name" size="small"></el-input>
          </el-form-item>
          <el-form-item label="是否公开">
            <el-radio-group v-model="collection.public">
              <el-radio :label=0>私有项目</el-radio>
              <el-radio :label=1>公开项目</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="项目描述">
            <el-input v-model="collection.description" :rows="3" type="textarea" size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <h2><i class="ion ion-android-social-user"></i> 成员管理</h2>
      <p class="power">
        <span v-if="collection.public === 0">已选成员拥有调试、查看文档权限</span>
        <span v-if="collection.public === 1">所有人都拥有查看文档权限，已选成员拥有调试权限</span>
      </p>
      <div class="select-header">
        <div class="title">所有成员</div>
        <div class="title">已选成员</div>
      </div>
      <div class="data-user">
        <div class="user-all">
          <ul>
            <li v-for="(user, index) in user.all" :key="index" @click="select(user.id)"><i class="ion ion-android-social-user"></i> {{user.username}}</li>
          </ul>
        </div>
        <div class="user-selected">
          <ul>
            <li v-for="(user, index) in user.selected" :key="index"><i class="ion ion-android-social-user"></i> {{user.username}}<i class="delete ion ion-android-close" @click="deleted(user.id)"></i></li>
          </ul>
        </div>
      </div>
      <div class="save"><el-button size="small" @click="update()">保存</el-button></div>
    </div>
  </div>
</template>
<script>

import Http from '../../api/index.js'

export default {
  data () {
    return {
      id: 0,
      collection: {},
      user: {
        all: [],
        selected: []
      }
    }
  },
  created () {
    let params = this.$route.params
    this.id = params.id
    Http.get('collection/data/' + params.id, null, response => {
      if (response.code > 0) {
        this.$message({
          message: response.message,
          type: 'error'
        })
        return false
      }
      this.collection = response.data.detail
      this.user.all = response.data.userAll
      this.user.selected = JSON.parse(response.data.detail.member)
    })
  },
  methods: {
    back () {
      this.$router.push('/collection/index')
    },
    select (id) {
      console.log(id)

      let username = ''

      for (let i in this.user.all) {
        if (this.user.all[i].id === id) {
          username = this.user.all[i].username
        }
      }

      for (let i in this.user.selected) {
        if (this.user.selected[i].id === id) {
          this.user.selected.splice(i, 1)
          return true
        }
      }

      this.user.selected.push({
        id: id,
        username: username
      })
    },
    deleted (id) {
      for (let i in this.user.selected) {
        if (this.user.selected[i].id === id) {
          console.log(i)
          this.user.selected.splice(i, 1)
          return true
        }
      }
    },
    update () {
      let data = {}
      data = this.collection
      data.id = this.id
      data.member = this.user.selected

      Http.post('collection/update', data, response => {
        if (response.code > 0) {
          this.$message({
            message: response.message,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style>
  body {
    background-color: #fafafa;
  }
  .setting-container {
    padding-top: 50px;
    padding-bottom: 50px;
  }
  .setting {
    width: 600px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #f0f0f0;
    box-sizing: border-box;
  }
  .setting .header {
    padding: 8px 30px;
    border-bottom: 1px solid #f0f0f0;
  }
  .setting h2 {
    font-size: 16px;
    padding: 20px 40px;
    color: #666;
  }
  .setting h2 i {
    color: #888;
  }
  .setting .data-set {
    padding: 0 40px;
  }
  .setting .power {
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 10px;
    padding-bottom: 10px;
    color: #999;
    font-size: 12px;
  }
  .setting .select-header {
    border-top: 1px solid #d8dce5;
    border-left: 1px solid #d8dce5;
    border-right: 1px solid #d8dce5;
    margin: 10px 40px 0px 40px;
    display: flex;
    border-radius: 4px 4px 0px 0px;
  }
  .setting .select-header .title {
    padding: 12px 30px;
    flex: 1;
  }
  .setting .select-header .title:first-child {
    border-right: 1px solid #d8dce5;
  }
  .setting .data-user {
    border: 1px solid #d8dce5;
    border-radius: 0px 0px 4px 4px;
    margin: 0px 40px 40px 40px;
    display: flex;
  }
  .setting .data-user ul li {
    list-style-type: none;
    padding-top: 9px;
    padding-bottom: 9px;
    padding-left: 9px;
    padding-right: 9px;
    color: #444;
    cursor: pointer;
    border-radius: 3px;
  }
  .setting .data-user ul li:hover {
    background-color: #F2F6FC;
  }
  .setting .data-user ul li i {
    color: #409EFF;
    padding-right: 10px;
  }
  .setting .data-user ul li i.delete {
    float: right;
    color: #ccc;
    padding-right: 0px;
  }
  .setting .data-user .user-all {
    flex: 1;
    padding: 20px;
    border-right: 1px solid #d8dce5;
    max-height: 300px;
    overflow-y: auto;
  }
  .setting .data-user .user-selected {
    flex: 1;
    padding: 20px;
    max-height: 300px;
    overflow-y: auto;
  }
  .setting .save {
    padding-left: 40px;
    padding-right: 40px;
    padding-bottom: 40px;
  }
</style>
