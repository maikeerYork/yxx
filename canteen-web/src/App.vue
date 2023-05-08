<template>
  <div id="app">
    <transition :name="switchTransition">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {
      switchTransition:'onefade'
    }
  },
  mounted(){
  },
  created(){
    if (window.localStorage.getItem("list") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(window.localStorage.getItem("list"))))
    } 
    
    window.addEventListener("beforeunload",()=>{
        window.localStorage.setItem("list",JSON.stringify(this.$store.state))
    })
  },
  watch:{
    $route(to,from){
      const isBack = this.$router.isBack;
      if (from.meta.leavel && to.meta.leavel) {
        // 说明是一级到一级
        this.switchTransition = "onefade";
      } else if (!to.meta.leavel) {
        // 说明到的是二级
        this.switchTransition = "twofade";
      }
      if (isBack) {
        this.switchTransition = "threefade";
      }
      this.$router.isBack = false; //监听路由后重置 isBack 用于判断如何跳转动画；
    }
  }
}
</script>

<style lang="scss" scope>
*{
  margin: 0 ;
  padding: 0;
}
html,body,#app{
  width: 100%;
  height: 100%;
}
// .el-picker-panel{
//   top:400px !important;
//   left: 400px !important;
// }
#app{
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  position: absolute;
}
// 一级动画 其实没有动画效果 直接切换 主要是为了菜单栏的切换
.onefade-enter {
  opacity: 0;
}
.onefade-enter-active,
.onefade-leave-active {
  transition: all 0;
}
.onefade-leave-to {
  opacity: 0;
}

//点击list列表 enter leave动画

.twofade-enter-active,
.twofade-leave-active {
  transition: all 1s;
  position: absolute;
}

.twofade-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.twofade-enter{
  opacity: 0;
  transform: translateX(100%);
}


//点击返回按钮执行的 enter leave动画

.threefade-enter-active,
.threefade-leave-active {
  transition: all 1s;
  position: absolute;
}
.threefade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.threefade-enter {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
