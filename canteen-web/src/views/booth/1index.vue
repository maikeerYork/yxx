<template>
  <div class="min"  id="screen" :style="{'width':`${style.width}px`,'height':`${style.height}px`,'transform':`${style.transform}`}">
      <span>集中办公区智慧食堂</span>
      <div class="box_img">
          <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(item,index) in canteen_info" :key="index" :id="index">
              <div class="click" 
               :data-canteen_id="item.canteen_id" :data-canteen_name="item.canteen_name">
                <div class="span_1" >{{item.canteen_name}}</div>
                <div class="span_2">CANTEEN</div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
          </swiper>
      </div>
  </div>
</template>   
<script>
let vm = null
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { mapGetters } from "vuex";
import "swiper/css/swiper.min.css";
export default {
  name:'booth',
  data() {
    return {
      swiperOption: {
        loop: true,
        on: {
          click: (event) => {
            const realIndex = event.target.dataset;
            console.log(realIndex.canteen_id,realIndex.canteen_name);
            vm.start(realIndex.canteen_id,realIndex.canteen_name)
          },
        },
        autoplay: {
          delay: 4000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        slidesPerView: 5,
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        // 设置点击箭头
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      style: {
        width: "1920",
        height: "1080",
        transform: "scaleY(1) scaleX(1) translate(-50%, -50%)"
      }
    }
  },
  mounted(){
    vm = this
    console.log(this.canteen_info,'this.canteen_info');
    let that = this;
    that.setScale();
    /*窗口改变事件*/
    window.addEventListener('resize', ()=> {
      that.setScale();
    });
  },
  components:{
    swiper,
    swiperSlide
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    ...mapGetters(["canteen_info"]),
  },
  methods:{
    start(canteen_id,canteen_name){
      this.$store.state.canteen_id = canteen_id
      this.$store.state.canteen_name = canteen_name
      this.$router.push({path: '/canteen', query: {canteen_id}});
    },
    getScale() {
      const w = window.innerWidth / this.style.width;
      const h = window.innerHeight / this.style.height;
      return {x:w,y:h};
    },
    setScale() {
      let scale = this.getScale();
      this.style.transform = "scaleY(" + scale.y + ") scaleX(" + scale.x + ") translate(-50%, -50%)";
    },
  }
}
</script>

<style lang="scss" scoped>
.min{
  overflow: hidden;
  width: 100%;
  height: 100%;
  background:url('@/assets/images/cateen/bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  span{
    display: block;
    margin-top: 4.8%;
    display: flex;
    justify-content: center;
    align-content: center;
    width: 100%;
    height: 6%;
    font-size: 4vh;
    font-weight: 800;
    color: #E1E3EF;
    letter-spacing: 10px;
    text-shadow:
    0px 1px 0px #c0c0c0,
    0px 2px 0px #b0b0b0,
    0px 3px 0px #a0a0a0,
    0px 4px 0px #909090,
    0px 5px 10px rgba(0, 0, 0, 0.6);
  }
  .box_img{
    // width: 770px;
    height: 100%;
    display: flex;
    margin: 5%  auto 0;
    justify-content: space-between;
  }
}
.box_img .swiper-container{
  position: relative;
  width: 100%;
  height: 49%;
}  
.box_img .swiper-container .swiper-slide{
  width: 100%;
  background: yellowgreen;
  color: #000;
  font-size: 16px;
  text-align: center;
  background: url('@/assets/images/cateen/bg_2.png');
  background-size: 100%;
  background-repeat: no-repeat;
  display: flex;
  flex-direction:column;
  z-index: 1;
  .click{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
  }
  .span_1{
    width: 100%;
    height: 5%;
    font-size: 3vh;
    display: flex;
    justify-content: center;
    align-content: center;
    font-weight: 400;
    margin-top: 94%;
    color: #fff;
  }
  .span_2{
    width: 100%;
    margin-top: 5%;
    height: 3%;
    font-size: 2vh;
    display: flex;
    justify-content: center;
    align-content: center;
    font-weight: 400;
    color: #A2BDCE;
  }
}
.swiper-container {
      width: 100%;
      height: 100%;
    }
    .swiper-slide {
      text-align: center;
      font-size: 18px;
      background: #fff;

      /* Center slide text vertically */
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
	  transition: 300ms;
	  transform: scale(0.8);
    }
	.swiper-slide-active,.swiper-slide-duplicate-active{
      transform: scale(1);
	}
  // @media screen and (max-width:1780px){
  //   .min .box_img{
  //     margin-top: 7%;
  //   }
  //   .min span{
  //     margin-top: 4%;
  //   }
  // }
  //  @media screen and (max-width:1680px){
  //   .min .box_img{
  //     margin-top: 7%;
  //   }
  //   .min span{
  //     margin-top: 4%;
  //   }
  //   .box_img .swiper-container{
  //     height: 53%;
  //   }
  // }
  // @media screen and (min-width:1780px) and (max-width:1920px) and (min-height:930px) {
  //   .min .box_img{
  //     margin-top: 5%;
  //   }
  //   .min span{
  //     margin-top: 4%;
  //   }
  //   .box_img .swiper-container{
  //     height: 57%;
  //   }
  // }
  // @media screen and (min-width:1910px) and (min-height:1070px){
  //   .min .box_img{
  //     margin-top: 9%;
  //   }
  //   .min span{
  //     margin-top: 4.5%;
  //   }
  //   .box_img .swiper-container{
  //     position: relative;
  //     width: 100%;
  //     height: 49%;
  //   } 
  // }
  // @media screen and (max-width:1280px)  and (max-height:800px) {
  //   .min .box_img{
  //     margin-top: 10%;
  //   }
  //   .min span{
  //     margin-top: 5%;
  //   }
  //   .box_img .swiper-container{
  //     height: 43%;
  //   }
  // }
  // @media screen and (max-width:1400px)  and (max-height:900px) {
  //   .min .box_img{
  //     margin-top: 12%;
  //   }
  //   .min span{
  //     margin-top: 5%;
  //   }
  //   .box_img .swiper-container{
  //     height: 42%;
  //   }
  // }
  // @media screen and (max-width:1366px)  and (max-height:768px) {
  //   .min .box_img{
  //     margin-top: 9%;
  //   }
  //   .min span{
  //     margin-top: 4.5%;
  //   }
  //   .box_img .swiper-container{
  //     height: 48%;
  //   }
  // }
  // @media screen and (max-width:1440px)  and (max-height:900px) {
  //   .min .box_img{
  //     margin-top: 11%;
  //   }
  //   .min span{
  //     margin-top: 5%;
  //   }
  //   .box_img .swiper-container{
  //     height: 43%;
  //   }
  // }
  #screen{
    z-index: 100;
    transform-origin: 0 0;
    position: fixed;
    left: 50%;
    top: 50%;
    transition: 0.3s;
}
</style>

