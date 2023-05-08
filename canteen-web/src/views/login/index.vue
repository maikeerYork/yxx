<template>
  <div id="app" class="main-page">
    <agile
      @after-change="newSlide($event)"
      :arrows="false"
      :speed="1500"
      :fade="true"
      :autoplay="true"
      :autoplaySpeed="8000"
      :pauseOnHover="false"
    >
      <div class="slide">
        <img
          style="width: 100%; height: 100%"
          src="@/assets/images/login/index_bg.jpg"
        />
      </div>

      <div class="slide">
        <img
          style="width: 100%; height: 100%"
          src="@/assets/images/login/index_bg1.jpg"
        />
      </div>
      <div class="slide">
        <img
          style="width: 100%; height: 100%"
          src="@/assets/images/login/index_bg2.jpg"
        />
      </div>
    </agile>
    <!-- <div class="mask"></div> -->
    <div class="title">集中办公区智慧食堂</div>
    <div class="title_eglish">SMART CANTEEN IN CENTRALIZED OFFICE AREA</div>
    <!-- <div class="btn" @click="start">点击进入平台</div> -->
    <div class="new_btn">
      <button @click="start">
        <div class="svg-wrapper-1">
          <div class="svg-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path
                fill="currentColor"
                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
              ></path>
            </svg>
          </div>
        </div>
        <span>进入平台</span>
      </button>
    </div>
    <div class="carousel">
      <slider ref="slider" :options="options">
        <slideritem
          v-for="(item, index) in someList"
          :key="index"
          :style="item.style"
        >
          <img :src="item.url" alt="" srcset="" />
        </slideritem>
        <!-- Customizable loading -->
        <div slot="loading">loading...</div>
      </slider>
    </div>
    <!-- <img src="@/assets/images/login/index.webp" alt="" class="img_right" />
    <div class="bottom">
      <img src="@/assets/images/login/index_bottom.png" alt="" />
    </div> -->
  </div>
</template>

<script>
import { getToken, setToken, removeToken } from "@/utils/auth";
import { login } from "@/api/login";
import md5 from "blueimp-md5";
import { slider, slideritem } from "vue-concise-slider";
import { VueAgile } from "vue-agile";

export default {
  name: "App",
  components: {
    slider,
    slideritem,
    agile: VueAgile,
  },
  data() {
    return {
      someList: [
        {
          html: "slide1",
          style: {
            background: "#040f2e",
            width: "30vw",
          },
          url: require("@/assets/images/login/index_lb1.jpg"),
        },
        {
          html: "slide2",
          style: {
            background: "#040f2e",
            width: "30vw",
          },
          url: require("@/assets/images/login/index_lb2.jpg"),
        },
        {
          html: "slide3",
          style: {
            background: "#040f2e",
            width: "30vw",
          },
          url: require("@/assets/images/login/index_lb3.jpg"),
        },
      ],
      options: {
        currentPage: 0,
        loop: true,
        autoplay: "3000",
        itemAnimation: true,
        centeredSlides: true,
        thresholdDistance: 100,
        thresholdTime: 300,
        loopedSlides: 2,
        slidesToScroll: 1,
      },
    };
  },
  async mounted() {
    // let docWidth = document.documentElement.clientWidth;
    // let docHeight = document.documentElement.clientHeight;
    // var designWidth = 1920,
    //     designHeight = 1080,
    //     widthRatio = docWidth / designWidth,
    //     heightRatio = docHeight / designHeight; // 缩放比例
    // document.body.style = `transform:scale(${widthRatio},${heightRatio});transform-origin:left top;`;
    let that = this;
    setInterval(() => {
      that.login();
    }, 3600000);
    this.login();
  },
  methods: {
    start() {
      this.$router.push({ path: "/booth", params: { id: "" } });
    },
    async login() {
      let res = await login({
        username: "cdyxx",
        password: md5("Cdyxx321"),
        // username:'gezi',
        // password: md5('123456')
      });
      this.$store.state.canteen_info = res.data.data.canteen_info;
      this.$store.state.company_info = res.data.data.company_info;
      this.$store.state.mix_info = res.data.data.canteen_mix;
      var canteenAll = [];
      res.data.data.canteen_info.forEach((element, index) => {
        canteenAll.push(element.canteen_id);
        if (index === 0) {
          this.$store.state.canteen_check = element.canteen_id;
        }
      });
      setToken(res.headers.authorization);
    },
    load_btn() {
      canvas = document.createElement("canvas");
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();
      ctx.drawImage(
        imageBitmap,
        cropLeft,
        cropTop,
        cropWidth + 10,
        cropHeight,
        50,
        -6,
        canvas.width,
        canvas.height
      );
      // 将 canvas 转换为 data URL，并将其设置为按钮的背景
      const dataURL = canvas.toDataURL("image/jpeg");
      btn.style.backgroundImage = `url(${dataURL})`;
    },
    newSlide($event) {},
  },
};
</script>

<style lang="scss" scoped>
.main-page {
  width: 100%;
  height: 100%;
  // background: linear-gradient(90deg, #030c26 0%, #061849 100%);
  background-size: 100%;
  overflow: hidden;
  position: relative;
  display: block;
  align-items: center;
  justify-content: center;
  .new_btn {
    width: auto;
    position: absolute;
    top: 40%;
    left: 45%;
  }
  .btn {
    width: auto;
    position: absolute;
    top: 40%;
    padding: 1.5vh 3vh;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    color: #fff;
    text-decoration: none;
    font-size: 1.5vw;
    text-transform: uppercase;
    transition: 0.5s;
    overflow: hidden;
    -webkit-box-reflect: below 0.3vw
      linear-gradient(transparent, rgba(235, 231, 231, 0.2));
    z-index: 2;
    text-shadow: 0 8px 10px #fff; /*设置文字阴影*/
    &:hover {
      background: #417110;
      color: yellow;
      box-shadow: 0 0 50px #417110;
      text-shadow: 0 8px 10px yellow; /*设置文字阴影*/
      transition-delay: 0.5s;
    }
  }

  .btn:nth-child(1) {
    filter: hue-rotate(115deg);
  }

  .btn:nth-child(3) {
    filter: hue-rotate(270deg);
  }

  .btn::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 1.5vh;
    height: 1.5vh;
    border-top: 0.5vh double #fff;
    border-left: 0.5vh double #fff;
    transition: 0.5s;
    transition-delay: 0.5s;
  }

  .btn:hover::before {
    width: 100%;
    height: 100%;
    transition-delay: 0s;
    border-color: yellow;
  }

  .btn::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 1.5vh;
    height: 1.5vh;
    border-bottom: 0.5vh double #fff;
    border-right: 0.5vh double #fff;
    transition: 0.5s;
    transition-delay: 0.5s;
  }

  .btn:hover::after {
    width: 100%;
    height: 100%;
    transition-delay: 0s;
    border-color: yellow;
  }
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    text-align: center;
    margin: 0 auto;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.68);
    z-index: 1;
  }
  .title {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 12%;
    height: 5%;
    margin: 0 auto;
    font-size: 4vh;
    font-weight: bold;
    color: #ffffff;
    text-align: center;
    letter-spacing: 10px;
    color: #f4f4f4;
    text-shadow: 0px 1px 0px #c0c0c0, 0px 2px 0px #b0b0b0, 0px 3px 0px #a0a0a0,
      0px 4px 0px #909090, 0px 5px 10px rgba(0, 0, 0, 0.6);
    z-index: 2;
  }
  .title_eglish {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 20%;
    margin: 0 auto;
    height: 24px;
    font-size: 2vh;
    margin: 1% auto 0;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
    letter-spacing: 10px;
    z-index: 2;
  }
  .img_right {
    position: absolute;
    top: 16.5%;
    left: 51.718%;
    height: 74.35%;
  }
  .carousel {
    position: sticky;
    width: 45vw;
    margin: 0 auto;
    height: 30vh;
    bottom: 0%;
    margin: 0 auto;
    // background: rgba(0, 0, 0, 0.3);
    background: transparent;
    color: #5f84a8;
    z-index: 2;

    img {
      width: 100%;
      height: 98%;
      border: solid;
    }
    .slider-item {
      transform: scale(0.8);
      transition-timing-function: ease;
      transition-duration: 300ms;
    }
    .slider-item.slider-active {
      background: transparent;
      transform: scale(1) translateZ(0);
      z-index: 999;
    }
    .slider-item.slider-active-copy {
      transform: scale(1) translateZ(0);
      z-index: 999;
    }
  }

  .bottom {
    width: 100%;
    height: 150px;
    position: absolute;
    bottom: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  // Slides styles
  .slide {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    object-fit: cover;
    cursor: pointer;
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -ms-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  .slide:hover {
    transition: all 3s;
    transform: sacle(0.8);
    -webkit-transition: width 2s, height 2s;
    -webkit-transform: sacle(0.8);
  }
}
/deep/.slider-pagination-bullet {
  background: #fff none repeat scroll 0 0;
  opacity: 0.8;
}
/deep/.swiper-container-horizontal .slider-pagination-bullet-active {
  background: rgb(71, 70, 70) none repeat scroll 0 0 !important;
}

button {
  font-family: inherit;
  font-size: 18px;
  background: linear-gradient(to bottom, #4dc7d9 0%, #66a6ff 100%);
  color: white;
  padding: 0.8em 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  cursor:pointer;
}

button:hover {
  // transform: translateY(-3px);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
}

button:active {
  transform: scale(0.95);
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

button span {
  display: block;
  margin-left: 0.4em;
  transition: all 0.3s;
}

button svg {
  width: 18px;
  height: 18px;
  fill: white;
  transition: all 0.3s;
}

button .svg-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  margin-right: 0.5em;
  transition: all 0.3s;
}

button:hover .svg-wrapper {
  background-color: rgba(255, 255, 255, 0.5);
}

button:hover svg {
  transform: rotate(45deg);
}

</style>
