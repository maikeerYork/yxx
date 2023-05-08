<template>
  <div class="header" :class="fatherClass?'newHeader':''">
    <span class="titleName">所属档口:</span>
    <el-cascader
      class="width-270"
      :show-all-levels="false"
      v-model="canteenId"
      :options="canteenTree"
      :props="treeProps"
      collapse-tags
      placeholder="默认所有档口"
      :key="keyValue" 
      clearable
      ref="referenceCanteen"
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
    canteentitle: String,
    fatherClass:String
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
          multiple: true,
          value:'id',
          expandTrigger: 'hover',
          emitPath:false//绑定的内容只获取最后一级的value值
      },
      treeOptions: ['a'], // 下拉框列表，给任意值，防止出现“暂无数据”
      canteenIds_arr:[],
      keyValue:1,
      StallModelarr:[]//食堂档口 联级选择器全选中 的id
    };
  },
  computed: {
    ...mapGetters(["canteen_info", "canteen_check","company_info","mix_info"])
  },
  watch: {
  },
  created() {
    this.canteen_name = '全部档口'
    this.getcanteenDkList()
  },
  methods: {
      //获取食堂档口列表
      getcanteenDkList(){
        //feng 2021-11-02 新增逻辑 采用本地食堂列表处理---start
        this.canteen_info.forEach((item)=>{
          item.id = item.canteen_id
        })
        this.treeOptions = this.canteen_info
        //feng 2021-11-02 新增逻辑 采用本地食堂列表处理---end
        this.canteenIds_arr = this.treeOptions.map(x=>x.id)
        console.log(this.canteenIds_arr,'this.canteenIds_arr');

        this.canteenId = this.canteenIds_arr
        this.$store.state.newCanteen_check = this.canteenIds_arr.join(',')
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
          id:'',
          sort: null,
          parent_id: null,
          list: this.canteenList,
        })
        this.getStallModel()
      },
      // 2021-11-23 选择档口修改
      changeCanteen(){
        this.$refs.referenceCanteen.panel.activePath = []
        if(this.canteenId.length==0){
          this.$store.state.newCanteen_check = this.canteen_info.map(x=>x.id).join(',')
        }else{
          this.$store.state.newCanteen_check = this.canteenId.join(',')
        }
        this.$refs.referenceCanteen.handleClear()
      },
      //wyh
      //级联选择器  全选  v-model里的数据   会按照canteenTree结构 从上往下 将id 按顺序  排列在v-model 里 
      //所以回显  v-model要注意id的顺序  按照canteenTree结构 从上往下  否则会出现点击x tag没变 数据变了
      //获取 所属组织（食堂档口）  的回显数据ID
      getStallModel(){
        this.canteenTree.forEach(item=>{
          if(item.list == undefined){
            this.StallModelarr.push(item.id) 
          }else{
            this.getStallModelSon(item)
          }
        })
        console.log(this.StallModelarr,'arr')
        this.onlyCeetn(this.canteenTree)
        this.canteenId = this.StallModelarr
        console.log(this.canteenId,'this.canteenId');
      },
      //递归处理数据  取出所有档口id
      getStallModelSon(ele){
        // console.log(ele,'{');2
        // console.log(ele.list == undefined);3
        if(ele.list == undefined){
            this.StallModelarr.push(ele.id) 
            // console.log(ele.id);4
        }else{
          for (let i = 0; i < ele.list.length; i++) {
            // console.log(ele.list[i]);1
            this.getStallModelSon(ele.list[i])
          }
        }
      },
      onlyCeetn(arr){
      var i = arr.length;
      while (i--) {
        if(arr[i].list && arr[i].list.length){
          this.onlyCeetn(arr[i].list)
        }else{
          if(arr[i].id == this.$store.state.canteen_id){
          }else{
            arr.splice(i,1)
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: none;
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
.newHeader{
  background-color: #fff;
  padding: 0;
  margin-bottom: 0;
  .titleName {
    font-size: 12px;
  }
}
</style>
