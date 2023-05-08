<template>
  <div class="container">
    <div class="head">
      <div class="title">智慧食堂阳光公示</div>
    </div>
    <div class="content"></div>
  </div>
</template>
<script>
</script>
<style scoped>
.container {
  position: fixed;
  width: 100%;
  height: 100%;
  color: #fff;
  background: #010c1d;
}
.head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 13%;
  background: url("@/assets/static/img/head_maxshow.png");
  background-size: cover;
  background-repeat: no-repeat;
}
.title {
  font-size: 2.5vw;
  background: -webkit-linear-gradient(left, #00fcee, #00afff);
  -webkit-background-clip: text; /*背景被裁剪到文字*/
  background-clip: text;
  -webkit-text-fill-color: transparent; /*设置文字的填充颜色*/
}
</style>