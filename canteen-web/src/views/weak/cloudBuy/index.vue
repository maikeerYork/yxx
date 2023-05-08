<template>
  <div>
    <GearHeader />
    <div class="card p-20">
      <el-card class="box-shadow-none m-20" :body-style="{ padding: '0' }">
        <!-- 查询条件 -->
        <div>
          <transition name="slide-fade">
            <div class="screen-box p-10">
              <div>
                <el-form size="small" inline>
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
        <el-table
          :data="onlineOrderList"
          size="mini"
          v-loading="loading"
          :header-cell-style="{ 'text-align': 'center', color: '#000' }"
        >
          <el-table-column prop="order_no" label="订单编号" />
          <el-table-column prop="ordering_name" label="姓名" />
          <el-table-column prop="shopping_cart[0].food_name" label="购买信息" />
          <el-table-column prop="create_at" label="购买时间" />
          <el-table-column prop="time_start" label="取餐时间" />

          <el-table-column prop="address" label="卖方餐厅" />
          <!-- <el-table-column prop="SupplierName" label="供应商" /> -->
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

      <!--loading-->
      <Loading v-if="pageLoading === true" />
    </div>
  </div>
</template>
  
<script>
import { getOnlineOrder } from "@/api/ims";
import GearHeader from "@/components/GearHeader";

export default {
  filters: {
    price(price) {
      price = price / 100;
      return price.toFixed(2);
    },
  },
  data() {
    return {
      onlineOrderList: [],
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 0,
      pageLoading: false,
      select_date: [],
    };
  },
  components: {
    GearHeader,
  },
  mounted() {
    this.getCurrentMounth();
    this.getOnlineOrderList();
  },
  methods: {
    getOnlineOrderList() {
      this.loading = true;
      let obj = {
        canteen_id: "7,8", //this.canteenId,
        order_time_start: this.select_date[0],
        order_time_end: this.select_date[1],
        query_type: 1,
        // query_value:'',
        order_from: "ORDER_MINI",
        page: this.pageIndex,
        order_date_type: 0,
        page_size: this.pageSize,
      };
      // if(this.keywords !== '') Object.assign(obj, {apply_no: this.keywords})
      getOnlineOrder(obj)
        .then((res) => {
          const {
            data: {
              data: { total, data },
            },
          } = res;
          this.onlineOrderList = data;
          this.pageTotal = total;
          this.hideLoading();
        })
        .catch((err) => {
          console.error(err);
          this.hideLoading();
        });
    },
    changePageSize(newPageSize) {
      this.isClickQuery();
      this.pageIndex = 1;
      this.pageSize = newPageSize;
      this.getOnlineOrderList();
    },
    changepageIndex(newPageIndex) {
      this.isClickQuery();
      this.pageIndex = newPageIndex;
      this.getOnlineOrderList();
    },
    queryData() {
      this.isQuery = true
      this.getOnlineOrderList()
    },
    resetData() {
      this.getOnlineOrderList()
    },
    isClickQuery() {
      if (!this.isQuery) {
      }
    },
    hideLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 300);
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
  