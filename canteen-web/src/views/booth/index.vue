<template>
  <div id="container"></div>
</template>   

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "@vue/reactivity";

export default {
  name: "amap",
  data() {
    return {
      mapSvg: require("@/assets/images/icon/flag.png"),
      ringSvg: require("@/assets/svg/rings.svg"),
    };
  },
  setup() {
    const map = shallowRef(null);
    return {
      map,
    };
  },
  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap();
  },
  created() {
    let _this = this;
    window.openCarteen = _this.openCarteen;
  },
  methods: {
    initMap() {
      let that = this;
      that.map = AMapLoader.load({
        key: "4f127cda10cdfca8bdf46595b1d84a99", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [""], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", {
            //设置地图容器id
            resizeEnable: true,
            viewMode: "3D", //是否为3D地图模式
            zoom: 16, //初始化地图级别
            center: [104.070747, 30.663562], //初始化地图中心点位置
            features: ["bg", "road"],
          });
          //104.059411,30.666106 省二办
          //104.078467,30.661309 永兴巷
          let markers = [
            {
              icon: that.mapSvg,
              position: [104.059411, 30.666106],
              id: 7,
              label:
                "<div class='info'><a href='javascript:void(0)'>省委二办食堂</a></div>",
            },
            {
              icon: that.ringSvg,
              position: [104.0591, 30.6656],
              id: 7,
            },
            {
              icon: that.mapSvg,
              position: [104.078467, 30.661309],
              id: 6,
              label:
                "<div class='info'><a href='javascript:void(0)'>永兴巷食堂</a></div>",
            },
            {
              icon: that.ringSvg,
              position: [104.078156, 30.66081],
            },
          ];

          markers.forEach(function (marker) {
            var mat = new AMap.Marker({
              map: that.map,
              icon: marker.icon,
              position: [marker.position[0], marker.position[1]],
              offset: new AMap.Pixel(-30, -60),
              label: {
                content: marker.label,
                offset: new AMap.Pixel(3, 0),
                direction: "top",
              },
            });
            mat.on("click", function (e) {
              if (marker.id == 7) {
                openCarteen(marker.id);
              } else {
                window.open("http://171.221.174.110:866/RightFrame/Home/Login","_blank")
                return;
              }
            });
            that.map.add(marker);
          });

          // that.map.setFitView(markers);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    openCarteen(id) {
      let data = {
        canteen_id: id,
      };
      var canteen_id = id;
      var canteen_name = "";
      if (id == 7) {
        canteen_name = "省委二办食堂";
      }
      if (id == 6) {
        canteen_name = "永兴巷食堂";
      }
      this.$store.state.canteen_id = canteen_id;
      this.$store.state.canteen_name = canteen_name;
      this.$router.push({ path: "/canteen", query: data });
    },
  },
};
</script>
  
<style lang="scss" scoped>
@import "https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css";
html,
body,
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
}

#map-features .input-item {
  height: 2rem;
}

.amap-icon img {
  width: 60px;
  height: 60px;
}

/deep/.amap-marker-label {
  background-color: transparent;
  font-weight: bold !important;
  font-size: 18px;
  border: 1px solid black !important;
  background-color: #fff;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}

.amap-marker-label :hover {
  cursor: pointer;
}

.info {
  position: relative;
  margin: 0;
  top: 0;
  right: 0;
  min-width: 0;
  font-weight: bold;
}

a {
  text-decoration: none;
}
div {
  border: 0;
}
</style>
  
  