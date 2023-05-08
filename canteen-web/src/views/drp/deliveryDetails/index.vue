<template>
  <div>
    <GearHeader />
    <el-card class="box-shadow-none m-20" :body-style="{ padding: '0' }">
      <div class="w-100 p-10">
        <div class="flex-row align-center p-10 justify-between">
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
                  <!-- <el-form-item label="出库机构：">
                    <template>
                      <el-select v-model="orgValue" clearable placeholder="请选择">
                        <el-option
                            v-for="item in org"
                            :key="item.orgValue"
                            :label="item.label"
                            :value="item.orgValue">
                        </el-option>
                      </el-select>
                    </template>
                  </el-form-item>

                  <el-form-item label="食堂：">
                    <template>
                      <el-select v-model="canteenValue" clearable placeholder="请选择">
                        <el-option
                            v-for="item in canteen"
                            :key="item.canteenValue"
                            :label="item.label"
                            :value="item.canteenValue">
                        </el-option>
                      </el-select>
                    </template>
                  </el-form-item> -->

                  <!-- <el-form-item label="出库单号">
                    <el-input
                      v-model="documentNumber"
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item> -->
                  <!-- <el-form-item label="批次号">
                    <el-input v-model="batchNumber" placeholder="请输入内容"></el-input>
                  </el-form-item> -->
                  <el-form-item label="时间：">
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
                </el-form>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <el-table
        :data="purchaseSummaryList"
        size="mini"
        v-loading="loading"
        :header-cell-style="{ 'text-align': 'center', color: '#000' }"
      >
        <el-table-column prop="apply_no" label="出库单号" />
        <el-table-column prop="raw_no" label="食材编号" />
        <el-table-column prop="raw_name" label="食材名称" />
        <el-table-column prop="used_house_num" label="出库数量" />
        <el-table-column prop="newest_house_num" label="现存数量" />

        <el-table-column label="参考价">
          <template slot-scope="scope">￥{{
            scope.row.approval_price | price
          }}</template>
        </el-table-column>

        <el-table-column prop="update_at" label="出库时间" />
        <el-table-column prop="username" label="出库人员" />
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
    <el-dialog
      title="选择原料"
      :visible.sync="rawMaterialDialogVisible"
      :close-on-click-modal="false"
      @close="rawMaterialDialogClosed()"
      center
      width="666px"
    >
      <div>
        <el-row>
          <el-col :span="4">
            <ul
              class="list-style-none p-0 mt-20"
              v-if="totalTypeData.length > 0"
            >
              <li
                v-for="(item, index) in totalTypeData"
                :key="index"
                :class="
                  item.id === raw_type_id
                    ? 'el-bg-primary text-white pt-10 pb-10'
                    : 'bg-white text-black pt-10 pb-10'
                "
              >
                <a
                  href="javascript:;"
                  class="text-center font-size-14"
                  @click="selectTypeIndex(item.id)"
                >
                  <div class="pt-10 pb-10">
                    {{ item.type_name }}
                  </div>
                </a>
              </li>
            </ul>
            <div class="no_type_box" v-else>暂无分类</div>
          </el-col>
          <el-col :span="18" class="dialog-right">
            <div class="paging">
              <el-pagination
                small
                @size-change="rawChangePageSize"
                @current-change="rawChangepageIndex"
                :current-page="rawPageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="rawPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="rawPageTotal"
              >
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="rawMaterialDialogVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="selectRawMaterial()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { supplierMiniList } from "@/api/supplierManagement";
import { allWareHouseList } from "@/api/rawStock";
import { rawList, typeList } from "@/api/rawMaterial";
import { wHouseAllRaw } from "@/api/purchaseWh";
import { getInandOutDetail } from "@/api/ims";
import { adminUser } from "@/api/wallet";
import { kang_url } from "@/utils/baceurl";
import GearHeader from "@/components/GearHeader";
import axios from "axios";
export default {
  filters: {
    price(price) {
      price = price / 100;
      return price.toFixed(2);
    },
  },
  data() {
    return {
      documentNumber: "",
      batchNumber: "",
      canteenType: [], // 食堂类型
      wareHouseList: [],
      wHouse_id: "",
      pageSize: 10,
      pageTotal: 0,
      pageIndex: 1,
      type: "1",
      keywords: "",
      isQuery: false,
      select_date: [],
      supplierMini: [],
      supplierId: "",
      list: [],
      isShowScreen: true,
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
      summaryId: 1,
      purchaseSummaryList: [],
      //  要提交的原料id
      raw_id_list: [],
      //  操作人
      admin_username: "",
      adminUserList: [],
      loading: false,
      downloadUrl: "",
      org: [
        {
          orgValue: "1",
          label: "全部",
        },
        {
          orgValue: "2",
          label: "永兴巷机关食堂",
        },
      ],
      orgValue: "全部",
      canteen: [
        {
          canteenValue: "1",
          label: "全部",
        },
        {
          canteenValue: "2",
          label: "永兴巷机关食堂",
        },
        {
          canteenValue: "2",
          label: "永兴巷小卖部",
        },
      ],
      canteenValue: "全部",
    };
  },
  components: {
    GearHeader,
  },
  methods: {
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
    },
    rawChangePageSize(newPageSize) {
      this.rawPageIndex = 1;
      this.rawPageSize = newPageSize;
    },
    rawChangepageIndex(newPageIndex) {
      this.rawPageIndex = newPageIndex;
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
      this.select_date = [`${arr[0]}-${arr[1]}-01`, this.getNowFormatDate()];
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
    //getPurchaseSummaryList
    getPurchaseSummaryList() {
      // purchaseSummaryList
      this.loading = true;
      let obj = {
        canteen_id: this.canteenId,
        start_date: this.select_date[0],
        end_date: this.select_date[1],
        // house_id: this.wHouse_id,
        // summary_type: this.summaryId,
        raw_type: "out",
        page: this.pageIndex,
        page_size: this.pageSize,
      };
      // if(this.keywords !== '') Object.assign(obj, {apply_no: this.keywords})
      if (this.supplierId !== "")
        Object.assign(obj, { supplier_id: this.supplierId });
      // if(this.purchaseTypeId !== '')  Object.assign(obj, {category_id: this.purchaseTypeId})
      if (this.admin_username !== "")
        Object.assign(obj, { username: this.admin_username });
      if (this.raw_id_list.length > 0)
        Object.assign(obj, {
          raw_id: this.raw_id_list.map((y) => y.id).join(","),
        });

      //   axios.get('./deliveryDetails.json').then(res=>{
      //   /*console.log(res)
      //   debugger;*/
      //     const{data:{data:{total,data}}} =res
      //     this.purchaseSummaryList = res.data.data
      //     this.pageTotal = res.data.total
      //     this.initDownLoadUrl()
      //     this.hideLoading()
      //   //this.purchaseSummaryList = data
      // })
      getInandOutDetail(obj)
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
    },
    hideLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    // 初始化下载链接
    initDownLoadUrl() {
      this.downloadUrl = `${kang_url}/excel/ware/purchase/summary/export?canteen_id=${
        this.canteenId
      }&
        date_start=${this.select_date[0]}&date_end=${
        this.select_date[1]
      }&house_id=${this.wHouse_id}&
        summary_type=${this.summaryId}
        ${this.supplierId !== "" ? "&supplier_id=" + this.supplierId : ""}
        ${this.admin_username !== "" ? "&username=" + this.admin_username : ""}
        ${
          this.raw_id_list.length > 0
            ? "&raw_id=" + this.raw_id_list.map((y) => y.id).join(",")
            : ""
        }`;
      // console.log('this.downloadUrl',this.downloadUrl)
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
