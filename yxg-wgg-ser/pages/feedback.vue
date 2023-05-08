<template>
  <!-- <van-button type="primary" @click="showToast('toast')">button</van-button>
  <VanButton type="success" @click="showNotify('notify')">button</VanButton>
  <LazyVanButton type="default">lazy button</LazyVanButton> -->
  <van-nav-bar title="反馈建议" />
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="feed.username"
        autosize
        name="username"
        label="昵称"
        left-icon="smile-o"
        placeholder="您的昵称"
        maxlength="12"
        :rules="[{ required: true, message: '请填写您的昵称' }]"
      />
      <van-field
        v-model="feed.phone"
        name="phone"
        type="tel"
        left-icon="phone-o"
        label="手机号"
        placeholder="手机号"
        maxlength="11"
        :rules="[
          { required: true, message: '请填写您的手机号' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误！' },
        ]"
      />
      <van-field
        v-model="feed.msg"
        name="msg"
        rows="2"
        autosize
        label="留言"
        type="textarea"
        maxlength="150"
        placeholder="请输入留言"
        show-word-limit
        left-icon="info-o"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
      <div></div>
    </div>
  </van-form>
</template>

<script>
export default {
  setup() {
    const router = useRouter();
    const feed = reactive({
      username: "",
      phone: "",
      msg: "",
    });
    const onSubmit = async (values) => {
      const { data } = await useFetch("/feed", {
        method: "post",
        mode: "no-cors",
        body: { values },
        onResponse({ request, response, options }) {
          // Process the response data
          return response._data;
        },
      });
      if (data._value == 1) {
        showToast("留言提交成功！");
        setTimeout(window.location.reload(), 1500);
      } else {
        showToast("服务器繁忙,请稍后再试！");
      }
    };
    return {
      feed,
      onSubmit,
    };
  },
};
</script>
