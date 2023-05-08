<template>
  <div
    class="min"
    id="screen"
    :style="{
      width: `${style.width}px`,
      height: `${style.height}px`,
      transform: `${style.transform}`,
    }"
  >
    <div class="top">
      <div class="top_left">
        <img src="@/assets/images/cateen/logo.png" alt="" srcset="" />
        <div class="text">
          <span class="span_1">{{ canteen_name }}</span>
          <!-- <span class="span_2">Yongxing Lane Smart Canteen</span> -->
        </div>
      </div>
      <div class="top_right">
        <img
          class="img_home"
          src="@/assets/images/icon/return_cateen.png"
          title="回到餐厅"
          @click="return_cateen"
          v-if="return_cateen_flag"
        />
        <img
          class="img_home"
          src="@/assets/images/icon/return_login_click.png"
          title="回到餐厅"
          @click="return_cateen"
          v-if="!return_cateen_flag"
        />
        <img
          class="img_login"
          src="@/assets/images/icon/return_login.png"
          title="回到首页"
          @click="return_login"
          v-if="return_login_flag"
        />
        <img
          class="img_login"
          src="@/assets/images/icon/return_cateen_click.png"
          title="回到首页"
          @click="return_login"
          v-if="!return_login_flag"
        />
      </div>
    </div>
    <div class="coment">
      <div
        :class="
          bg_flag
            ? `offset_x coment_d coment_b1 animated `
            : `coment_d coment_b1 offset_x animated ${bounceInDown} `
        "
        @mouseenter="enter('bg_flag')"
        @mouseleave="leave('bg_flag')"
      >
        <div class="neon">明厨亮灶</div>
        <div class="bk_foot1">
          <div class="bk_light1"></div>
        </div>
        <div class="bk" @click="start(1)">
          <div class="bk_center1"></div>
        </div>
      </div>
      <div
        :class="
          bg_flag_1
            ? `coment_d coment_b2 offset animated `
            : `coment_d coment_b2 offset animated ${bounceInDown} `
        "
        @mouseenter="enter('bg_flag_1')"
        @mouseleave="leave('bg_flag_1')"
      >
        <div class="neon">进销存</div>
        <div class="bk_foot1">
          <div class="bk_light1"></div>
        </div>
        <div class="bk" @click="start(2)">
          <div class="bk_center2"></div>
        </div>
      </div>
      <div
        :class="
          bg_flag_2
            ? `coment_d coment_b3 offset animated `
            : `coment_d coment_b3 offset animated ${bounceInDown}`
        "
        @mouseenter="enter('bg_flag_2')"
        @mouseleave="leave('bg_flag_2')"
      >
        <div class="neon">消费管理</div>
        <div class="bk_foot1">
          <div class="bk_light1"></div>
        </div>
        <div class="bk" @click="start(3)">
          <div class="bk_center3"></div>
        </div>
      </div>
      <div
        :class="
          bg_flag_3
            ? `coment_d coment_b4 offset_x offset_y animated `
            : `coment_d coment_b4 offset_x offset_y animated ${bounceInDown}`
        "
        @mouseenter="enter('bg_flag_3')"
        @mouseleave="leave('bg_flag_3')"
      >
        <div class="neon">数据统计分析</div>
        <div class="bk_foot1">
          <div class="bk_light1"></div>
        </div>
        <div class="bk" @click="navDataScreen('CLIENT_DATA_STATISTICS')">
          <div class="bk_center4"></div>
        </div>
      </div>
      <div
        :class="
          bg_flag_4
            ? `coment_d coment_b5 offset offset_y animated `
            : `coment_d coment_b5 offset offset_y animated ${bounceInDown}`
        "
        @mouseenter="enter('bg_flag_4')"
        @mouseleave="leave('bg_flag_4')"
      >
        <div class="neon">微服务</div>
        <div class="bk_foot1">
          <div class="bk_light1"></div>
        </div>
        <div class="bk" @click="start(5)">
          <div class="bk_center5"></div>
        </div>
      </div>
      <div
        :class="
          bg_flag_5
            ? `coment_d coment_b6 offset offset_y animated `
            : `coment_d coment_b6 offset offset_y animated ${bounceInDown}`
        "
        @mouseenter="enter('bg_flag_5')"
        @mouseleave="leave('bg_flag_5')"
      >
        <div class="neon">互动中心</div>
        <div class="bk_foot1">
          <div class="bk_light1"></div>
        </div>
        <div class="bk" @click="navDataScreen('CLIENT_MSG_STATISTICS')">
          <div class="bk_center6"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { authScreen } from "@/api/maxScreen";
//引入three.js
import * as THREE from "three";
export default {
  data() {
    return {
      count: 0,
      // 用来跟踪鼠标水平位置
      mouseX: 0,
      windowHalfX: null,
      // 相机
      camera: null,
      // 场景
      scene: null,
      // 批量管理粒子
      particles: null,
      // 渲染器
      renderer: null,
      bg_flag: false,
      bg_flag_1: false,
      bg_flag_2: false,
      bg_flag_3: false,
      bg_flag_4: false,
      bg_flag_5: false,
      bounceInDown: "bounceInDown",
      flip: "flip",
      style: {
        width: "1920",
        height: "1080",
        transform: "scaleY(1) scaleX(1) translate(-50%, -50%)",
      },
      enterFlag: null,
      return_cateen_flag: true,
      return_login_flag: true,
    };
  },
  mounted() {
    let that = this;
    that.setScale();
    /*窗口改变事件*/
    window.addEventListener("resize", () => {
      that.setScale();
    });
  },
  computed: {
    ...mapGetters(["canteen_info", "canteen_name"]),
  },
  methods: {
    start(key) {
      let list = [];
      switch (key) {
        case 1:
          list = [
            {
              name: "明厨亮灶",
              children: [
                {
                  name: "实时监控",
                  path: "/layout/famousChef",
                },
              ],
            },
          ];
          break;
        case 2:
          list = [
            {
              name: "进销存",
              children: [
                {
                  name: "采购明细表",
                  path: "/layout/breakdown",
                },
                {
                  name: "采购汇总表",
                  path: "/layout/summarySheet",
                },
                /*{
                  name: "下单采购",
                  path: "/layout/orderPurchase",
                },*/
                /*{
                  name: "采购单明细",
                  path: "/layout/purchaseDetails",
                },*/
                {
                  name: "入库单明细",
                  path: "/layout/warehousingDetails",
                },
                {
                  name: "出库单明细",
                  path: "/layout/deliveryDetails",
                },
                {
                  name: "库存查询",
                  path: "/layout/inventoryInquiry",
                },
                {
                  name: "出入库分析",
                  path: "/layout/inOutAnalysis",
                },
              ],
            },
          ];
          break;
        case 3:
          list = [
            {
              name: "消费管理",
              children: [
                // {
                //   name: "食堂收支汇总",
                //   path: "/layout/summary",
                // },
                {
                  name: "消费报表",
                  path: "/layout/consumptionStatement",
                },
                {
                  name: "消费统计",
                  path: "/layout/consumptionStatistics",
                },
                {
                  name: "消费收银统计",
                  path: "/layout/cashierStatistics",
                },
                {
                  name: "食堂消费分析",
                  path: "/layout/consumptionAnalysis",
                },
                {
                  name: "云餐厅订单统计",
                  path: "/layout/orderStatistics",
                },
                {
                  name: "视觉结算统计",
                  path: "/layout/visualSettlement",
                },
              ],
            },
          ];
          break;
        case 5:
          list = [
            {
              name: "微服务",
              children: [
                
                {
                  name: "个人消费明细",
                  path: "/layout/personalConsumption",
                },
                {
                  name: "云餐厅服务",
                  path: "/layout/cloudBuy",
                },
                {
                  name: "用户分析",
                  path: "/layout/userAnalyse",
                },
                {
                  name: "反馈与建议",
                  path: "/layout/feedback",
                },
              ],
            },
          ];
          break;
        default:
          break;
      }
      this.$store.state.list = list;
      console.log(this.$store.state.canteen_id, "this.$store.state.canteen_id");
      console.log(list, "list");
      this.$router.push(
        {
          path: list[0].children[0].path,
          query: { canteen_id: this.$store.state.canteen_id },
        },
        () => {}
      );
    },
    navDataScreen(clientType) {
      this.getMaxScreen(clientType);
    },
    getMaxScreen(clientType) {
      let params = {
        canteen_id: this.canteen_info.map((x) => x.canteen_id).join(),
        client_type_code: clientType,
      };
      authScreen(params)
        .then((res) => {
          if (res.data.sub_code == "FAIL") {
            this.$message.error(res.data.msg);
          } else {
            window.open(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    enter(flag) {
      let that = this;
      if (this.enterFlag !== null) {
        clearTimeout(this.enterFlag);
      }
      this.enterFlag = setTimeout(() => {
        that[flag] = true;
        that.flip = "flip";
      }, 500);
    },
    leave(flag) {
      if (this.enterFlag !== null) {
        clearTimeout(this.enterFlag);
      }
      this[flag] = false;
      this.flip = "";
      this.bounceInDown = "";
    },
    getScale() {
      const w = window.innerWidth / this.style.width;
      const h = window.innerHeight / this.style.height;
      return { x: w, y: h };
    },
    setScale() {
      let scale = this.getScale();
      this.style.transform =
        "scaleY(" + scale.y + ") scaleX(" + scale.x + ") translate(-50%, -50%)";
    },
    return_cateen() {
      let that = this;
      this.return_cateen_flag = !this.return_cateen_flag;
      window.removeEventListener("resize", function () {
        that.setScale();
      });
      setTimeout(() => {
        this.$router.push({
          path: "/booth",
          query: { canteen_id: this.$store.state.canteen_id },
        });
      }, 500);
    },
    return_login() {
      this.return_login_flag = !this.return_login_flag;
      setTimeout(() => {
        this.$router.push({
          path: "/",
          query: { canteen_id: this.$store.state.canteen_id },
        });
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.min {
  width: 100%;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  // background: url("http://yxxglfw.com/app/yxx/fwpt/images/bj1.png");
  background: url("@/assets/images/cateen/blue_bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  .top {
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: space-between;
    .top_left {
      width: 300px;
      height: 100%;
      display: flex;
      align-content: center;
      align-items: center;
      img {
        margin-left: 24px;
        width: 56px;
        height: 56px;
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      .span_1 {
        font-size: 2vh;
        font-weight: 500;
        color: #ffffff;
        line-height: 24px;
      }
      .span_2 {
        font-size: 1vh;
        font-weight: 400;
        color: #ffffff;
        line-height: 24px;
      }
    }
    .top_right {
      width: 200px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      color: #ffffff;
      div {
        display: block;
        width: 168px;
        height: 16px;
      }
      img {
        width: 23px;
        height: 25px;
      }
      .img_login {
        margin-left: 24px;
        cursor: pointer;
      }
      .img_login:hover {
        transition: all 0.5s;
        transform: scale(1.1, 1.1);
      }
      .img_home {
        cursor: pointer;
      }
      .img_home:hover {
        transition: all 0.5s;
        transform: scale(1.1, 1.1);
      }
    }
  }
  .coment {
    width: 100%;
    height: 100%;
    // background-color: #030f33;
    display: flex;
    flex-wrap: wrap;
    border: none;
    .coment_d {
      width: 39%;
      height: 50%;
      position: relative;
      transition: all 0.5s;
      div {
        // margin-top: 44%;
        // margin-left: 310px;
        // padding-left: 24px;
        display: inline-block;
        width: 100%;
        text-align: center;
        color: #ffffff;
        font-size: 4vh;
        font-weight: 700;
      }
    }

    .coment_b1 {
      background: url("@/assets/images/cateen/bg_d.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }

    .coment_b2 {
      background: url("@/assets/images/cateen/bg_d.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .coment_b3 {
      background: url("@/assets/images/cateen/bg_d.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .coment_b4 {
      background: url("@/assets/images/cateen/bg_d.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .coment_b5 {
      background: url("@/assets/images/cateen/bg_d.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .coment_b6 {
      background: url("@/assets/images/cateen/bg_d.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .offset {
      margin-left: -11%;
    }
    .offset_x {
      margin-left: 1%;
    }
    .offset_y {
      margin-top: -6%;
    }
    .coment_b1_1 {
      background: url("@/assets/images/cateen/bg_d_1.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .coment_b2_2 {
      background: url("@/assets/images/cateen/bg_d2_2.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .coment_b3_3 {
      background: url("@/assets/images/cateen/bg_d3_3.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .coment_b4_4 {
      background: url("@/assets/images/cateen/bg_d4_4.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .coment_b5_5 {
      background: url("@/assets/images/cateen/bg_d5_5.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .coment_b6_6 {
      background: url("@/assets/images/cateen/bg_d6_6.png");
      background-size: 100%;
      background-repeat: no-repeat;
    }
  }
}
#screen {
  z-index: 100;
  transform-origin: 0 0;
  position: fixed;
  left: 50%;
  top: 50%;
  transition: 0.3s;
}
$button-width: 25.5%;
// $button-height: 57.5%;
$border-width: 5px;
$button-color: #64fff5;
$animate-duration: 5s;
.bk {
  position: absolute;
  width: $button-width !important;
  height: 49%;
  margin-top: 2.8% !important;
  top: 12%;
  left: 39%;
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    box-sizing: border-box;
    // background-color: #fff;
  }
  &:hover {
    &::before,
    &::after {
      animation: border-animate $animate-duration linear infinite;
      border: $border-width solid $button-color;
    }
    &::after {
      animation-delay: $animate-duration * -0.5;
    }
    cursor: pointer;
  }
}
.bk_center1 {
  // width: 100%;
  height: 100%;
  // margin-top: 0% !important;
  // margin-left: -18%;
  background: url("@/assets/images/cateen/bg_d_9.png");
  background-size: 64%;
  background-repeat: no-repeat;
  background-position: center;
  // position: relative;
  transition: all 0.5s linear;
  transform-style: preserve-3d;
  z-index: 99;
  &:hover {
    transform: rotateY(360deg);
  }
}

.bk_foot1 {
  position: absolute;
  left: 14%;
  // top: 6%;
  height: 120px;
  bottom: 10px;
  background: url("http://yxxglfw.com/app/yxx/fwpt/images/c2_img1.png");
  background-repeat: no-repeat;
  animation: jumpBoxHandler 2.5s infinite;
}
@keyframes jumpBoxHandler {
  /* css事件 */
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
.coment_d:has(.bk:hover) .bk_foot1 > .bk_light1 {
  opacity: 1;
  animation: fadeIn 1.5s;
}

.bk_light1 {
  position: relative;
  height: 120px;
  top: -10%;
  left: -13%;
  background: url("http://yxxglfw.com/app/yxx/fwpt/images/light.png");
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0;
  &:hover {
    opacity: 1;
    animation: fadeIn 1.5s;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.bk_center2 {
  // width: 100%;
  // margin-top: 2.8% !important;
  // margin-left: -13%;
  height: 100%;
  background: url("@/assets/images/cateen/bg_d2_9.png");
  background-size: 60%;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  transition: all 0.5s linear;
  transform-style: preserve-3d;
  z-index: 99;
  &:hover {
    transform: rotateY(360deg) translateZ(0);
  }
}
.bk_center3 {
  // width: 100%;
  // margin-top: 2.3% !important;
  // margin-left: -13%;
  height: 100%;
  background: url("@/assets/images/cateen/bg_d3_9.png");
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  transition: all 0.5s linear;
  transform-style: preserve-3d;
  z-index: 99;
  &:hover {
    transform: rotateY(360deg) translateZ(0);
  }
}
.bk_center4 {
  // width: 100%;
  // margin-top: 0% !important;
  // margin-left: -16%;
  height: 100%;
  background: url("@/assets/images/cateen/bg_d4_9.png");
  background-size: 60%;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  transition: all 0.5s linear;
  transform-style: preserve-3d;
  z-index: 99;
  &:hover {
    transform: rotateY(360deg) translateZ(0);
  }
}
.bk_center5 {
  // width: 100%;
  // margin-top: 0% !important;
  // margin-left: -15%;
  height: 100%;
  background: url("@/assets/images/cateen/bg_d5_9.png");
  background-size: 60%;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  transition: all 0.5s linear;
  transform-style: preserve-3d;
  z-index: 99;
  &:hover {
    transform: rotateY(360deg) translateZ(0);
  }
}
.bk_center6 {
  // width: 100%;
  // margin-top: 0% !important;
  // margin-left: -18%;
  height: 100%;
  background: url("@/assets/images/cateen/bg_d6_9.png");
  background-size: 64%;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  transition: all 0.5s linear;
  transform-style: preserve-3d;
  z-index: 99;
  &:hover {
    transform: rotateY(360deg) translateZ(0);
  }
}
@keyframes border-animate {
  0%,
  100% {
    clip-path: inset(0 0 239px 0);
  }
  25% {
    clip-path: inset(0 180px 0 0);
  }
  50% {
    clip-path: inset(239px 0 0 0);
  }
  75% {
    clip-path: inset(0 0 0 180px);
  }
}

.neon {
  position: absolute;
  bottom: 110px;
  padding-left: 25px;
  color: #cce7f8;
  font-size: 2.5rem;
  font-family: "Pacifico", cursive;
  text-transform: uppercase;
  text-shadow: 0 0 6px rgba(182, 211, 207, 0.9),
    0 0 30px rgba(182, 211, 207, 0.3), 0 0 12px rgba(15, 115, 223, 0.5),
    0 0 21px rgba(15, 115, 223, 0.9), 0 0 34px rgba(15, 115, 223, 0.8),
    0 0 54px rgba(15, 115, 223, 0.9);
}
</style>
