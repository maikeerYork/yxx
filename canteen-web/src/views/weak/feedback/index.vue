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
<!--                  <el-form-item label="时间：">-->
<!--                    <el-date-picker-->
<!--                        :clearable="false"-->
<!--                        :editable="false"-->
<!--                        v-model="select_date"-->
<!--                        type="daterange"-->
<!--                        format="yyyy年MM月dd日"-->
<!--                        unlink-panels-->
<!--                        value-format="yyyy-MM-dd"-->
<!--                        start-placeholder="开始日期"-->
<!--                        end-placeholder="结束日期"-->
<!--                    />-->
<!--                  </el-form-item>-->
                  <el-form-item label="">
                    <el-input v-model.trim="keywords" placeholder="请输入用户名/手机号"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="queryData" type="primary">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="resetData()" type="primary" icon="el-icon-refresh"></el-button>
                  </el-form-item>
                </el-form>

              </div>
              <div class="flex-row justify-end">
<!--                <el-form size="small" inline>-->
<!--                  <el-form-item>-->
<!--                    <el-button @click="queryData" type="primary">查询</el-button>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item>-->
<!--                    <el-button @click="resetData()" type="primary" icon="el-icon-refresh"></el-button>-->
<!--                  </el-form-item>-->
<!--                </el-form>-->
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

          <el-table-column prop="username" label="用户名称" />
          <el-table-column prop="phone" label="电话号码" />

          <el-table-column prop="canteen_name" label="所属食堂" />
          <el-table-column prop="create_time" label="留言时间" >
<!--            <template slot-scope="scope">-->
<!--              <div class="text-black">{{ scope.row.create_time | formatD }}</div>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column prop="message" label="意见留言" />
          <el-table-column prop="is_anonymous" label="匿名" :formatter="problemSourceFormat"/>

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
import GearHeader from "@/components/GearHeader";
import { getFeedbackOrSuggestionList } from "@/api/feedback";
import axios from "axios";

export default {
  filters: {
    price(price) {
      price = price / 100;
      return price.toFixed(2);
    },
    formatD(date) {
      var time = new Date(date*1000);
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      };
      const ChineseDateTime = new Intl.DateTimeFormat("zh-Hans-CN", options).format;
      return ChineseDateTime(time)
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
      keywords: '',
    };
  },
  components: {
    GearHeader,
  },
  mounted() {
    this.getCurrentMounth();
    this.getFeedbackOrSuggestionList();
  },
  methods: {
    // 用户组人员列表
    getFeedbackOrSuggestionList() {
      let obj = {};
      obj.canteen_id = "3,6,7,8";
      obj.page = this.pageIndex;
      obj.keywords = this.keywords;
      getFeedbackOrSuggestionList(obj).then((response) => {
        const {
          data: {
            data: { total, data },
          },
        } = response;
          this.onlineOrderList = data;
          this.pageTotal = total;
          this.hideLoading();
          })
          .catch((error) => {
            console.log(error);
          });
    },
    changePageSize(newPageSize) {
      this.isClickQuery();
      this.pageIndex = 1;
      this.pageSize = newPageSize;
      this.getFeedbackOrSuggestionList();
    },
    changepageIndex(newPageIndex) {
      this.isClickQuery();
      this.pageIndex = newPageIndex;
      this.getFeedbackOrSuggestionList();
    },
    queryData() {
      this.isQuery = true;
      this.getFeedbackOrSuggestionList();
    },
    resetData() {
      this.keywords = '';
      this.getFeedbackOrSuggestionList();
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
    problemSourceFormat(date){
      if(date.is_anonymous == '0'){
        return '否'
      }
      if(date.is_anonymous == '1'){
        return '是'
      }
    }
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