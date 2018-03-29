<template>
  <div class="wiki">
    <div class="wiki-aside">
      <div class="asider-header">
        <div class="coll-name">{{collection.name}}<span class="as-header-debug" @click="debug()"><i class="el-icon-edit"></i></span></div>
      </div>

      <div class="asider-body">
        <div class="item-container">
          <div class="as-body-item" v-for="(category, index) in categoryList" :key="index">
            <h4 @click="displayItem(index)">
              <span class="folder"><i :class="category.icon"></i></span>
              <span class="name">{{category.name}}</span>
            </h4>
            <ul v-show="category.open">
              <li v-for="(item, index) in category.item" :key="index" @click="selectDocument(item.id)"><span class="POST">{{item.requestMethod}}</span>{{item.name}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="wiki-section">
      <div class="wiki-container">
        <div class="doc-request" v-if="requestUrl">
          <h1><span class="api-name">{{doc.name}}</span></h1>
          <blockquote>
            <p>更新时间：{{timestampToTime(updateTime)}}</p>
          </blockquote>
          <h2>接口地址</h2>
          <pre v-if="requestUrl">{{requestUrl}}</pre>
          <h2>请求方式</h2>
          <span class="api-method">{{requestMethod}}</span>
          <div class="request">
            <h2>请求头</h2>
            <el-table :data="requestHeader" border style="width: 100%" size="medium">
              <el-table-column label="Key" width="300">
                <template slot-scope="scope">
                  {{scope.row.key}}
                </template>
              </el-table-column>
              <el-table-column
                label="Value">
                <template slot-scope="scope">
                  {{scope.row.value}}
                </template>
              </el-table-column>
              <el-table-column label="启用" width="120">
                <template slot-scope="scope">
                  {{scope.row.enable}}
                </template>
              </el-table-column>
            </el-table>
              
            <h2>请求参数</h2>
            <div class="request-input">
              <el-table :data="requestBody" border style="width: 100%" size="medium">
                <el-table-column label="字段名称" width="180">
                  <template slot-scope="scope">
                    {{scope.row.key}}
                  </template>
                </el-table-column>
                <el-table-column label="必填" width="100">
                  <template slot-scope="scope">
                    {{scope.row.enable ? '是' : '否'}}
                  </template>
                </el-table-column>
                <el-table-column label="类型" width="180">
                  <template slot-scope="scope">
                    int
                  </template>
                </el-table-column>
                <el-table-column
                  label="描述">
                  <template slot-scope="scope">
                    {{scope.row.desc}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="preview-json" v-if="requestContentType === '3'">
              <h2>请求JSON</h2>
              <pre>{{jsonPreview}}</pre>
            </div>
          </div>  
        </div>
        <div class="doc-response" v-if="requestUrl">
          <h2>结果示例</h2>
          <pre v-if="this.doc.responseType === 'json'">{{responseData}}</pre>
          <pre v-if="this.doc.responseType === 'html'">Html page</pre>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .wiki .coll-name {
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }
  .wiki blockquote {
    padding: 0.2em 1em;
    color: #8e959c;
    border-left: 0.25em solid #dfe2e5;
  }
  .wiki blockquote p {
    line-height: 1.5;
  }
  .wiki h1 {
    font-size: 24px;
    margin-bottom: 30px;
    color: #000;
  }
  .wiki h2 {
    font-size: 18px;
    color: #444;
    margin-bottom: 20px;
    margin-top: 40px;
  }
  .wiki h3 {
    color: #666;
    padding-bottom: 20px;
  }
  .wiki h4 {
    line-height: 2;
    color: #444;
  }
  
  .wiki .api-name {
    display: inline-block;
    height: 24px;
    line-height: 22px;
  }
  .wiki-aside {
    width: 280px;
    border-right: 1px solid #eee;
    background-color: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
  }
  .wiki-section {
    position: fixed;
    left: 280px;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: #ffffff;
    overflow-y: auto;
  }
  .wiki-container {
    padding: 40px;
  }
  .wiki pre {
    border: 1px solid #ebebec;
    background-color: #fff;
    color: #d14;;
    padding: 10px;
    border-radius: 3px;
    font-size: 14px;
    overflow: auto;
  }
  .wiki .asider-header {
    color: #555;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eee;
    padding-left: 10px;
    padding-right: 10px;
  }
  .wiki .asider-header h2 {
    font-size: 16px;
  }
  .wiki .as-header-debug {
    float: right;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
  }
  .wiki .as-header-back {
    padding-right: 15px;
    cursor: pointer;
  }
  
  .wiki .asider-body {
    position: absolute;
    top: 50px;
    bottom: 0;
    width: 100%;
  }
  .wiki .as-body-item {
    border-bottom: 1px solid #eee;
  }
  .wiki .item-container {
    height: 100%;
    overflow-y: auto;
  }
  .wiki .item-container::-webkit-scrollbar {
    width: 5px;
    border-radius: 0;
    background-color: #f5f5f5;
  }
  .wiki .item-container::-webkit-scrollbar-thumb {
    border-radius: 0;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0 , 0, 0.5);
    background-color: #999;
  }
  .wiki .asider-body h4 {
    font-size: 14px;
    padding-bottom: 10px;
    padding-right: 15px;
    padding-top: 10px;
    position: relative;
    padding-left: 40px;
    padding-right: 40px;
  }
  .wiki .asider-body h4 i {
    padding-right: 10px;
    color: #ddd;
    font-size: 20px;
    position: absolute;
  }
  .wiki .asider-body h4 .folder i {
    top: 4px;
    left: 12px;
  }
  .wiki .asider-body h4 .el-dropdown {
    position: absolute;
    top: 14px;
    right: 30px;
  }
  .wiki .asider-body ul {
    padding-bottom: 10px;
  }
  .wiki .asider-body ul li {
    list-style-type: none;
    padding-top: 9px;
    padding-bottom: 9px;
    color: #444;
    font-size: 14px;
    padding-left: 15px;
    padding-right: 15px;
    cursor: pointer;
  }
  .wiki .asider-body ul li:hover {
    background-color: #f5f5f5;
    color: #000;
  }
  .wiki .asider-body ul li span {
    display: inline-block;
    width: 40px;
    font-weight: bold;
    color: #3eb63e;
    padding-right: 6px;
    font-family: "Open Sans", sans-serif;
    font-size: 12px;
  }
  .wiki .asider-body ul li span.get {
    color: #3eb63e;
  }
  .wiki .asider-body ul li span.post {
    color: #f5a623;
  }
  .wiki .asider-body ul li span.put {
    color: #4a90e2;
  }
  .wiki .asider-body ul li span.delete {
    color: #ed4b48;
  }
  
  .wiki .to-json {
    margin-top: 5px;
    float: right;
  }
  .wiki .preview-json {
    margin-top: 20px;
  }
  .wiki .response {
    padding: 0 40px 40px 40px;
  }
  .wiki .api-method {
    border: 1px solid #ebebec;
    background-color: #fff;
    color: #d14;
    padding: 8px 10px;
    display: inline-block;
    border-radius: 4px;
  }
</style>
<script>
  import Http from '../../api/index.js'

  export default {
    data () {
      return {
        collectionId: 0,
        updateTime: 0,
        documentId: 0,
        collection: {},
        categoryList: [],
        doc: {},
        categoryIndex: 0,
        jsonPreview: '',
        requestContentType: '2',
        dialogVisible: false,
        responseData: '',
        // request
        requestMethod: 'GET',
        requestHeader: [],
        requestBody: [],
        requestUrl: ''
      }
    },
    created () {
      document.title = '项目调试'
      this.collectionId = this.$route.params.id
      Http.get('/category/list/' + this.collectionId, null, response => {
        this.categoryList = response.data.category
        this.collection = response.data.collection

        // 如果是空的分组
        if (this.categoryList.length === 0) {
          return true
        }
        // 如果分组下没有接口列表
        if (this.categoryList[0].item.length === 0) {
          return true
        }

        if (this.categoryList.length > 0) {
          let firstItem = this.categoryList[0].item[0]
          console.log(firstItem)
          this.documentId = firstItem.id
          this.doc = firstItem
          this.requestHeader = JSON.parse(firstItem.requestHeader)
          this.requestBody = JSON.parse(firstItem.requestBody)
          this.requestUrl = firstItem.requestUrl
          this.requestMethod = firstItem.requestMethod
          this.updateTime = firstItem.updateTime
          this.requestContentType = firstItem.requestContentType.toString()
          this.toJsonCall()
          if (this.doc.responseType === 'json') {
            this.responseData = JSON.stringify(JSON.parse(firstItem.response), null, 2)
          }
        }
        document.title += ' - ' + this.collection.name
      })
    },
    methods: {
      // 返回项目有首页
      back () {
        this.$router.push('/collection/index')
      },
      debug () {
        this.$router.push('/collection/debug/' + this.collectionId)
      },
      // 分组展开与隐藏
      displayItem (id) {
        if (this.categoryList[id].open) {
          this.categoryList[id].open = false
          this.categoryList[id].icon = 'md md-folder'
        } else {
          this.categoryList[id].open = true
          this.categoryList[id].icon = 'md md-folder-open'
        }
      },
      toJsonCall () {
        let data = {}
        for (let i in this.requestBody) {
          data[this.requestBody[i].key] = this.requestBody[i].value
        }
        this.jsonPreview = JSON.stringify(data, null, 2)
      },
      timestampToTime (timestamp) {
        var date = new Date(timestamp * 1000)
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes()
        return M + D + h + m
      },
      selectDocument (id) {
        console.log(id)
        this.documentId = id
        Http.get('document/data/' + id, null, response => {
          console.log(response)
          this.doc = response.data
          this.requestUrl = response.data.requestUrl
          this.updateTime = response.data.updateTime
          this.requestMethod = response.data.requestMethod
          this.requestHeader = JSON.parse(response.data.requestHeader)
          this.requestBody = JSON.parse(response.data.requestBody)
          this.requestContentType = response.data.requestContentType.toString()
          if (this.doc.responseType === 'json') {
            this.toJsonCall()
            this.responseData = JSON.stringify(JSON.parse(response.data.response), null, 2)
          }
        })
      }
    }
  }
</script>
