<template>
  <div class="debug">
    <div class="debug-aside">
      <div class="asider-header">
        <h2><span class="as-header-back" @click="back()"><i class="el-icon-arrow-left"></i></span>{{collection.name}}<span class="as-header-add" @click="addCategory()"><i class="el-icon-plus"></i></span></h2>
      </div>

      <div class="asider-body">
        <div class="item-container" v-if="categoryList">
          <div class="as-body-item" v-for="(category, index) in categoryList" :key="index">
            <h4 @click="displayItem(index)">
              <span class="folder"><i :class="category.icon"></i></span>
              <span class="name">{{category.name}}</span>
              <el-dropdown trigger="hover" szie="small" @command="categoryAction">
                <span class="el-dropdown-link">
                  <i class="ion ion-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="[index, 'add']"><i class="el-icon-plus"></i> 添加</el-dropdown-item>
                  <el-dropdown-item :command="[index, 'edit']" ><i class="el-icon-edit"></i> 编辑</el-dropdown-item>
                  <el-dropdown-item :command="[index, 'delete']" divided><i class="el-icon-delete"></i> 删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </h4>
            <ul v-show="category.open" >
              <li v-for="(item, index) in category.item" :key="index" @click="selectDocument(item.id)"><span :class="item.requestMethod">{{item.requestMethod}}</span>{{item.name}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="debug-section" v-if="this.categoryList.length > 0 && this.categoryList[0].item !== undefined && this.categoryList[0].item.length > 0">
      <div class="debug-container">
        <div v-if="requestMethod">
          <h3><el-tag type="success" size="small">{{requestMethod}}</el-tag><span class="api-name">{{doc.name}}</span></h3>
          <div>
            <el-input placeholder="请输入请求URL" v-model="requestUrl" class="input-with-select">
              <el-select v-model="requestMethod" slot="prepend" placeholder="请求方式">
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
                <el-option label="PUT" value="PUT"></el-option>
                <el-option label="DELETE" value="DELETE"></el-option>
              </el-select>
              <el-button slot="append" @click="send">发送</el-button>
            </el-input>
          </div>
          <div class="request">
          <el-tabs v-model="activeName">
            <el-tab-pane label="请求头" name="1">
              <el-table :data="requestHeader" border style="width: 100%" size="medium">
                <el-table-column label="Key" width="300">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.key" placeholder="请输入内容"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Value">
                  <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.value" placeholder="请输入内容"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="启用" width="60">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.enable">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="删除" width="60" align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-delete" @click="deleteHeader(scope.$index)"></i>
                  </template>
                </el-table-column>
              </el-table>
              <div class="add-body">
                <el-button @click="addHeader" size="mini"><i class="el-icon-plus"></i></el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="请求体" name="2">
              <div class="request-body-type">
                <el-radio-group v-model="requestContentType" size="small" @change="changeReuqestType">
                  <el-radio label="1" border>form-data</el-radio>
                  <el-radio label="2" border>x-www-form-urlencoded</el-radio>
                  <el-radio label="3" border>json</el-radio>
                </el-radio-group>
              </div>
              <div class="request-input">
                <el-table :data="requestBody" border style="width: 100%" size="medium">
                  <el-table-column label="必填" width="60" align="center">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.enable"></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="Key" width="180">
                    <template slot-scope="scope">
                      <el-input size="small" v-model="scope.row.key" placeholder="请输入内容"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="Type" width="150">
                    <template slot-scope="scope">
                       <el-select v-model="scope.row.type" @change="changeFormType(scope.row.type, scope.$index)" placeholder="格式" size="small">
                        <el-option v-for="item in formTypes"
                                  :key="item"
                                  :label="item"
                                  :value="item">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="Value" width="240">
                    <template slot-scope="scope">
                      <div v-if="scope.row.type === 'text' || scope.row.type === 'timestamp'"><el-input size="small" v-model="scope.row.value" placeholder="请输入内容"></el-input></div>
                      <div v-if="scope.row.type === 'date'">
                        <el-date-picker
                          size="small"
                          v-model="scope.row.value"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd">
                        </el-date-picker>
                      </div>
                      <div v-if="scope.row.type === 'datetime'">
                        <el-date-picker
                          size="small"
                          v-model="scope.row.value"
                          type="datetime"
                          placeholder="选择日期时间"
                          format="yyyy-MM-dd HH:mm"
                          value-format="yyyy-MM-dd HH:mm">
                        </el-date-picker>
                      </div>
                      <div v-if="scope.row.type === 'textarea'">
                        <el-input size="small" type="textarea" :rows="1" placeholder="请输入内容"></el-input>
                      </div>
                    </template>
                  </el-table-column>
                  
                  <el-table-column
                    label="Description">
                    <template slot-scope="scope">
                      <el-input size="small" v-model="scope.row.desc" placeholder="字段描述"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="删除" width="60" align="center">
                    <template slot-scope="scope">
                      <i class="el-icon-delete" @click="deleteBody(scope.$index)"></i>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="add-body">
                  <el-button @click="addBody('formData')" size="mini"><i class="el-icon-plus"></i></el-button>
                </div>
              </div>

              <div class="preview-json" v-if="requestContentType === '3'">
                <pre>{{jsonPreview}}</pre>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        </div>  
        
      </div>
   
      <div class="response">
        <h2>响应结果 <span>Status: {{responseHttpCode}}</span></h2>
        <pre v-if="responseType === 'json'">{{responseData}}</pre>
        <div v-if="responseType === 'html'">
          <iframe :src="responseHtml+documentId+'.html'+random" class="html" frameborder="0"></iframe>
        </div>
      </div>
    </div>

    <!-- 添加分组 start -->
    <el-dialog title="添加分组" :visible.sync="dialogVisible" width="30%">
      <el-form>
        <el-form-item label="分组名称">
          <el-input size="small" v-model="newCategoryName" placeholder="请输入分组名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addCategoryCall" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分组 end -->

    <!-- 修改分组 start -->
    <el-dialog title="修改分类" :visible.sync="dialogEditVisible" width="30%">
      <el-form>
        <el-form-item label="分类名称">
          <el-input size="small" v-model="editCategoryName" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="editCategoryCall" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分组 end -->

    <!-- 添加接口项 start -->
    <el-dialog title="添加接口" :visible.sync="dialogApiVisible" width="30%">
      <el-form>
        <el-form-item label="接口名称">
          <el-input size="small" v-model="newApiName" placeholder="请输入接口名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogApiVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addApiCall" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加接口项 end -->
  </div>
</template>
<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .debug h3 {
    color: #666;
    padding-bottom: 20px;
  }
  .debug h4 {
    line-height: 2;
    color: #444;
  }
  .debug .el-tag {
    float: left;
    margin-right: 10px;
  }
  .debug .api-name {
    display: inline-block;
    height: 24px;
    line-height: 22px;
  }
  .debug-aside {
    width: 280px;
    border-right: 1px solid #eee;
    background-color: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
  }
  .debug-section {
    position: fixed;
    left: 280px;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: #ffffff;
    overflow-y: auto;
  }
  .debug-container {
    padding: 30px;
  }
  .debug pre {
    border: 1px solid #ebebec;
    background-color: #fff;
    color: #d14;;
    padding: 10px;
    border-radius: 3px;
    font-size: 14px;
    overflow: auto;
  }
  .debug .request-body-type {
    margin-bottom: 20px;
  }
  .debug .add-body {
    margin-top: 20px;
  }
  .debug .asider-header {
    color: #555;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eee;
    padding-left: 10px;
    padding-right: 10px;
  }
  .debug .asider-header h2 {
    font-size: 16px;
  }
  .debug .as-header-add {
    float: right;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
  }
  .debug .as-header-back {
    padding-right: 15px;
    cursor: pointer;
  }
  .debug .el-dialog__body {
    padding: 0 20px;
  }
  .debug .asider-body {
    position: absolute;
    top: 50px;
    bottom: 0;
    width: 100%;
  }
  .debug .item-container {
    height: 100%;
    overflow-y: auto;
  }
  .debug .item-container::-webkit-scrollbar {
    width: 5px;
    border-radius: 0;
    background-color: #f5f5f5;
  }
  .debug .item-container::-webkit-scrollbar-thumb {
    border-radius: 0;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0 , 0, 0.5);
    background-color: #999;
  }
  .debug .asider-body h4 {
    font-size: 14px;
    padding-bottom: 10px;
    padding-right: 15px;
    padding-top: 10px;
    position: relative;
    padding-left: 40px;
    padding-right: 40px;
  }
  .debug .asider-body h4 i {
    padding-right: 10px;
    color: #ddd;
    font-size: 20px;
    position: absolute;
  }
  .debug .asider-body h4 .folder i {
    top: 4px;
    left: 12px;
  }
  .debug .asider-body h4 .el-dropdown {
    position: absolute;
    top: 14px;
    right: 30px;
  }
  .debug .asider-body ul li {
    list-style-type: none;
    padding-top: 9px;
    padding-bottom: 9px;
    color: #444;
    font-size: 14px;
    padding-left: 15px;
    padding-right: 15px;
    cursor: pointer;
  }
  .debug .asider-body ul li:hover {
    background-color: #f5f5f5;
    color: #000;
  }
  .debug .asider-body ul li span {
    display: inline-block;
    width: 40px;
    font-weight: bold;
    color: #3eb63e;
    padding-right: 6px;
    font-family: "Open Sans", sans-serif;
    font-size: 12px;
  }
  .debug .asider-body ul li span.get {
    color: #3eb63e;
  }
  .debug .asider-body ul li span.post {
    color: #f5a623;
  }
  .debug .asider-body ul li span.put {
    color: #4a90e2;
  }
  .debug .asider-body ul li span.delete {
    color: #ed4b48;
  }
  .debug .as-body-item {
    border-bottom: 1px solid #eee;
  }
  .debug .as-body-item ul {
    padding-bottom: 10px;
  }
  .debug .to-json {
    margin-top: 5px;
    float: right;
  }
  .debug .preview-json {
    margin-top: 20px;
  }
  .debug .response {
    padding: 30px;
  }
  .debug .response .html {
    height: 500px;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 3px;
    width: 100%;
    box-sizing: border-box;
  }
  .debug .response h2 {
    margin-bottom: 15px;
    font-size: 16px;
    color: #2d2f33;
  }
  .debug .response h2 span {
    font-size: 12px;
    padding-left: 20px;
    color: #888;
  }
</style>
<script>
  import Http from '../../api/index.js'

  export default {
    data () {
      return {
        collectionId: 0,
        documentId: 0,
        collection: {},
        categoryList: [],
        doc: {},
        categoryIndex: 0,
        newCategoryName: '',
        editCategoryName: '',
        jsonPreview: '',
        newApiName: '',
        requestContentType: '2',
        activeName: '2',
        dialogEditVisible: false,
        dialogApiVisible: false,
        dialogVisible: false,
        formType: 'text',
        // request
        requestUrl: '',
        requestMethod: 'GET',
        requestHeader: [],
        requestBody: [],
        // response
        responseData: '',
        responseType: 'json',
        responseHttpCode: 200,
        random: '',
        responseHtml: 'http://frame.com/response/html/',
        formTypes: [
          'text',
          'date',
          'datetime',
          'timestamp',
          'textarea'
        ]
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

          this.documentId = firstItem.id
          this.doc = firstItem
          this.requestHeader = JSON.parse(firstItem.requestHeader)
          this.requestBody = JSON.parse(firstItem.requestBody)
          this.requestMethod = firstItem.requestMethod
          this.requestUrl = firstItem.requestUrl
          this.requestContentType = firstItem.requestContentType.toString()
          this.responseData = JSON.stringify(JSON.parse(firstItem.response), null, 2)
          if (this.requestContentType === '3') {
            this.toJsonCall()
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
      // 添加分组
      addCategory () {
        this.dialogVisible = true
      },
      // 添加分组回调
      addCategoryCall () {
        let newAddName = this.newCategoryName

        let data = {
          name: newAddName,
          collectionId: this.collectionId
        }

        Http.post('/category/create', data, response => {
          this.categoryList.push({
            id: response.data.id,
            name: newAddName,
            icon: 'md md-folder',
            item: []
          })
          this.newCategoryName = ''
          this.dialogVisible = false
        })
      },
      // 编辑分组回调
      editCategoryCall () {
        let newName = this.editCategoryName
        Http.put('category/update', {
          name: newName,
          id: this.categoryList[this.categoryIndex].id
        }, response => {
          this.categoryList[this.categoryIndex].name = newName
          this.dialogEditVisible = false
        })
      },
      // 增加接口回调
      addApiCall () {
        let newAddName = this.newApiName
        let data = {
          categoryId: this.categoryList[this.categoryIndex].id,
          name: this.newApiName
        }
        Http.post('document/create', data, response => {
          this.categoryList[this.categoryIndex].open = true
          this.categoryList[this.categoryIndex].icon = 'md md-folder-open'
          this.categoryList[this.categoryIndex].item.push(
            {
              id: response.data.id,
              requestMethod: 'GET',
              name: newAddName
            }
          )
          this.newApiName = ''
          this.dialogApiVisible = false
        })
      },
      // 增加请求头
      addHeader () {
        this.requestHeader.push({
          enable: true,
          key: '',
          value: ''
        })
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
      // 增加请求体
      addBody (type) {
        this.requestBody.push({
          enable: true,
          type: 'text',
          key: '',
          value: '',
          desc: ''
        })
      },
      toJsonCall () {
        let data = {}
        for (let i in this.requestBody) {
          data[this.requestBody[i].key] = this.requestBody[i].value
        }
        this.jsonPreview = JSON.stringify(data, null, 2)
      },
      handleCommand (event) {
        console.log(event)
      },
      // 分组操作
      categoryAction (param) {
        let index = param[0]
        let action = param[1]
        this.categoryIndex = index

        // 添加分组
        if (action === 'add') {
          this.dialogApiVisible = true
          return true
        }

        // 编辑分组
        if (action === 'edit') {
          this.dialogEditVisible = true
          this.editCategoryName = this.categoryList[index].name
          return true
        }

        // 删除分组
        if (action === 'delete') {
          if (this.categoryList[index].item.length) {
            this.$message({
              message: '无法删除，请先删除该分类下的接口',
              type: 'error'
            })

            return false
          }

          let id = this.categoryList[index].id

          Http.delete('category/delete/' + id, null, response => {
            let name = this.categoryList[index].name
            this.$message({
              message: '分组：' + name + '，删除成功',
              type: 'success'
            })
            this.categoryList.splice(index, 1)
          })
        }
      },
      // 删除header头
      deleteHeader (index) {
        this.requestHeader.splice(index, 1)
      },
      deleteBody (index) {
        this.requestBody.splice(index, 1)
      },
      // 切换请求类型
      changeReuqestType () {
        // let headers = this.requestHeader
        if (this.requestContentType === '3') {
          this.toJsonCall()
        }

        for (let i = 0; i < this.requestHeader.length; i++) {
          if (this.requestHeader[i].key === 'Content-Type' && this.requestContentType === '1') {
            this.requestHeader[i].value = 'application/form-data'
          }

          if (this.requestHeader[i].key === 'Content-Type' && this.requestContentType === '2') {
            this.requestHeader[i].value = 'application/x-www-form-urlencoded'
          }

          if (this.requestHeader[i].key === 'Content-Type' && this.requestContentType === '3') {
            this.requestHeader[i].value = 'application/json'
          }
        }
      },
      changeFormType (type, index) {
        // 时间戳
        if (type === 'timestamp') {
          this.requestBody[index].value = (new Date()).getTime()
          return true
        }

        // 时间类型
        if (type === 'date' || type === 'datetime') {
          let date = new Date()
          let year = date.getFullYear()
          let month = date.getMonth()
          let today = date.getDate()
          let hour = date.getHours()
          let minute = date.getMinutes()
          if (type === 'date') {
            this.requestBody[index].value = year + '-' + month + '-' + today
            return true
          }

          if (type === 'datetime') {
            this.requestBody[index].value = year + '-' + month + '-' + today + ' ' + hour + ':' + minute
            return true
          }
        }
        this.requestBody[index].value = ''
      },
      selectDocument (id) {
        console.log(id)
        this.documentId = id
        Http.get('document/data/' + id, null, response => {
          console.log(response)
          this.doc = response.data
          this.requestUrl = response.data.requestUrl
          this.requestMethod = response.data.requestMethod
          this.requestHeader = JSON.parse(response.data.requestHeader)
          this.requestBody = JSON.parse(response.data.requestBody)
          this.requestContentType = response.data.requestContentType.toString()
          if (response.data.responseType === 'json') {
            this.responseType = 'json'
            this.responseData = JSON.stringify(JSON.parse(response.data.response), null, 2)
          }
          if (response.data.responseType === 'html') {
            this.responseType = 'html'
            this.responseData = response.data.response
          }
          this.responseHttpCode = response.data.responseHttpCodeStatus

          if (this.requestContentType === '3') {
            this.toJsonCall()
          }
          console.log(this.requestContentType)
        })
      },
      send () {
        let data = {
          documentId: this.documentId,
          request: this.doc.request,
          requestMethod: this.requestMethod,
          requestUrl: this.requestUrl,
          requestContentType: this.requestContentType,
          requestHeader: this.requestHeader,
          requestBody: this.requestBody
        }
        Http.put('document/update', data, response => {
          console.log(response)
          this.documentId = response.data.id
          this.random = '?random=' + response.timestamp + Math.random()
          if (response.data.responseType === 'json') {
            this.responseType = 'json'
            this.responseData = JSON.stringify(JSON.parse(response.data.response), null, 2)
          }

          if (response.data.responseType === 'html') {
            this.responseType = 'html'
            this.responseData = response.data.response
            console.log(this.responseData)
            window.open(this.responseHtml + this.documentId + '.html', '调试结果', 'resizable=0, location=0, scrollbars=1, toolbar=0, width=900, height=400, bottom=0, left=0')
          }

          this.responseHttpCode = response.data.responseHttpCodeStatus

          this.$message({
            message: '请求成功！',
            type: 'success'
          })
        })
      }
    }
  }
</script>

