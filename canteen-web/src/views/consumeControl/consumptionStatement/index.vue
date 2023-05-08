<template>
  <div>
    <GearHeader />
    <el-card class="box-shadow-none m-20" :body-style="{ padding: '0' }">
      <div class="w-100 p-10">
        <div class="flex-row align-center p-10 justify-between">
          <!--          <div class="toggle-box font-size-14">
            <a @click="toggleScreen" href="javascript:void(0)"
               class="el-text-primary " :title=" isShowScreen === true ? '点击收起搜索条件' : '点击展开搜索条件'">
              筛选
              <i :class="isShowScreen === true ? 'el-icon-arrow-down icon-show': 'el-icon-arrow-down icon-hide' " ></i>
            </a>
            <span class="ml-5" v-if="!isShowScreen">
                  已选条件：
                <el-tag size="small" >起止时间：{{select_date[0]}} - {{select_date[1]}}</el-tag>
            </span>
          </div>-->
          <div>
            <a :href="downloadUrl">
              <el-button type="warning" size="small" icon="el-icon-download"
                >导出</el-button
              >
            </a>
          </div>
        </div>
        <div>
          <transition name="slide-fade">
            <div class="screen-box p-10">
              <div>
                <el-form size="small" inline>
                  <el-form-item label="起止时间：">
                    <template>
                      <el-radio v-model="type" label="1" @change="getDateTime"
                        >当日</el-radio
                      >
                      <el-radio v-model="type" label="2" @change="getDateTime"
                        >当月</el-radio
                      >
                      <el-radio v-model="type" label="3" @change="getDateTime"
                        >当年</el-radio
                      >
                    </template>
                    &nbsp;&nbsp;
                    <el-date-picker
                      :clearable="false"
                      :editable="false"
                      v-model="select_date"
                      type="daterange"
                      format="yyyy年MM月dd日"
                      unlink-panels
                      value-format="yyyy-MM-dd"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    />
                  </el-form-item>
                  &nbsp;&nbsp;

                  <el-form-item label="消费类型：">
                    <!--                    <template>
                      <el-select v-model="value" clearable placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.orgType"
                            :value="item.value">
                        </el-option>
                      </el-select>
                    </template>-->

                    <template>
                      <el-select
                        v-model="value"
                        @change="getOrgType"
                        clearable
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in options"
                          :key="item.orgType"
                          :label="item.orgType"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </el-form-item>
                </el-form>
              </div>
              <div class="flex-row justify-end">
                <el-form size="small" inline>
                  <el-form-item>
                    <el-button @click="queryData" type="primary"
                      >查询</el-button
                    >
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      @click="resetData()"
                      type="primary"
                      icon="el-icon-refresh"
                    ></el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="showDialog" type="info"
                      >查看现场监控</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
              <el-dialog
                title="就餐区监控"
                :visible.sync="dialogVisible"
                :before-close="handleClose"
              >
                <!-- <span>这是一段提示文字</span> -->
                <section
                  id="wrapper"
                  style="width: 100%; height: 100%"
                ></section>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="handleConfirm"
                    >确定</el-button
                  >
                </div>
              </el-dialog>
            </div>
          </transition>
        </div>
      </div>

      <div style="margin-left: 10px" class="font-size-15 mb-15">
        <el-row>
          <el-col :span="4">
            消费总金额：¥{{ amount.total_price | price }}
          </el-col>
          <el-col :span="4">
            实际消费金额：¥{{ amount.real_price | price }}
          </el-col>
          <el-col :span="4">
            退款总金额：¥{{ amount.refund_price | price }}
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="purchaseSummaryList"
        size="mini"
        v-loading="loading"
        :header-cell-style="{ 'text-align': 'center', color: '#000' }"
      >
        <el-table-column type="index" label="序号" />
        <el-table-column prop="username" label="名字" />
        <el-table-column prop="depart_name" label="部门" />
        <el-table-column label="类型">
          <template slot-scope="scope"
            ><div>{{ scope.row.type | stateFormat }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="pay_num" label="有效消费次数" />
        <el-table-column prop="date" label="交易时间" />
        <el-table-column label="实际消费金额">
          <template slot-scope="scope"
            ><div class="text-red">￥{{ scope.row.real_price | price }}</div>
          </template>
        </el-table-column>
        <el-table-column label="消费总金额">
          <template slot-scope="scope"
            ><div class="text-red">￥{{ scope.row.total_price | price }}</div>
          </template>
        </el-table-column>
        <el-table-column label="退款总金额">
          <template slot-scope="scope"
            ><div class="text-red">￥{{ scope.row.refund | price }}</div>
          </template>
        </el-table-column>
        <el-table-column label="钱包余额" v-if="isPerson == true">
          <template slot-scope="scope"
            ><div class="text-red">￥{{ scope.row.balance | price }}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="paging">
        <el-pagination
          @size-change="changePageSize"
          @current-change="changepageIndex"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { supplierMiniList } from "@/api/supplierManagement";
import { allWareHouseList } from "@/api/rawStock";
import { wHouseAllRaw } from "@/api/purchaseWh";
import { purchaseSummary, ConsumptionCount } from "@/api/consumption";
import { adminUser } from "@/api/wallet";
import { kang_url } from "@/utils/baceurl";
import GearHeader from "@/components/GearHeader";
import ChimeePlayer from "chimee-player";
import kernelFlv from "chimee-kernel-flv";

export default {
  filters: {
    price(price) {
      price = price / 100;
      return price.toFixed(2);
    },
    stateFormat(type) {
      if (type == "1") {
        return "用户";
      } else {
        return "部门";
      }
    },
  },
  data() {
    return {
      dialogVisible: false,
      isPerson: true,
      canteenType: [], // 食堂类型
      canteenId: "1,2,3", // 食堂ID
      amount: {}, // 全部食堂（追加数据）
      canteenId_arry: [], // 全部食堂ID
      wareHouseList: [],
      wHouse_id: "",
      pageSize: 10,
      pageTotal: 0,
      pageIndex: 1,
      type: "1",
      orgType: "",
      keywords: "",
      isQuery: false,
      select_date: [],
      supplierMini: [],
      supplierId: "",
      list: [],
      isShowScreen: false,
      rawMaterialDialogVisible: false,
      totalBaseData: [],
      // 所有分类
      totalTypeData: [],
      raw_type_id: "",
      rawPageTotal: 0,
      rawPageIndex: 1,
      rawPageSize: 10,
      rawKeyWords: "",
      rawDataList: [],
      rawWareHouseList: [],
      rawHouse_id: "",
      wHouseRawList: [],
      rawCheckedAll: false,
      //  汇总方式
      summaryList: [
        {
          id: 1,
          name: "按原料汇总",
        },
        {
          id: 2,
          name: "按供应商汇总",
        },
        {
          id: 3,
          name: "按申购人员汇总",
        },
      ],
      summaryId: 1,
      purchaseSummaryList: [],
      //  要提交的原料id
      raw_id_list: [],
      //  操作人
      admin_username: "",
      adminUserList: [],
      loading: false,
      downloadUrl: "",
      options: [
        {
          value: "",
          orgType: "全部",
        },
        {
          value: "1",
          orgType: "个人",
        },
        {
          value: "2",
          orgType: "部门",
        },
      ],
      value: "",
    };
  },
  components: {
    GearHeader,
  },
  methods: {
    loadChimeePlayer() {
      setTimeout(() => {
        let chiee = new ChimeePlayer({
          wrapper: "#wrapper", // video dom容器
          src: "http://171.221.174.110:8999/hdl/live101/114.flv",
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
      }, 1);
    },
    showDialog() {
      this.dialogVisible = true;
      this.loadChimeePlayer();
    },
    handleClose(done) {
      this.$confirm("确定关闭弹窗吗？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    handleConfirm() {
      this.dialogVisible = false;
      // 执行确认操作
    },
    // 食堂初始化
    canteenInit() {
      this.canteenId = this.newCanteen_check;
    },
    getSupplierMini() {
      supplierMiniList({ canteen_id: this.canteenId })
        .then((res) => {
          this.supplierMini = res.data.data;
        })
        .catch((err) => console.log(err));
    },
    getOrgType(params) {
      this.orgType = params;
      //debugger;
    },
    // 选择食堂操作
    changecanteen(value) {
      // this.isSearch = false
      this.canteenId = value;
      this.pageIndex = 1;
      this.getPurchaseSummaryList();
    },
    getAllWareHouseList() {
      allWareHouseList({})
        .then((response) => {
          this.wareHouseList = response.data.data;
          this.rawWareHouseList = JSON.parse(
            JSON.stringify(response.data.data)
          );
          if (this.rawWareHouseList.length > 0)
            this.rawHouse_id = this.rawWareHouseList[0].id;
          if (this.wareHouseList.length > 0) {
            this.wareHouseList.unshift({
              id: "",
              whouse_name: "全部",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changePageSize(newPageSize) {
      this.isClickQuery();
      this.pageIndex = 1;
      this.pageSize = newPageSize;
      this.getPurchaseSummaryList();
    },
    changepageIndex(newPageIndex) {
      this.isClickQuery();
      this.pageIndex = newPageIndex;
      this.getPurchaseSummaryList();
    },
    queryData() {
      this.isQuery = true;
      if (this.summaryId === 1) {
        this.supplierId = "";
        this.admin_username = "";
      }
      if (this.summaryId === 2) {
        // this.supplierId = ''
        this.admin_username = "";
      }
      if (this.summaryId === 3) {
        this.supplierId = "";
        // this.admin_username = ''
      }
      this.getPurchaseSummaryList();
    },
    resetData() {
      this.isQuery = false;
      this.pageSize = 10;
      this.pageIndex = 1;
      this.canteenInit();
      this.getCurrentMounth();
      this.wHouse_id = "";
      this.raw_id_list = [];
      this.summaryId = 1;
      this.supplierId = "";
      this.admin_username = "";
      this.getPurchaseSummaryList();
    },
    isClickQuery() {
      if (!this.isQuery) {
        this.wHouse_id = "";
        this.raw_id_list = [];
        this.summaryId = 1;
        this.supplierId = "";
        this.admin_username = "";
      }
    },
    toggleScreen() {
      this.isShowScreen = !this.isShowScreen;
    },
    selectRawMaterialClick() {
      this.getTypeList();
      this.getwHouseRawList();
      this.getRawList();
      this.rawCheckedAll = false;
      this.rawMaterialDialogVisible = true;
    },
    // 获取所有分类
    getTypeList() {
      typeList({ page: 0 })
        .then((response) => {
          this.totalTypeData = response.data.data;
          if (this.totalTypeData.length > 0) {
            this.totalTypeData.unshift({
              id: "",
              type_name: "全部",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    selectTypeIndex(id) {
      if (id === this.raw_type_id) return;
      // this.activeIndex = index
      this.raw_type_id = id;
      this.getRawList();
    },
    rawChangePageSize(newPageSize) {
      this.rawPageIndex = 1;
      this.rawPageSize = newPageSize;
      this.getRawList();
    },
    rawChangepageIndex(newPageIndex) {
      this.rawPageIndex = newPageIndex;
      this.getRawList();
    },
    getwHouseRawList() {
      var obj = {};
      obj.house_id = this.rawHouse_id;
      wHouseAllRaw(obj)
        .then((response) => {
          console.log("获取仓库原料库存", response);
          this.wHouseRawList = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeRawChecked() {
      const count = this.rawDataList.filter((x) => x.checked === true).length;
      this.rawCheckedAll = count === this.rawDataList.length;
    },
    changerawCheckedAll() {
      this.rawDataList = this.rawDataList.map((i) =>
        Object.assign(i, {
          checked: this.rawCheckedAll,
        })
      );
    },
    //选择仓库
    selectWh() {
      this.getwHouseRawList();
      this.getRawList();
    },
    getNowFormatDate() {
      let date = new Date();
      let seperator1 = "-";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    //获取当前月
    getCurrentMounth() {
      const arr = this.getNowFormatDate().split("-");
      // const currentMounthOneDay =
      //this.select_date = [`${arr[0]}-${arr[1]}-01`,this.getNowFormatDate()]
      this.select_date = [this.getNowFormatDate(), this.getNowFormatDate()];
    },
    getCurrentMonthLast() {
      var date = new Date();
      var currentMonth = date.getMonth();
      var nextMonth = ++currentMonth;
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
      var oneDay = 1000 * 60 * 60 * 24;
      var lastTime = new Date(nextMonthFirstDay - oneDay);
      var month = parseInt(lastTime.getMonth() + 1);
      var day = lastTime.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return date.getFullYear() + "-" + month + "-" + day;
    },
    getDateTime(day) {
      //debugger
      const arr = this.getNowFormatDate().split("-");
      if (day == 1) {
        this.select_date = [this.getNowFormatDate(), this.getNowFormatDate()];
      } else if (day == 2) {
        this.select_date = [
          `${arr[0]}-${arr[1]}-01`,
          this.getCurrentMonthLast(),
        ];
      } else if (day == 3) {
        this.select_date = [`${arr[0]}-01-01`, `${arr[0]}-12-31`];
      }
    },
    selectRawMaterial() {
      this.raw_id_list = this.rawDataList.filter((x) => x.checked === true);
      this.rawMaterialDialogVisible = false;
    },
    //获取当前账号的子账号
    getAdminUser() {
      adminUser({})
        .then((response) => {
          this.adminUserList = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //  获取数据
    getPurchaseSummaryList() {
      // purchaseSummaryList
      this.loading = true;
      if (this.orgType == "2") {
        this.isPerson = false;
      } else {
        this.isPerson = true;
      }

      let obj = {
        canteen_id: this.canteenId,
        date_start: this.select_date[0],
        date_end: this.select_date[1],
        page: this.pageIndex,
        page_size: this.pageSize,
      };

      let amountObj = {
        canteen_id: this.canteenId,
        date_start: this.select_date[0],
        date_end: this.select_date[1],
      };
      if (this.value !== "") Object.assign(obj, { type: this.orgType });
      purchaseSummary(obj)
        .then((res) => {
          const {
            data: {
              data: { total, data },
            },
          } = res;
          this.purchaseSummaryList = data;
          this.pageTotal = total;
          this.initDownLoadUrl();
          this.hideLoading();
        })
        .catch((err) => {
          console.error(err);
          this.hideLoading();
        });

      if (this.value !== "") Object.assign(amountObj, { type: this.orgType });
      ConsumptionCount(amountObj).then((res) => {
        this.amount = res.data.data;
      });
    },
    hideLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    // 初始化下载链接
    initDownLoadUrl() {
      this.downloadUrl = `${kang_url}/excel/order/user/pay/list?canteen_id=${
        this.canteenId
      }&
        date_start=${this.select_date[0]}&date_end=${this.select_date[1]}
        ${this.orgType !== "" ? "&type=" + this.orgType : ""}`;
    },
    rawMaterialDialogClosed() {
      this.rawKeyWords = "";
    },
    removeRawId(id) {
      const index = this.raw_id_list.findIndex((x) => x.id === id);
      this.raw_id_list.splice(index, 1);
    },
  },
  created() {},
  mounted() {
    this.getCurrentMounth();
    this.canteenInit();
    this.getAdminUser();
    this.getAllWareHouseList();
    this.getSupplierMini();
    this.getPurchaseSummaryList();
  },
  watch: {
    rawKeyWords(curVal, oldVal) {
      //实现input连续输入，只发一次请求
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.getRawList();
      }, 500);
    },
    newCanteen_check() {
      this.canteenId = this.newCanteen_check;
      this.pageIndex = 1;
      this.getPurchaseSummaryList();
    },
  },
  computed: {
    ...mapGetters(["canteen_info", "canteen_check", "newCanteen_check"]),
  },
};
</script>
<style lang="scss" scoped>
.screen-box {
  /*border: 1px solid #EBEEF5;*/
}
.dialog-right {
  border-left: 1px solid #ebeef5;
}
.toggle-box::after {
  position: absolute;
  z-index: 2;
  width: 100px;
  height: 60px;
  border: 1px solid #ebeef5;
}
.slide-fade-enter-active {
  /*background: green;*/
  /*transition: all .3s ease;*/
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
  transform: translateY(20);
  opacity: 0;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
  /*background: pink;*/
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  /*transform: translateX(10px);*/
  /*opacity: 0;*/
  transform: translateY(-20);
  opacity: 0;
  /*background: red;*/
}
.icon-show {
  /*ease-in-out 0s 1 alternate forwards*/
  animation: icon-show 0.2s linear forwards;
}
.icon-hide {
  animation: icon-hide 0.2s linear forwards;
}
@keyframes icon-show {
  0% {
    -webkit-transform: rotate(0deg);
  }
  25% {
    -webkit-transform: rotate(45deg);
  }
  50% {
    -webkit-transform: rotate(90deg);
  }
  75% {
    -webkit-transform: rotate(135deg);
  }
  100% {
    -webkit-transform: rotate(180deg);
  }
}
@keyframes icon-hide {
  0% {
    -webkit-transform: rotate(180deg);
  }
  25% {
    -webkit-transform: rotate(135deg);
  }
  50% {
    -webkit-transform: rotate(90deg);
  }
  75% {
    -webkit-transform: rotate(45deg);
  }
  100% {
    -webkit-transform: rotate(0deg);
  }
}
.select-raw {
  border-bottom: 1px solid #c0c4cc;
}
</style>
<style>
.purchaseSummary-thead-tip {
  background: #909399;
  color: #fff;
  border: none;
}
</style>
