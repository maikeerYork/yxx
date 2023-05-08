<template>
  <div class="min">
    <div class="top">
        <div class="top_left">
            <img src="@/assets/images/cateen/logo.png" alt="" srcset="">
            <div class="text">
                <span class="span_1">{{canteen_name}}</span>
                <!-- <span class="span_2">Yongxing Lane Smart Canteen</span> -->
            </div>
        </div>
        <div class="top_right">
            <img  src="@/assets/images/icon/return_cateen.png" alt="" @click="return_cateen" v-if="return_cateen_flag">
            <img  src="@/assets/images/icon/return_login_click.png" alt="" @click="return_cateen" v-if="!return_cateen_flag">
            <img class="img_login"  src="@/assets/images/icon/return_login.png" alt=""  @click="return_login" v-if="return_login_flag">
            <img class="img_login" src="@/assets/images/icon/return_cateen_click.png" alt=""  @click="return_login" v-if="!return_login_flag">
        </div>
    </div>
    <div class="content">
        <div class="content_left">
            <el-menu :default-openeds='["0"]' class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                <el-menu-item index="1" @click="backSix">
                    <i class="el-icon-menu"></i>
                    <span slot="title">首页</span>
                </el-menu-item>
                <el-submenu :index="String(index)" v-for="(item,index) in list" :key="index">
                    <template slot="title">
                    <span slot="title"> {{item.name}}</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item :index="'1-'+ index_c"
                          v-for="(item_c,index_c) in item.children" :key="index_c" @click="skip(item_c.path)">{{item_c.name}}</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </div>
        <div class="content_right"> 
            <el-card>
                <div class="content_right_top">
                    <div class="bottom" @click="navigation">
                        <img src="@/assets/svg/j_c.svg" :class="isCollapse ? 'is-active svg_img' : 'svg_img'"/>
                    </div>
                </div>
            </el-card>
            <div class="content_right_bottom">
                <router-view/>
            </div>
        </div>
    </div> 
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data() {
        return {
             isCollapse: false,
             list:[],
             return_cateen_flag:true,
             return_login_flag:true,
        }
    },
    computed: {
        ...mapGetters([,'canteen_name']),
    },
    mounted(){
        this.list = this.$store.state.list
        console.log(this.$route.query.canteen_id );
    },
    methods:{
        start(){
            this.$router.push({path: '/layout', params: {id: ''}});
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        navigation(){
            this.isCollapse = !this.isCollapse
        },
        skip(path){
            this.$router.push({path: path, query : {is:''}},() => {});
        },
        backSix(){
            this.$router.push({path: '/canteen', query : {}},() => {});
        },
        return_cateen(){
            let that = this
            this.return_cateen_flag = !this.return_cateen_flag
            setTimeout(() => {
                this.$router.push({path: '/booth', query: {canteen_id:this.$store.state.canteen_id}});
            }, 500);
        },
        return_login(){
            this.return_login_flag = !this.return_login_flag
            setTimeout(() => {
                this.$router.push({path: '/', query: {canteen_id:this.$store.state.canteen_id}});
            }, 500);
        },
    }
}
</script>

<style lang="scss" scoped>
 .min{
    width: 100%;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    .top{
        width: 100%;
        height: 8% ;
        // background-color: #155E9A;
        background: url("http://yxxglfw.com/k/kui/skins/extflat/images/blueline/m-top.jpg");
        display: flex;
        justify-content: space-between;
        .top_left{
           width: 300px;
           height:100% ; 
           display: flex;
           align-content: center;
           align-items: center;
           img{
            margin-left: 24px;
            width: 56px;
            height: 56px;
           }
        }
        .text{
            display: flex;
            flex-direction: column;
            .span_1{
                font-size: 20px;
                font-weight: 500;
                color: #FFFFFF;
                line-height: 24px;
            }
            .span_2{
                font-size: 7px;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 24px;
            }
        }
        .top_right{
            width: 200px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            font-weight: 400;
            color: #FFFFFF;
            div{
                display: block;
                width: 168px;
                height: 16px;
            }
            img{
                width: 23px;
                height: 25px;
            }
            .img_login{
                margin-left: 12px;
            }
        }
    }
    .content{
        width: 100%;
        height: 92%;
        display: flex;
        .content_left{
            // width: 15%;
            height: 100%;
            background-color: #ffffff;
        }
        .content_right{
            width: 100%;
            height: 100%;
            .content_right_top{
                width: 100%;
                height: 6%;
                background-color: #fff;
                .bottom{
                    width: 50px;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
            .content_right_bottom{
                overflow: auto;
                width: 100%;
                height: 95%;
            }
        }
    }
 }
 .svg_img {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.svg_img.is-active {
  transform: rotate(180deg);
}
 .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    // min-height: 400px;
  }
</style>