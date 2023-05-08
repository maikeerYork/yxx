<template>
  <el-select
    v-model="clientId"
    multiple
    collapse-tags
    placeholder="请选择"
    clearable
    @change="changeClient"
  >
    <el-option
      v-for="item in clientEquipment"
      :key="item.client_id"
      :label="item.client_name"
      :value="item.client_id"
      :disabled="clientId.length == 1 && clientId[0] == item.client_id"
    />
  </el-select>
</template>
<script>
import { mapGetters } from "vuex";
import { getEquipment } from "@/api/allClientSelect";
export default {
  components: {},
  props: {
    clientType: String,
  },
  data() {
    return {
      clientId: [], // 食堂设备ID
      clientEquipment: [], // 当前食堂设备
      allclientType: {}, // 全部设备（追加数据）
    };
  },
  computed: {
    ...mapGetters(["newCanteen_check"]),
  },
  watch: {
    newCanteen_check() {
      this.getEquipment();
    },
  },
  created() {
    this.getEquipment(); // 获取全部设备
  },
  mounted() {},
  methods: {
    // 获取设备号
    getEquipment() {
      getEquipment({
        canteen_id: this.newCanteen_check,
        client_type: this.clientType,
      })
        .then((response) => {
          // 获取设备信息
          console.log(response, "this.clientEquipment");
          this.clientEquipment = response.data.data;
          this.clientId = [];
          this.clientEquipment.forEach((element) => {
            this.clientId.push(element.client_id);
          });
          this.$store.state.newClient_id = this.clientId.join()
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 选择设备号
    changeClient(value) {
      this.$store.state.newClient_id = this.clientId.join()
    },
  },
};
</script>
