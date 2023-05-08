<template>
  <div>
    <el-card class="card">
      <div class="select">
        <div class="department">
          <div>部门：</div>
          <div class="width-200"> 
            <treeselect v-model="departId" :options="departs_list" :normalizer="normalizer" :clearable="false"
              placeholder="请选择部门" :limit="1" :limitText="(count)=> `${count}+`" :multiple="true"  value-consists-of="ALL"/>
          </div>
        </div>
        <div class="department ml-30">
          <div>用户组：</div>
          <div class="width-200"> 
            <el-select v-model="userGroupId" collapse-tags clearable multiple placeholder="请选择用户组">
              <el-option v-for="item in userGroupList" :key="item.id" :label="item.group_name"
                :value="item.id" />
            </el-select>
          </div>
        </div>
      </div>                 
      
    </el-card>
  </div>
</template>

<script>
import { departList } from '@/api/department'
import treeselect from '@riophae/vue-treeselect'
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getUserGroupList } from '@/api/user_group'
export default {
  data(){
    return{
      departId:null, 
      departs_list:[],
      canteenId:'',
      userGroupId:'',
      userGroupList: [],//用户组
    }
  },
  computed: {
    ...mapGetters(['canteen_info'])
  },
  mounted(){
    this.canteenInit() 
    this.getDeparts() // 部门列表
    this.getUserGroupList() //获取用户组
  },
  components:{
    treeselect
  },
  methods:{
    // 自定义键名
    normalizer(node) {
      return {
        id: node.id,
        label: node.depart_name,
        children: node.list
      }
    },
    // 获取部门列表
    getDeparts() {
      const obj = {}
      obj.canteen_id = this.canteenId
      departList(obj).then(response => {
        this.departs_list = this.handleTree(response.data.data)
        const obj = {
          create_at: '1970-01-01 00:00:00',
          depart_name: '未分配',
          id: 0
        }
        this.departs_list.unshift(obj)
      }).catch(error => {
        console.log(error)
      })
    },
    // 食堂初始化
    canteenInit() {
      if(this.canteen_info.length>0)
      this.canteenId= this.canteen_info.map(item=>item.canteen_id).join(',')
    },
    // 用户组人员列表
    getUserGroupList() {
      let obj = {}
      obj.canteen_id = this.canteenId
      getUserGroupList(obj).then(response => {
        this.userGroupList = response.data.data
        const obj = {
          group_name: "未分组",
          id: 0,
          remark: "",
        }
        this.userGroupList.unshift(obj)
      }).catch(error => {
        console.log(error)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.card{
  width: 100%;
  height: 500px;
  .select{
  width: 100%;
  height: 50px;
  display: flex;
  .department{
    display: flex;
    align-items: center;
  }
}
}

</style>