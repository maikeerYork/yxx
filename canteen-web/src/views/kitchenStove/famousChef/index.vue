<template>
  <div id="box">
    <div class="box_left">
      <!-- <el-input v-model="value" placeholder="请输入"></el-input> -->
      <el-tree
        :data="list"
        :props="defaultProps"
        @node-click="handleNodeClick"
        node-key="id"
        :tree-props="{children:'child'}"
        default-expand-all
      ></el-tree>
    </div>
    <div id="box_right">
      <div class="box_right_top" id="box_right_top">
        <div v-if="multilayer_num == 1" style="width: 100%; height: 100%">
          <div id="wrapper" style="width: 100%; height: 100%"></div>
        </div>
        <div
          style="width: 100%; height: 100%"
          v-else-if="multilayer_num == 2"
          class="multilayer2"
        >
          <div id="wrapper_1"></div>
          <div id="wrapper_2"></div>
          <div id="wrapper_3"></div>
          <div id="wrapper_4"></div>
        </div>
        <div
          style="width: 100%; height: 100%"
          v-else-if="multilayer_num == 3"
          class="multilayer3"
        >
          <div class="multilayer3_left">
            <div id="wrapper_1"></div>
            <div id="wrapper_2"></div>
          </div>
          <div class="multilayer3_right">
            <div id="wrapper_3"></div>
            <div id="wrapper_4"></div>
            <div id="wrapper_5"></div>
          </div>
        </div>
        <div
          style="width: 100%; height: 100%"
          v-else-if="multilayer_num == 4"
          class="multilayer4"
        >
          <div class="multilayer4_left">
            <div class="multilayer4_left_big">
              <div id="wrapper_1" style="width: 100%; height: 100%"></div>
            </div>
            <div class="multilayer4_left_botton">
              <div class="multilayer4_left_botton_left">
                <div id="wrapper_4" style="width: 100%; height: 100%"></div>
              </div>
              <div class="multilayer4_left_botton_right">
                <div id="wrapper_5" style="width: 100%; height: 100%"></div>
              </div>
            </div>
          </div>
          <div class="multilayer4_right">
            <div class="multilayer4_right_top">
              <div id="wrapper_2" style="width: 100%; height: 100%"></div>
            </div>
            <div class="multilayer4_right_content">
              <div id="wrapper_3" style="width: 100%; height: 100%"></div>
            </div>
            <div class="multilayer4_right_botton">
              <div id="wrapper_6" style="width: 100%; height: 100%"></div>
            </div>
          </div>
        </div>
        <div
          style="width: 100%; height: 100%"
          v-else-if="multilayer_num == 5"
          class="multilayer5"
        >
          <div id="wrapper_1"></div>
          <div id="wrapper_2"></div>
          <div id="wrapper_3"></div>
          <div id="wrapper_4"></div>
          <div id="wrapper_5"></div>
          <div id="wrapper_6"></div>
          <div id="wrapper_7"></div>
          <div id="wrapper_8"></div>
          <div id="wrapper_9"></div>
        </div>
        <div
          style="width: 100%; height: 100%"
          v-else-if="multilayer_num == 6"
          class="multilayer6"
        >
          <div id="wrapper_1"></div>
          <div id="wrapper_2"></div>
          <div id="wrapper_3"></div>
          <div id="wrapper_4"></div>
          <div id="wrapper_5"></div>
          <div id="wrapper_6"></div>
          <div id="wrapper_7"></div>
          <div id="wrapper_8"></div>
          <div id="wrapper_9"></div>
          <div id="wrapper_10"></div>
          <div id="wrapper_11"></div>
          <div id="wrapper_12"></div>
          <div id="wrapper_13"></div>
          <div id="wrapper_14"></div>
          <div id="wrapper_15"></div>
          <div id="wrapper_16"></div>
        </div>
      </div>
      <div class="box_right_botton">
        <div class="left">
          <div class="i_con" @click="multilayer(1)">
            <img src="@/assets/images/icon/1.png" alt="" />
          </div>
          <div class="i_con" @click="multilayer(2)">
            <img src="@/assets/images/icon/4.png" alt="" />
          </div>
          <div class="i_con" @click="multilayer(3)">
            <img src="@/assets/images/icon/5.png" alt="" />
          </div>
          <div class="i_con" @click="multilayer(4)">
            <img src="@/assets/images/icon/6.png" alt="" />
          </div>
          <div class="i_con" @click="multilayer(5)">
            <img src="@/assets/images/icon/9.png" alt="" />
          </div>
          <div class="i_con" @click="multilayer(6)">
            <img src="@/assets/images/icon/16.png" alt="" />
          </div>
        </div>
        <div class="right">
          <div
            @click="toggleFullscreen"
            alt=""
            style="display: flex; align-items: center"
          >
            <img src="@/assets/images/icon/qp.png" class="qp_img" />
            <span style="color: #fff">全屏展示</span>
          </div>
          <img src="@/assets/images/icon/left.png" alt="" />
          <span style="color: #fff">{{ nowIndex }}/{{ src.length }}</span>
          <img src="@/assets/images/icon/right.png" alt="" @click="next" />
        </div>
      </div>
    </div>
  </div>
</template>
  <script type="text/javascript" src="./js/HLC_paly/hls.js"></script>
  <script>
import { getMonitoring } from "@/api/supervisory";
import { getLocalMonitoring } from "@/api/supervisory";
import screenfull from "screenfull";
import ChimeePlayer from "chimee-player";
import kernelFlv from "chimee-kernel-flv";

export default {
  data() {
    return {
      list: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      value: "",
      // src:'http://171.221.174.110:7086/live/cameraid/1000016%2425/substream/1.m3u8'
      src: [],
      chimee: "",
      multilayer_num: 1, //切屏数量
      nowIndex: 1,
    };
  },
  mounted() {
    this.oo();
  },
  methods: {
    async toggleFullscreen() {
      const ele = document.getElementById("box_right"); //指定全屏区域元素
      if (screenfull.isEnabled) {
        this.flag = !this.flag;
        screenfull.request(ele);
      }
      if (screenfull.isEnabled && screenfull.isFullscreen) {
        screenfull.exit();
      }
    },
    setVideo() {
      let that = this;
      let chiee = new ChimeePlayer({
        wrapper: "#wrapper", // video dom容器
        src: that.src[0],
        box: "flv",
        isLive: true,
        autoplay: true,
        controls: true,
        kernels: {
          flv: {
            handler: kernelFlv,
          },
        },
      });
      // this.$store.state.chimee.push(chiee)
      this.$store.dispatch("operationChimee", { chiee: chiee });
    },
    async oo() {
      var that = this;
      let res = await getLocalMonitoring({
        canteen_id: that.$store.state.canteen_id,
      });
      that.list = res.data.data;
      that.list.forEach((item) => {
        item.label = item.name;
        item.children = item.child;
        item.child.forEach((child_item) => {
          child_item.label = child_item.name;
          child_item.children = child_item.child;
        });
      });
      that.src.push(res.data.data[0].child[0].play_url);
      that.setVideo(); 
    },
    handleNodeClick(a) {
      console.log(a, "a");
      this.src = [];
      this.$store.state.chimee.forEach((element) => {
        element.destroy();
      });
      this.$store.state.chimee = [];
      if (a.children.length) {
        a.children.forEach((element) => {
          this.src.push(element.play_url);
        });
      } else {
        this.src.push(a.play_url);
      }
      if (this.multilayer_num == 1) {
        setTimeout(() => {
          document.getElementById("wrapper").innerHTML = "";
          this.setVideo();
        }, 10);
      } else if (this.multilayer_num == 2) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 3) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: false,
              kernels: {
                flv: {
                  handler: kernelFlv,
                },
              },
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      } else if (this.multilayer_num == 3) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 4) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
              kernels: {
                flv: {
                  handler: kernelFlv,
                },
              },
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      } else if (this.multilayer_num == 4) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 5) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      } else if (this.multilayer_num == 5) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 10) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      } else if (this.multilayer_num == 6) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 17) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      }
    },
    multilayer(num) {
      this.multilayer_num = num;
      console.log(this.multilayer_num, "this.multilayer_num");
      if (this.$store.state.chimee.length) {
        this.$store.state.chimee.forEach((item) => {
          item.destroy();
        });
        this.$store.state.chimee = [];
      }
      if (this.multilayer_num == 1) {
        setTimeout(() => {
          this.setVideo();
        }, 10);
      } else if (this.multilayer_num == 2) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 3) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      } else if (this.multilayer_num == 3) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 4) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      } else if (this.multilayer_num == 4) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 5) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      } else if (this.multilayer_num == 5) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 10) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      } else if (this.multilayer_num == 6) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 17) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      }
    },
    next() {
      if (this.$store.state.chimee.length) {
        this.$store.state.chimee.forEach((item) => {
          item.destroy();
        });
        this.$store.state.chimee = [];
      }
      if (this.multilayer_num == 1) {
        setTimeout(() => {
          this.setVideo();
        }, 10);
      } else if (this.multilayer_num == 2) {
        this.nowIndex += 4;
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 3) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      } else if (this.multilayer_num == 3) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 4) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      } else if (this.multilayer_num == 4) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 5) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      } else if (this.multilayer_num == 5) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 10) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      } else if (this.multilayer_num == 6) {
        setTimeout(() => {
          this.src.forEach((element, index) => {
            if (index > 17) return;
            let chiee = new ChimeePlayer({
              wrapper: "#wrapper_" + (index + 1), // video dom容器
              src: element,
              box: "flv",
              isLive: true,
              autoplay: true,
              controls: true,
            });
            // this.$store.state.chimee.push(chiee)
            this.$store.dispatch("operationChimee", { chiee: chiee });
          });
        }, 10);
      }
    },
  },
};
</script>
  
  <style lang="scss" scoped>
#box {
  width: 100%;
  height: 96%;
  display: flex;

  .box_left {
    box-sizing: border-box;
    width: 15%;
    height: 100%;
    background-color: #fff;
    padding-left: 30px;
    overflow: auto;
    padding-bottom: 10px;
    background-image: url("@/assets/images/cateen/lights.jpg");
  }

  #box_right {
    width: 85%;
    height: 100%;
    background-color: rgb(4, 4, 4);

    .box_right_top {
      width: 100%;
      height: 90%;
    }

    .box_right_botton {
      width: 100%;
      height: 10%;
      display: flex;
      justify-content: space-between;

      .left {
        width: 300px;
        height: 100%;
        display: flex;
        background-color: rgb(4, 4, 4);
        justify-content: space-around;
        align-items: center;
        padding-left: 0;

        .i_con {
          width: 25px;
          height: 25px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .right {
        width: 250px;
        height: 90%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        img {
          width: 25px;
          height: 25px;
        }
        .qp_img {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
}

/deep/.el-input__inner {
  margin: 30px auto;
  border: 1px solid #000;
  width: 80%;
}

/deep/.el-card__body {
  padding: 10px;
}
.multilayer2 {
  display: flex;
  flex-wrap: wrap;
  div {
    width: 50%;
    height: 50%;
    border: 1px solid rgb(194, 91, 91);
  }
}
.multilayer3 {
  display: flex;
  // flex-wrap: wrap;
  .multilayer3_left {
    width: 50%;
    height: 100%;
    border: 1px solid rgb(194, 91, 91);
    div {
      width: 100%;
      height: 50%;
      border: 1px solid rgb(194, 91, 91);
    }
  }
  .multilayer3_right {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border: 1px solid rgb(194, 91, 91);
    div {
      width: 100%;
      height: 33.3%;
      border: 1px solid rgb(194, 91, 91);
    }
  }
}
.multilayer4 {
  display: flex;
  .multilayer4_left {
    width: 60%;
    height: 100%;
    border: 1px solid rgb(194, 91, 91);
    // display: flex;
    .multilayer4_left_botton {
      height: 40%;
      width: 100%;
      display: flex;
      border: 1px solid rgb(194, 91, 91);
      .multilayer4_left_botton_left {
        width: 50%;
        height: 100%;
        border: 1px solid rgb(194, 91, 91);
      }
      .multilayer4_left_botton_right {
        width: 50%;
        height: 100%;
        border: 1px solid rgb(194, 91, 91);
      }
    }
    .multilayer4_left_big {
      height: 60%;
      width: 100%;
      border: 1px solid rgb(194, 91, 91);
    }
  }
  .multilayer4_right {
    width: 40%;
    height: 100%;
    border: 1px solid rgb(194, 91, 91);
    .multilayer4_right_top,
    .multilayer4_right_content,
    .multilayer4_right_botton {
      width: 100%;
      height: 33.3%;
      border: 1px solid rgb(194, 91, 91);
    }
  }
}
.multilayer5 {
  display: flex;
  flex-wrap: wrap;
  div {
    width: 33.3%;
    height: 33.3%;
    border: 1px solid rgb(194, 91, 91);
  }
}
.multilayer6 {
  display: flex;
  flex-wrap: wrap;
  div {
    width: 25%;
    height: 25%;
    border: 1px solid rgb(194, 91, 91);
  }
}
/deep/.el-tree-node__content:hover {
  background-color: #fcefd2 !important;
  color: rgb(7, 7, 7);
}
.el-tree {
  background-image: url("@/assets/images/cateen/lights.jpg") !important;
  color: #fff;
  margin-top: 22%;
}
/deep/.el-tree-node:focus > .el-tree-node__content {
  background-color: #fcefd2 !important;
  color: rgb(7, 7, 7);
}
</style>