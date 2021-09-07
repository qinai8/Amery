<template>
	<div id="jiaosen">
		<div id="Illustrations">
			<el-input v-model="search" size="mini" placeholder="输入关键字搜索" style="width:200px;" />
			<el-button type="primary" icon="el-icon-search" style="padding: 5px 10px;margin-left: 5px;">搜索</el-button>
			<el-button type="primary" icon="el-icon-edit" @click="dialogFormVisible = true" style="padding: 5px 10px;">添加</el-button>
		</div>
		<!-- 添加 -->
		<el-dialog title="添加" :visible.sync="dialogFormVisible">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item prop="user"><el-input v-model.number="ruleForm.user" class="el-input" placeholder="角色名称"></el-input></el-form-item>
				<el-form-item prop="generalize"><el-input v-model.number="ruleForm.generalize" class="el-input" placeholder="说明"></el-input></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 编辑 -->
		<el-dialog title="编辑" :visible.sync="handleEdit">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item prop="user"><el-input v-model.number="ruleForm.user" class="el-input" placeholder="角色名称"></el-input></el-form-item>
				<el-form-item prop="generalize"><el-input v-model.number="ruleForm.generalize" class="el-input" placeholder="说明"></el-input></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleEdit = false">取 消</el-button>
				<el-button type="primary" @click="suxiBulin('ruleForm')">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 配置 -->
		<el-dialog title="权限配置" :visible.sync="dialogVisible" style="margin-top: 190px; margin-left: 50px;">
			<el-tree ref="tree" :data="odata" show-checkbox node-key="id" :default-checked-keys="checkeddata">
				<div class="custom-tree-node" slot-scope="{ node, data }">
					<span style="margin:0.8px;">{{ node.label }}</span>
					<el-tag v-if="data.api" type="success" size="mini">{{ data.api }}</el-tag>
				</div>
			</el-tree>

			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="power()">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 表格 -->
		<el-table :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" style="width: 100%" border>
			<el-table-column label="角色名称" prop="name" align="center"></el-table-column>
			<el-table-column label="说明" prop="desc" align="center"></el-table-column>
			<el-table-column align="center" label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit = true" style="background-color: #0BADF9; color: #F2F2F2;">编辑</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					<el-button size="mini" style="background-color: #0BADF9; color: #F2F2F2;" @click="dialogVisible = true">授权</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-container>
			<el-header class="buttom">
				<div class="block">
					<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="page"
						:page-sizes="[10, 20, 30, 40, 50, 100]"
						:page-size="limit"
						layout="total, sizes, prev, pager, next, jumper"
						:total="count"
					></el-pagination>
				</div>
			</el-header>
		</el-container>
	</div>
</template>

<script>
export default {
  data () {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'))
      }
      setTimeout(() => {
        if (!isNaN(value)) {
          callback(new Error('请输入文字'))
        } else {
          callback()
        }
      }, 1000)
    }
    var checkUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('说明不能为空'))
      }
      setTimeout(() => {
        if (!isNaN(value)) {
          callback(new Error('请输入文字'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      count: null,
      radio: '1', // 弹框状态
      numbut: '', // 识别弹框作用  修改还是新增
      // 判断是添加还是修改
      listStatusRole: true,
      checkeddata: [],
      tableData: [],
      page: 1,
      limit: 20,
      topg: '',
      search: '',
      id: '',
      dialogVisible: false,
      dialogFormVisible: false,
      handleEdit: false,
      forms: {
        // 授权
        id: ''
      },
      ruleForm: {
        id: '',
        user: '',
        generalize: ''
      },
      formLabelWidth: '120px',
      rules: {
        generalize: [
          {
            validator: checkUser,
            trigger: 'blur'
          }
        ],

        user: [
          {
            validator: checkAge,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.showlist()
  },
  methods: {
    handleCurrentChange (val) {
      // 页面切换
      this.page = val
      this.list()
    },
    handleSizeChange (val) {
      this.limit = val
      console.log(this.limit)
      this.list()
    },
    // 删除
    handleDelete (index, row) {
      this.axios
        .get(
          'http://192.168.1.54:8080/admin/role/delete',
          {},
          {
            headers: {
              'X-Litemall-Admin-Token': window.getCookie('token')
            }
          }
        )
        .then(res => {
          if (res.data.data) {
            this.$message.success('删除成功')
            this.initRole()
          }
        })
        .catch(res => {
          this.$message.error('删除失败')
        })
    },

    showlist () {
      this.axios
        .get('http://192.168.1.54:8080/admin/role/list', {
          headers: {
            'X-Litemall-Admin-Token': window.getCookie('token')
          }
        })
        .then(res => {
          this.tableData = res.data.data.list
          this.count = res.data.data.total
          console.log(res.data.data.list)
        })
    },
    // 编辑
    suxiBulin (formName) {
      console.log(this.ruleForm, 'dwad')
      console.log(this.ruleForm.id, '6546547')
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios({
            url: 'http://192.168.1.54:8080/admin/role/update',
            method: 'post',
            data: {
              id: this.ruleForm.id,
              name: this.ruleForm.user,
              desc: this.ruleForm.generalize
            },
            headers: {
              'X-Litemall-Admin-Token': window.getCookie('token')
            }
          }).then(res => {
            console.log(res)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加
    submitForm (formName) {
      console.log(this.ruleForm.user)
      const thui = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios({
            url: 'http://192.168.1.54:8080/admin/role/create',
            method: 'post',
            data: {
              name: thui.ruleForm.user,
              desc: thui.ruleForm.generalize
            },
            headers: {
              'X-Litemall-Admin-Token': window.getCookie('token')
            }
          }).then(res => {
            console.log(res)
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
<style scoped>
.buttom {
	color: #333;
	width: 100%;
	height: 130px !important;
}
.block {
	margin-top: 10px;
}
#jiaosen {
	width: 100%;
}
.el-table-column {
	border: 1px solid red;
	text-align: center;
}
.search {
	width: 100%;
	height: 50px;
	border: 1px solid red;
}
#Illustrations {
	width: 100%;
	height: 40px;
}
.el-button {
}
</style>
