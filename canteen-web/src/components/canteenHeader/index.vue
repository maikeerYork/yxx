<template>
  <div class="header">
    <span class="titleName">所属档口:</span>
    <el-cascader
      class="width-250"
      :show-all-levels="false"
      v-model.trim="canteenId"
      :options="canteenTree"
      :props="treeProps"
      filterable
      @change="changeCanteen"
      >
      <template slot-scope="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"> ({{ data.list.length }}) </span>
      </template>
    </el-cascader>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},
  props: {
    canteentitle: String
  },
  data() {
    return {
      canteenId: null,
      canteenList:[],
      canteenTree:[],
      canteen_name:"",
      defaultProps: { // 自定义键值名
        children: 'list',
        label: 'label'
      },
      treeProps:{
          children: 'list',
          label: 'label',
          value:'id',
          expandTrigger: 'hover',
          emitPath:false//绑定的内容只获取最后一级的value值
      },
      treeOptions: ['a'], // 下拉框列表，给任意值，防止出现“暂无数据”
    };
  },
  computed: {
    ...mapGetters(["canteen_info", "canteen_check","company_info","mix_info",'canteen_id'])
  },
  watch: {},
  created() {
    let temp = this.canteen_check.toString().indexOf(',')
    if(temp < 0){
      this.canteenId = this.canteen_check
    }else{
      this.canteenId = this.canteen_check.split(',')[0]
    }
    this.$store.state.canteen_check =  this.canteenId
    this.getcanteenDkList()
  },
  mounted() {},
  methods: {
    //获取食堂档口列表
      getcanteenDkList(){
        //feng 2021-11-02 新增逻辑 采用本地食堂列表处理---start
        this.canteen_info.forEach((item)=>{
          item.id = item.canteen_id
        })
        this.treeOptions = this.canteen_info
        //feng 2021-11-02 新增逻辑 采用本地食堂列表处理---end
        this.treeOptions.forEach((item)=>{
          if(item.id == this.canteenId){
            this.canteen_name = item.canteen_name
          }
        })
        // this.canteenId = this.canteen_id
        this.getCanteenOrganize() 
      },
    //获取食堂组织列表
      getCanteenOrganize(){
        this.canteenList = this.mix_info
        if(this.canteenList.length == 0){
          this.canteenList = this.canteen_info
          this.canteenList.forEach(element => {
            element.label = element.canteen_name
            element.id = element.canteen_id
          });
        }else{
          //feng 2021-11-02 新增逻辑 采用本地食堂列表处理---start
          this.canteenList.forEach((item)=>{
            item.lists = []
            item.canteen.forEach((aitem)=>{
              this.canteen_info.forEach((bitem)=>{
                if(aitem.id == bitem.canteen_id){
                  item.lists.push(bitem)
                }
              })
            })
          })
          //feng 2021-11-02 新增逻辑 采用本地食堂列表处理---end

          this.canteenList.forEach(element => {
            element.label = element.mix_name
            element.list = element.lists
            element.list.forEach((item)=>{
              item.label = item.canteen_name
            })
          });
        }
        this.canteenList = this.handleTree(this.canteenList)
        this.setCanteenTree()
      },
      //处理初始档口组织架构
      setCanteenTree() {
        const root = JSON.parse(JSON.stringify(this.company_info))
        this.$set(this.canteenTree,0,{
          create_at: null,
          update_at: null,
          company_id: root.id,
          label: root.company_name,
          sort: null,
          parent_id: null,
          list: this.canteenList,
        })
      },
      // 2021-11-23 选择档口修改
      changeCanteen(){
        this.$store.state.canteen_check =  this.canteenId
      }
  }
};
</script>

<style lang="scss" scoped>
.header {
  background-color: #fff;
  padding: 20px 40px;
  margin-bottom: 20px;
  .titleName {
    font-size: 16px;
  }
  .title {
    font-size: 20px;
    margin-right: 40px;
  }
}
</style>
