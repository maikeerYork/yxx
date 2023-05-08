<template>
  <div class="card p-20">
    <!-- header -->
    <GearHeader />

    <el-card class="box-shadow-none" :body-style="{ padding: '0' }">
      <!-- 查询条件 -->
      <div class="form-query-box">
        <el-form inline :model="formInline" class="demo-form-inline padding-top-20">
          <el-form-item>
            <el-input
              v-model.trim="formInline.queryCondition"
              clearable
              class="width-200"
              prefix-icon="el-icon-search"
              placeholder="用户名称/工号"
              @keyup.enter.native="onSubmit"
            />
          </el-form-item>
          <el-form-item label="钱包类型">
            <el-select v-model="formInline.wallet_type_id" placeholder="请选择">
              <el-option
                v-for="(item, index) in walletTypeList"
                :key="index"
                :label="item.wallet_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备">
            <div class="flex-row">
              <div>
                <el-tag
                  v-if="selectedDevice.length > 0"
                  @close="removeRawId(selectedDevice[0].client_id)"
                  size="small"
                  closable
                  >{{ selectedDevice[0].client_name }}</el-tag
                >
                <el-popover
                  v-if="selectedDevice.length > 1"
                  placement="bottom"
                  width="300"
                  trigger="hover"
                >
                  <div>
                    <el-form inline size="small">
                      <el-form-item
                        v-for="(item, index) in selectedDevice"
                        class="mb-10"
                        v-if="index != 0"
                        :key="item.id"
                      >
                        <el-tag
                          size="small"
                          @close="removeRawId(item.client_id)"
                          closable
                          >{{ item.client_name }}</el-tag
                        >
                      </el-form-item>
                      <el-form-item>
                        <a
                          @click="selectedDevice = []"
                          class="el-text-warning font-size-12"
                          href="javascript:void(0)"
                          >清除所有选项</a
                        >
                      </el-form-item>
                    </el-form>
                  </div>
                  <a slot="reference" class="mr-12" href="javascript:;">
                    <el-tag size="small">+ {{ selectedDevice.length - 1 }}(查看)</el-tag>
                  </a>
                </el-popover>
              </div>
              <a
                v-if="selectedDevice.length > 0"
                title="点击选择设备"
                class="el-text-primary font-size-15 ml-12"
                @click="openSelectDevice()"
                href="javascript:void(0)"
              >
                <i class="el-icon-more"></i>
              </a>
              <div class="select-raw" v-if="selectedDevice.length === 0">
                <span class="el-text-info mr-15">请选择设备</span>
                <a
                  title="点击选择设备"
                  class="el-text-primary font-size-15"
                  @click="openSelectDevice()"
                  href="javascript:void(0)"
                >
                  <i class="el-icon-more"></i>
                </a>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="部门">
            <div class="width-200">
              <treeselect
                v-model="departId"
                :options="departs_list"
                :normalizer="normalizer"
                :clearable="false"
                placeholder="请选择部门"
                value-consists-of="ALL"
                :limit="1"
                :limitText="(count) => `${count}+`"
                :multiple="true"
              />
            </div>
          </el-form-item>
          <el-form-item label="用户组">
            <el-select
              v-model="userGroupId"
              collapse-tags
              clearable
              multiple
              placeholder="请选择用户组"
            >
              <el-option
                v-for="item in userGroupList"
                :key="item.id"
                :label="item.group_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-form inline>
          <el-form-item>
            <el-popover
              placement="left"
              width="700"
              title="【个人消费明细汇总】"
              trigger="hover"
              popper-class="popover"
            >
              <p>
                统计数据场景范围：1---线上：通过移动端单独订餐、批量订餐。
                2---线下：现场的设备上消费，包含固定收银、现场点餐、自由收银、（视觉结算、自助称重：暂无法统计。）
              </p>
              <p>
                统计时间维度：按天/按月：1-按下单日期，即用户的每天、每月的下单支出消费情况。
                2-按取餐日期，即用户在1月31号线上预订了2月3号的餐，则此费用计算在2月3号，真实的就餐消费数据。
              </p>
              <p>
                统计订单状态范围：仅统计支付成功的订单，包含【线上订单】---取餐未核销、已取餐即已核销、退款申请中的订单，【现场订单】---已完成的订单。
              </p>
              <el-button slot="reference" type="primary" size="mini">使用说明</el-button>
            </el-popover>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-query-box">
        <el-form inline :model="formInline" class="demo-form-inline">
          <el-form-item label="统计维度:">
            <div class="flex-row">
              <div>
                <el-checkbox
                  class="mr-20"
                  v-model="isDay"
                  @change="
                    () => {
                      isMounth = false;
                      isDay = true;
                      isTotal = false;
                    }
                  "
                  >按天</el-checkbox
                >
                <el-checkbox
                  v-model="isMounth"
                  @change="
                    () => {
                      isMounth = true;
                      isDay = false;
                      isTotal = false;
                    }
                  "
                  >按月</el-checkbox
                >
                <el-checkbox
                  v-model="isTotal"
                  @change="
                    () => {
                      isTotal = true;
                      isMounth = false;
                      isDay = false;
                    }
                  "
                  >按累计</el-checkbox
                >
                <el-date-picker
                  v-if="isDay === true"
                  v-model="tiems"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  :unlink-panels="true"
                  :clearable="false"
                  @change="changeday"
                  :picker-options="pickerOptions"
                />

                <el-date-picker
                  v-if="isMounth === true"
                  v-model="mounts"
                  :clearable="false"
                  type="monthrange"
                  format="yyyy年 MM 月"
                  :unlink-panels="true"
                  range-separator="至"
                  value-format="yyyy-MM"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                >
                </el-date-picker>

                <el-date-picker
                  v-if="isTotal === true"
                  v-model="daytime_start_end"
                  type="datetimerange"
                  :clearable="false"
                  :unlink-panels="true"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  range-separator="~"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary" class="returns" @click.native="refreshOrder"
              ><i class="el-icon-refresh" />
            </el-button>
          </el-form-item>
        </el-form>
        <el-form inline>
          <el-form-item>
            <el-popover
              placement="left-start"
              width="650"
              trigger="hover"
              v-model="listSetVisible"
            >
              <div>
                <div class="text-center border_bottom pb-10 pt-10">列表设置</div>
                <div class="flex-row justify-between">
                  <ul class="mt-14">
                    <li class="list-style-none mt-6 mb-8 font-size-12">用户</li>
                    <li
                      class="list-style-none mt-6 mb-6"
                      v-for="(item, index) in userInfoFieldGroup"
                      :key="index"
                    >
                      <el-checkbox :disabled="item.disabled" v-model="item.checked">
                        {{ item.name }}
                      </el-checkbox>
                    </li>
                  </ul>
                  <ul class="mt-14">
                    <li class="list-style-none mt-6 mb-8 font-size-12">
                      消费概览
                      <el-tooltip class="item" effect="dark" placement="top-start">
                        <div slot="content">
                          区分支付场景，线上订餐，现场消费，区分餐别，和整天。
                        </div>
                        <a class="el-text-primary" href="javascript:;">
                          <i class="el-icon-question"></i>
                        </a>
                      </el-tooltip>
                    </li>
                    <li
                      class="list-style-none mt-6 mb-6"
                      v-for="(item, index) in consumptionOverviewFieldGroup"
                      :key="index"
                    >
                      <el-checkbox :disabled="item.disabled" v-model="item.checked">
                        {{ item.name }}
                      </el-checkbox>
                    </li>
                  </ul>
                  <ul class="mt-14">
                    <li class="list-style-none mt-6 mb-8 font-size-12">
                      消费明细
                      <el-tooltip class="item" effect="dark" placement="top-start">
                        <div slot="content">
                          区分支付类型，现金、补贴、第三方支付金额的情况
                        </div>
                        <a class="el-text-primary" href="javascript:;">
                          <i class="el-icon-question"></i>
                        </a>
                      </el-tooltip>
                    </li>
                    <li
                      class="list-style-none mt-6 mb-6"
                      v-for="(item, index) in consumptionDetailsFieldGroup"
                      :key="index"
                    >
                      <el-checkbox :disabled="item.disabled" v-model="item.checked">
                        {{ item.name }}
                      </el-checkbox>
                    </li>
                  </ul>
                </div>
                <div class="flex-row justify-end mt-15 mr-15 mb-15">
                  <el-button
                    type="primary"
                    @click="saveListSet()"
                    size="mini"
                    class="mr-25"
                    >确定</el-button
                  >
                  <el-button
                    type="primary"
                    plain
                    @click="defaultListSet()"
                    size="mini"
                    class="mr-25"
                    >恢复默认</el-button
                  >
                  <el-button @click="listSetVisible = false" size="mini">取消</el-button>
                </div>
              </div>
              <a
                href="javascript:void(0)"
                slot="reference"
                class="font-size-14 el-text-primary"
              >
                <i class="el-icon-s-operation"></i>
                显示更多列
              </a>
            </el-popover>
          </el-form-item>

          <el-form-item>
            <el-button
              type="warning"
              icon="el-icon-download"
              class="mb-20 ml-10"
              @click="exportClick"
              >导出</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <vxe-table
        border
        size="small"
        :empty-render="{ name: 'NotData' }"
        enabled="false"
        ref="vexTableRef"
        :data="tableData"
        :row-config="{ isHover: true, resizable: true }"
        align="center"
        show-header-overflow
      >
        <vxe-column fixed="left" type="seq" width="60"></vxe-column>
        <vxe-column fixed="left" field="username" width="110" title="姓名" />
        <vxe-column
          field="depart_name"
          width="110"
          title="部门"
          :visible="listFieldVisible.depart_name === true"
        />
        <vxe-column
          field="group_name"
          width="110"
          title="用户组"
          :visible="listFieldVisible.group_name === true"
        />
        <vxe-column
          width="110"
          title="卡类"
          :visible="listFieldVisible.card_type === true"
        >
          <template #default="{ row }">
            <div>{{ cardIdToCardName(row.user_card_type_id) }}</div>
          </template>
        </vxe-column>
        <vxe-column
          field="user_no"
          width="110"
          title="工号"
          :visible="listFieldVisible.user_no === true"
        />
        <vxe-column
          field="phone"
          width="200"
          title="手机号"
          :visible="listFieldVisible.phone === true"
        />
        <vxe-column
          field="bank_no"
          width="250"
          title="银行卡号"
          :visible="listFieldVisible.bank_no === true"
        />
        <vxe-column
          field="certificate_no"
          width="250"
          title="身份证号"
          :visible="listFieldVisible.certificate_no === true"
        />
        <!-- <vxe-column field="date" width="160" title="取餐日期" /> -->
        <vxe-column width="150">
          <template #header>
            <div>
              取餐日期
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  按取餐日期统计，举例：在8.18号早上，小明线上预订成功了
                  8.19号的中餐一份8元 ，晚餐一份10元。
                  则在取餐日期8.19号的中餐餐别统计到了8元，在取餐日期为8.19好的晚餐餐别统计到了10元。
                </div>
                <a class="el-text-primary" href="javascript:;">
                  <i class="el-icon-question"></i>
                </a>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row }">
            <div>
              {{ row.date }}
            </div>
          </template>
        </vxe-column>
        <vxe-column :visible="listFieldVisible.yxhjcs === true" width="150" fixed="right">
          <template #header>
            <div>
              有效消费次数合计
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  统计用户当天/当月有效的消费次数合计：仅包含支付成功+部分退款+退款申请中。
                </div>
                <a class="el-text-primary" href="javascript:;">
                  <i class="el-icon-question"></i>
                </a>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row }">
            <div>
              {{ row.pay_num }}
            </div>
          </template>
        </vxe-column>
        <vxe-column
          :visible="listFieldVisible.other_frequency === true"
          width="160"
          fixed="right"
        >
          <template #header>
            <div>
              第三方消费次数合计
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">指用微信，支付宝等第三方支付方式支付的有效次数。</div>
                <a class="el-text-primary" href="javascript:;">
                  <i class="el-icon-question"></i>
                </a>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row }">
            <div>
              {{ row.other_frequency }}
            </div>
          </template>
        </vxe-column>
        <vxe-column
          :visible="listFieldVisible.not_other_frequency === true"
          width="180"
          fixed="right"
        >
          <template #header>
            <div>
              虚拟钱包消费次数合计
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  指用系统虚拟钱包，包括现金钱包，补贴钱包来支付的有效次数。
                </div>
                <a class="el-text-primary" href="javascript:;">
                  <i class="el-icon-question"></i>
                </a>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row }">
            <div>
              {{ row.not_other_frequency }}
            </div>
          </template>
        </vxe-column>

        <vxe-column :visible="listFieldVisible.ddhj === true" width="150" fixed="right">
          <template #header>
            <div>
              订单合计
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  统计用户当天/当月的订单总额：线上订餐消费总额+现场消费总额
                </div>
                <a class="el-text-primary" href="javascript:;">
                  <i class="el-icon-question"></i>
                </a>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row }">
            <div>￥{{ row.total_price | price }}</div>
          </template>
        </vxe-column>
        <vxe-column :visible="listFieldVisible.sshj === true" width="150" fixed="right">
          <template #header>
            <div>
              实收合计
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  统计用户当天/当月的实收总额：线上订餐消费总额+现场消费总额-优惠金额-退款总额
                </div>
                <a class="el-text-primary" href="javascript:;">
                  <i class="el-icon-question"></i>
                </a>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row }">
            <div>￥{{ row.discount_price | price }}</div>
          </template>
        </vxe-column>
        <vxe-column :visible="listFieldVisible.yhhj === true" width="150" fixed="right">
          <template #header>
            <div>
              优惠合计
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  统计用户当天/当月的优惠总额:有效订单的优惠金额合计。
                </div>
                <a class="el-text-primary" href="javascript:;">
                  <i class="el-icon-question"></i>
                </a>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row }">
            <div>￥{{ row.has_discount | price }}</div>
          </template>
        </vxe-column>
        <vxe-column :visible="listFieldVisible.tkhj === true" width="150" fixed="right">
          <template #header>
            <div>
              退款合计
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  统计用户当天/当月的退款总额，包含全部退款和部分退款的。
                </div>
                <a class="el-text-primary" href="javascript:;">
                  <i class="el-icon-question"></i>
                </a>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row }">
            <div>￥{{ row.refund | price }}</div>
          </template>
        </vxe-column>

        <vxe-colgroup
          v-for="ding in diningTimeList"
          :prop="`${ding.id}`"
          :key="randomString(16)"
        >
          <template #header>
            <div>
              <span style="color: #409eff">{{
                ding.dining_name + "(" + ding.time_start + "-" + ding.time_end + ")"
              }}</span>
              <a
                slot="reference"
                @click="headerClick(ding)"
                class="el-text-primary"
                href="javascript:;"
              >
                <i class="el-icon-edit"></i>
              </a>
            </div>
          </template>
          <vxe-column :visible="listFieldVisible.pay_num === true" width="130">
            <template #header>
              <div>
                有效消费次数
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">仅统计某个餐别内支付成功、部分退款的订单数。</div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>
                {{ handelMealParams(ding, row).pay_num }}
              </div>
            </template>
          </vxe-column>
          <vxe-column :visible="listFieldVisible.other_frequency === true" width="130">
            <template #header>
              <div>
                第三方消费次数
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">
                    指用微信，支付宝等第三方支付方式支付的有效次数。
                  </div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>
                {{ handelMealParams(ding, row).other_frequency }}
              </div>
            </template>
          </vxe-column>
          <vxe-column
            :visible="listFieldVisible.not_other_frequency === true"
            width="150"
          >
            <template #header>
              <div>
                虚拟钱包消费次数
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">
                    指用系统虚拟钱包，包括现金钱包，补贴钱包来支付的有效次数。
                  </div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>
                {{ handelMealParams(ding, row).not_other_frequency }}
              </div>
            </template>
          </vxe-column>
          <vxe-column :visible="listFieldVisible.order_mini === true" width="130">
            <template #header>
              <div>
                订餐实收总额
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">统计某个餐别内线上订餐上的消费金额。</div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>￥{{ handelMealParams(ding, row).order_mini | price }}</div>
            </template>
          </vxe-column>
          <vxe-column :visible="listFieldVisible.scene === true" width="150">
            <template #header>
              <div>
                现场消费实收总额
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">
                    统计某个餐别内设备消费金额。（现场设备扫第三方二维码不统计）
                  </div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>￥{{ handelMealParams(ding, row).scene | price }}</div>
            </template>
          </vxe-column>
          <vxe-column :visible="listFieldVisible.refund === true" width="130">
            <template #header>
              <div>
                退款总额
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">统计某个餐别内线上退餐+现场退款的金额</div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>￥{{ handelMealParams(ding, row).refund | price }}</div>
            </template>
          </vxe-column>

          <vxe-column :visible="listFieldVisible.total === true" width="130">
            <template #header>
              <div>
                实收小计
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">
                    某个餐别内线上订餐消费总额+现场消费总额-退款总额
                  </div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>￥{{ handelMealParams(ding, row).total | price }}</div>
            </template>
          </vxe-column>

          <vxe-column :visible="listFieldVisible.xjddje === true" width="130">
            <template #header>
              <div>
                现金订单金额
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">使用电子现金钱包进行支付的订单</div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>￥{{ handelMealParams(ding, row).cash_total | price }}</div>
            </template>
          </vxe-column>

          <vxe-column :visible="listFieldVisible.xjssje === true" width="130">
            <template #header>
              <div>
                现金实收金额
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">合计总额中，属于电子现金钱包的实际消费金额</div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>￥{{ handelMealParams(ding, row).cash | price }}</div>
            </template>
          </vxe-column>

          <vxe-column :visible="listFieldVisible.xjyhje === true" width="130">
            <template #header>
              <div>
                现金优惠金额
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">电子现金钱包支付的订单，产生的优惠金额</div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>
                ￥{{
                  (handelMealParams(ding, row).cash_total -
                    handelMealParams(ding, row).cash)
                    | price
                }}
              </div>
            </template>
          </vxe-column>

          <vxe-column :visible="listFieldVisible.btddje === true" width="130">
            <template #header>
              <div>
                补贴订单金额
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">使用电子补贴钱包进行支付的订单</div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>￥{{ handelMealParams(ding, row).subsidy_total | price }}</div>
            </template>
          </vxe-column>
          <vxe-column :visible="listFieldVisible.btssje === true" width="130">
            <template #header>
              <div>
                补贴实收金额
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">合计总额中，属于电子补贴钱包消费的金额</div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>￥{{ handelMealParams(ding, row).subsidy | price }}</div>
            </template>
          </vxe-column>

          <vxe-column :visible="listFieldVisible.btyhje === true" width="130">
            <template #header>
              <div>
                补贴优惠金额
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">电子补贴钱包支付的订单，产生的优惠金额</div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>
                ￥{{
                  (handelMealParams(ding, row).subsidy_total -
                    handelMealParams(ding, row).subsidy)
                    | price
                }}
              </div>
            </template>
          </vxe-column>

          <vxe-column :visible="listFieldVisible.dsfzfddje === true" width="130">
            <template #header>
              <div>
                第三方支付订单金额
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">
                    线上订餐用户使用微信，支付宝，掌银支付的订单。不包含设备第三方支付
                  </div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>￥{{ handelMealParams(ding, row).other_total | price }}</div>
            </template>
          </vxe-column>

          <vxe-column :visible="listFieldVisible.dsfssje === true" width="130">
            <template #header>
              <div>
                第三方实收金额
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">
                    合计总额中，线上订餐用户使用微信、支付宝、掌银支付的订单实际消费，不包含设备第三方支付
                  </div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>￥{{ handelMealParams(ding, row).other | price }}</div>
            </template>
          </vxe-column>
          <vxe-column :visible="listFieldVisible.dsfyhje === true" width="130">
            <template #header>
              <div>
                第三方优惠金额
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">
                    线上订餐用户使用微信、支付宝、掌银支付的订单，产生的优惠。不包含设备第三方支付
                  </div>
                  <a class="el-text-primary" href="javascript:;">
                    <i class="el-icon-question"></i>
                  </a>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div>
                ￥{{
                  (handelMealParams(ding, row).other_total -
                    handelMealParams(ding, row).other)
                    | price
                }}
              </div>
            </template>
          </vxe-column>
        </vxe-colgroup>
      </vxe-table>
      <!-- 分页 -->
      <div class="paging">
        <el-pagination
          :current-page="pageData.page"
          :page-sizes="[10, 20, 30]"
          :page-size="pageData.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog
      title="编辑餐别"
      :visible.sync="editDrinkDialogVisible"
      :close-on-click-modal="false"
      width="650px"
      center
      top="10vh"
      :destroy-on-close="true"
    >
      <el-form
        ref="editdinner"
        label-position="right"
        :rules="editRules"
        label-width="110px"
        :model="editdinner"
      >
        <el-form-item label="餐别名称" prop="dining_name">
          <el-input v-model.trim="editdinner.dining_name" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="餐别时间" required>
          <el-col :span="11">
            <el-form-item prop="time_start">
              <el-time-picker
                v-model="editdinner.time_start"
                :clearable="false"
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                placeholder="起始时间"
              />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="2">—</el-col>
          <el-col :span="11">
            <el-form-item prop="time_end">
              <el-time-picker
                v-model="editdinner.time_end"
                :clearable="false"
                format="HH:mm:ss"
                value-format="HH:mm:ss"
                placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="load_status" @click="sureEditDinner"
          >确 定</el-button
        >
        <el-button @click="editDrinkDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="选择设备"
      :visible.sync="deviceDialogVisible"
      :close-on-click-modal="false"
      width="660px"
      center
    >
      <div>
        <el-row>
          <el-col :span="5">
            <el-scrollbar class="raw-type-style">
              <ul class="list-style-none p-0" v-if="deviceTypeData.length > 0">
                <li
                  v-for="(item, index) in deviceTypeData"
                  :key="index"
                  :class="
                    item.id === device_type_id
                      ? 'el-bg-primary text-white pt-10 pb-10'
                      : 'bg-white text-black pt-10 pb-10'
                  "
                >
                  <a
                    href="javascript:;"
                    class="text-center font-size-14"
                    @click="selectTypeIndex(item.id)"
                  >
                    <div>
                      {{ item.name }}
                    </div>
                  </a>
                </li>
              </ul>
              <div class="no_type_box" v-else>暂无分类</div>
            </el-scrollbar>
          </el-col>
          <el-col :span="19" class="dialog-right">
            <el-table
              height="500"
              ref="devicesTableRef"
              :data="deviceList"
              size="mini"
              class="w-100"
              :header-cell-style="{ 'text-align': 'center', color: '#000' }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="client_no" label="设备编号" />
              <el-table-column prop="client_name" label="设备名称" />
            </el-table>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="deviceDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmSelect()">确 定</el-button>
      </span>
    </el-dialog>

    <!--loading-->
    <Loading v-if="pageLoading === true" />
  </div>
</template>

<script>
import {
  diningTime,
  userDayConsumeTake,
  walletTypeList,
  editDiningTime,
  totalUserConsume,
  cacheDiningTime,
} from "@/api/wallet";
import { clientType, equipmentManagelist } from "@/api/CupboardManagement";
import { kang_url } from "@/utils/baceurl";
import { mapGetters } from "vuex";
import { departList } from "@/api/department";
import { getUserGroupList } from "@/api/user_group";
import { allCardTypeList } from "@/api/card";
import { getMachineList } from "@/api/dataStatistics";
import treeselect from "@riophae/vue-treeselect";
import GearHeader from "@/components/GearHeader";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getNowFormatDate, formatDate } from "@/utils/dateFunction";
import { deepCopy } from "@/utils/objFunction";
export default {
  filters: {
    price(price) {
      price = price / 100;
      return price.toFixed(2);
    },
  },
  components: {
    treeselect,
    GearHeader,
  },
  data() {
    // 开始时间  编辑
    let checkStartTimeEdit = (rule, value, callback) => {
      if (value === null || value === "") {
        return callback(new Error("开始时间不能为空"));
      } else {
        if (this.editdinner.time_end !== "") {
          this.$refs.editdinner.validateField("time_end");
        }
        callback();
      }
    };
    //结束时间   编辑
    let checkEndTimeEdit = (rule, value, callback) => {
      if (value === null || value === "") {
        return callback(new Error("结束时间不能为空"));
      } else {
        const startTime = this.editdinner.time_start.split(":");
        const endTime = value.split(":");
        if (value === this.editdinner.time_start) {
          return callback(new Error("开始时间不能等于结束时间"));
        }
        if (startTime[0] > endTime[0]) {
          return callback(new Error("开始时间不能大于结束时间"));
        }
        if (startTime[0] === endTime[0]) {
          if (startTime[1] > endTime[1]) {
            return callback(new Error("开始时间不能大于结束时间"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    };
    return {
      daytime_start_end: [],
      /* 食堂选择 */
      canteenType: [], // 食堂类型
      canteenId: "1,2,3", // 食堂ID
      allcanteenType: {}, // 全部食堂（追加数据）
      canteenId_arry: [], // 全部食堂ID
      /* 食堂选择 */

      // 防止搜索和分页混淆
      getTableListStatus: "all",
      tiems: [], // 下单时间
      foodlistneed: {},

      /* 查询条件对象 */
      formInline: {
        queryCondition: "",
        wallet_type_id: "",
        clientId: [],
      },
      //钱包类型列表
      walletTypeList: [],

      // 充值记录列表
      tableData: [],

      load_status: false,

      pageData: {
        // 分页数据
        page: 1,
        page_size: 10,
        total: 0,
      },

      //餐别时间
      diningTimeList: [
        {
          id: 1,
          dining_name: "早餐",
          time_start: "05:00:00",
          time_end: "10:00:00",
        },
        {
          id: 2,
          dining_name: "午餐",
          time_start: "10:00:00",
          time_end: "15:00:00",
        },
        {
          id: 3,
          dining_name: "晚餐",
          time_start: "15:00:00",
          time_end: "20:00:00",
        },
        {
          id: 4,
          dining_name: "夜宵",
          time_start: "15:00:00",
          time_end: "23:59:00",
        },
      ],
      defaultProps: {
        children: "list",
        label: "depart_name",
      },

      // 加载状态
      pageLoading: false,
      editRules: {
        time_start: [{ validator: checkStartTimeEdit, trigger: "blur" }],
        time_end: [{ validator: checkEndTimeEdit, trigger: "blur" }],
      },
      editDrinkDialogVisible: false, // 修改餐别（弹框）
      editdinner: {},
      totalUserDayConsume: {},

      downLoadUrl: "",
      departs_list: [],
      departId: null,
      userGroupList: [], //用户组
      userGroupId: [], //用户组id
      billsTotalInfo: {},
      headerTitle: "",
      //日期选择器
      pickerOptions: {
        shortcuts: [
          {
            text: "今日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "上一个月",
            onClick(picker) {
              var nowdays = new Date();
              var year = nowdays.getFullYear();
              var month = nowdays.getMonth();
              if (month == 0) {
                month = 12;
                year = year - 1;
              }
              if (month < 10) {
                month = "0" + month;
              }
              var myDate = new Date(year, month, 0);
              var startDate = year + "-" + month + "-01"; //上个月第一天
              var endDate = year + "-" + month + "-" + myDate.getDate(); //上个月最后一天
              picker.$emit("pick", [startDate, endDate]);
            },
          },
          {
            text: "本月",
            onClick(picker) {
              var nowdays = new Date();
              var year = nowdays.getFullYear();
              var month = nowdays.getMonth() + 1;
              if (month == 0) {
                month = 12;
                year = year - 1;
              }
              if (month < 10) {
                month = "0" + month;
              }
              var startDate = year + "-" + month + "-01"; //本月第一天
              var endDate = nowdays.toISOString().slice(0, 10); //本月最后一天
              picker.$emit("pick", [startDate, endDate]);
            },
          },
        ],
      },
      deviceDialogVisible: false,
      deviceTypeData: [], //设备类型数据
      deviceList: [], //设备数据列表
      device_type_id: "",
      multipleSelection: [],
      selectedDevice: [],
      isDay: true,
      isMounth: false,
      isTotal: false,
      //时间  月
      mounts: [],
      //列表设置
      listSetting: [
        {
          name: "姓名",
          key: "username",
          checked: true,
          disabled: true,
          type: 1,
        },
        {
          name: "部门",
          key: "depart_name",
          checked: false,
          disabled: false,
          type: 1,
        },
        {
          name: "用户组",
          key: "group_name",
          checked: false,
          disabled: false,
          type: 1,
        },
        {
          name: "卡类",
          key: "card_type",
          checked: false,
          disabled: false,
          type: 1,
        },
        {
          name: "工号",
          key: "user_no",
          checked: false,
          disabled: false,
          type: 1,
        },
        {
          name: "银行卡号",
          key: "bank_no",
          checked: false,
          disabled: false,
          type: 1,
        },
        {
          name: "身份证号",
          key: "certificate_no",
          checked: false,
          disabled: false,
          type: 1,
        },
        {
          name: "手机号",
          key: "phone",
          checked: false,
          disabled: false,
          type: 1,
        },
        {
          name: "有效消费次数",
          key: "pay_num",
          checked: true,
          disabled: true,
          type: 2,
        },
        {
          name: "第三方消费次数",
          key: "other_frequency",
          checked: false,
          disabled: false,
          type: 2,
        },
        {
          name: "虚拟钱包消费次数",
          key: "not_other_frequency",
          checked: false,
          disabled: false,
          type: 2,
        },
        {
          name: "线上订餐总额",
          key: "order_mini",
          checked: true,
          disabled: false,
          type: 2,
        },
        {
          name: "现场消费总额",
          key: "scene",
          checked: true,
          disabled: false,
          type: 2,
        },
        {
          name: "退款总额",
          key: "refund",
          checked: true,
          disabled: false,
          type: 2,
        },
        {
          name: "单次消费最高金额",
          key: "max",
          checked: true,
          disabled: false,
          type: 2,
        },
        {
          name: "实收小计",
          key: "total",
          checked: true,
          disabled: true,
          type: 2,
        },
        {
          name: "有效合计次数",
          key: "yxhjcs",
          checked: true,
          disabled: false,
          type: 2,
        },
        {
          name: "订单合计（=实收+优惠+退款）",
          key: "ddhj",
          checked: false,
          disabled: false,
          type: 2,
        },
        {
          name: "实收合计",
          key: "sshj",
          checked: true,
          disabled: true,
          type: 2,
        },
        {
          name: "优惠合计",
          key: "yhhj",
          checked: false,
          disabled: false,
          type: 2,
        },
        {
          name: "退款合计",
          key: "tkhj",
          checked: false,
          disabled: false,
          type: 2,
        },
        {
          name: "现金订单金额",
          key: "xjddje",
          checked: false,
          disabled: false,
          type: 3,
        },
        {
          name: "现金实收金额",
          key: "xjssje",
          checked: true,
          disabled: true,
          type: 3,
        },
        {
          name: "现金优惠金额",
          key: "xjyhje",
          checked: false,
          disabled: false,
          type: 3,
        },
        {
          name: "补贴订单金额",
          key: "btddje",
          checked: false,
          disabled: false,
          type: 3,
        },
        {
          name: "补贴实收金额",
          key: "btssje",
          checked: true,
          disabled: true,
          type: 3,
        },
        {
          name: "补贴优惠金额",
          key: "btyhje",
          checked: false,
          disabled: false,
          type: 3,
        },
        {
          name: "第三方支付订单金额",
          key: "dsfzfddje",
          checked: false,
          disabled: false,
          type: 3,
        },
        {
          name: "第三方实收金额",
          key: "dsfssje",
          checked: true,
          disabled: true,
          type: 3,
        },
        {
          name: "第三方优惠金额",
          key: "dsfyhje",
          checked: false,
          disabled: false,
          type: 3,
        },
      ],
      listSetVisible: false,
      listFieldVisible: {
        // username: true,
        // depart_name: false,
        // group_name:false,
        // user_no: true,
        // bank_no: false,
        // phone: false,
      },
      //用户回复默认的字段显示
      defaultListFieldVisible: {},
      cardTypeList: [],
      isTime: false,
    };
  },
  computed: {
    ...mapGetters([
      "canteen_info",
      "canteen_check",
      "newCanteen_check",
      "personalSummaryColumn",
    ]),
    userInfoFieldGroup() {
      return this.listSetting.filter((item) => item.type === 1);
    },
    consumptionOverviewFieldGroup() {
      return this.listSetting.filter((item) => item.type === 2);
    },
    consumptionDetailsFieldGroup() {
      return this.listSetting.filter((item) => item.type === 3);
    },
  },
  watch: {
    newCanteen_check() {
      this.canteenId = this.newCanteen_check;
      this.getTableListStatus = "all";
      this.getDiningTime(1);
    },
    listSetVisible(newVal, oldVal) {
      if (newVal === true) {
        this.listSetClick();
      }
    },
  },
  created() {},
  mounted() {
    this.canteenInit();
    this.initDate(); // 初始化时间
    this.getDiningTime(1); //获取统计餐别
    this.getDeparts(); //获取部门列表
    this.getUserGroupList(); //获取用户组
    this.getWalletTypeList(); //获取钱包类型
    this.getCardTypeList(); //所有卡类
    //如果vuex中有
    if (this.personalSummaryColumn !== null && this.personalSummaryColumn !== undefined) {
      this.listFieldVisible = deepCopy(this.personalSummaryColumn);
      this.listSetting.forEach((x) => {
        this.listFieldVisible = Object.assign(
          { [x.key]: x.checked },
          this.listFieldVisible
        );
      });
    }
    // 如果没有的话就取本地的
    else {
      let obj = {};
      this.listSetting.forEach((item) => {
        // this.listFieldVisible[item.key] = item.checked  没有添加get 和 get 数据变了页面监听不到
        Object.assign(obj, { [item.key]: item.checked });
      });
      this.listFieldVisible = deepCopy(obj);
    }
    //这个是默认的字段显示
    this.listSetting.forEach((item) => {
      this.defaultListFieldVisible[item.key] = item.checked;
    });
    this.defaultListFieldVisible = deepCopy(this.defaultListFieldVisible);
    console.error("this.listFieldVisible", this.listFieldVisible);
  },
  methods: {
    handelMealParams(ding, row) {
      let obj = {};
      for (let key in row) {
        if (key === ding.dining_name) {
          obj = row[key];
        }
      }
      return obj;
    },
    handelRefundTotal(row) {
      console.log(row);
      return "11";
    },
    /* --------------------------食堂header-------------------- */
    // 食堂初始化
    canteenInit() {
      this.canteenId = this.newCanteen_check;
    },
    // 选择食堂操作
    changecanteen(value) {
      this.canteenId = value;
      this.getTableListStatus = "all";
      this.getDiningTime(1);
    },
    /* --------------------------食堂header------------------- */
    // 初始化时间
    initDate() {
      const now = new Date(); //当前日期
      const nowMonth = now.getMonth(); //当前月
      const nowYear = now.getFullYear(); //当前年
      //本月的开始时间
      const monthStartDate = new Date(nowYear, nowMonth, 1);
      const beginDate =
        monthStartDate.getFullYear() +
        "-" +
        (monthStartDate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        monthStartDate.getDate().toString().padStart(2, "0");
      console.log(beginDate, "beginDate");
      const endDate = this.getcurrentData(); // 当前起止时间
      this.tiems = [beginDate, endDate];
      this.daytime_start_end = [beginDate + " " + "00:00:00", endDate + " " + "23:59:59"];
      console.log(this.daytime_start_end, "this.daytime_start_end");
      this.$set(this.foodlistneed, "order_time_start", beginDate);
      this.$set(this.foodlistneed, "order_time_end", endDate);
      this.mounts = [
        getNowFormatDate().substring(0, 7),
        getNowFormatDate().substring(0, 7),
      ];
    },
    // 当前标准时间转换 和 毫秒数时间转换 （注：只能转换成 年 月 日 ）
    getcurrentData(value) {
      if (value) {
        var date = new Date(value);
      } else {
        var date = new Date();
      }
      var currentDate = date.toISOString().slice(0, 10);
      return currentDate;
    },
    // 日期选择
    changeday(value) {
      this.$set(this.foodlistneed, "order_time_start", value[0]);
      this.$set(this.foodlistneed, "order_time_end", value[1]);
    },
    // 自定义键名
    normalizer(node) {
      return {
        id: node.id,
        label: node.depart_name,
        children: node.list,
      };
    },
    headerClick(obj) {
      console.log("obj", obj);
      // let currentIdIndex = this.diningTimeList.findIndex(item => item.id == obj.property)
      let currentIdIndex = this.diningTimeList.findIndex((item) => item.id == obj.id);
      if (currentIdIndex == -1) return;
      this.editDrinkDialogVisible = true;
      this.editdinner.time_start = this.diningTimeList[currentIdIndex].time_start;
      this.editdinner.time_end = this.diningTimeList[currentIdIndex].time_end;
      this.editdinner.dining_name = this.diningTimeList[currentIdIndex].dining_name;
      this.editdinner.dining_id = this.diningTimeList[currentIdIndex].id;
      this.editdinner = { ...this.editdinner };
    },
    //打开设备选择
    openSelectDevice() {
      this.deviceDialogVisible = true;
      this.getclientType();
      this.getEquipmentManagelist();
    },
    //选择框勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //根据设备id数组去重
    distinct(selectedUserList) {
      var arr = selectedUserList;
      for (let i = 0, len = arr.length; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (arr[i].client_id == arr[j].client_id) {
            arr.splice(j, 1);
            // splice 会改变数组长度，所以要将数组长度 len 和下标 j 减一
            len--;
            j--;
          }
        }
      }
    },
    //移除某个设备
    removeRawId(id) {
      const index = this.selectedDevice.findIndex((x) => x.client_id === id);
      this.selectedDevice.splice(index, 1);
    },
    //确认选择设备对话框
    confirmSelect() {
      this.selectedDevice = deepCopy(this.multipleSelection);
      this.deviceDialogVisible = false;
    },
    //选择设备类型
    selectTypeIndex(id) {
      if (id === this.device_type_id) return;
      this.device_type_id = id;
      this.getEquipmentManagelist();
    },
    //获取统计餐别
    getDiningTime(status) {
      this.pageLoading = true;
      let obj = {};
      obj.canteen_id = this.canteenId;
      if (status) Object.assign(obj, { status: status });
      cacheDiningTime(obj)
        .then((response) => {
          this.diningTimeList = response.data.data;
          console.log(this.diningTimeList, "this.diningTimeList");
          this.getTotalUserDayConsume(); //获取个人消费明细汇总合计
        })
        .catch((error) => {
          this.pageLoading = false;
          console.log(error);
        });
    },
    //获取所有设备类型
    getclientType() {
      let obj = {};
      obj.canteen_id = this.canteenId;
      obj.function = 2; //0 所有设备类型 1 有轮播图功能设备 2 有戈子支付功能设备
      clientType(obj)
        .then((response) => {
          this.deviceTypeData = response.data.data;
          this.deviceTypeData.unshift({
            client_type: "",
            id: "",
            name: "全部设备类型",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //获取所有设备
    getEquipmentManagelist() {
      let obj = {};
      obj.canteen_id = this.canteenId;
      if (this.device_type_id) Object.assign(obj, { client_type: this.device_type_id });
      getMachineList(obj)
        .then((response) => {
          let tempArr = [];
          tempArr = response.data.data.map((item) =>
            Object.assign(item, {
              client_name: item.client_name == null ? "" : item.client_name,
            })
          );
          this.deviceList = tempArr.sort((item1, item2) =>
            item1.client_name.localeCompare(item2.client_name)
          );
          this.$nextTick(() => {
            this.setTableSelect(this.deviceList);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    setTableSelect(list) {
      this.selectedDevice.forEach((select) => {
        const row = list.find((client) => client.client_id === select.client_id);
        if (row !== undefined) {
          this.$refs.devicesTableRef.toggleRowSelection(row);
        }
      });
    },
    //导出
    exportClick() {
      location.href = this.downLoadUrl;
    },
    // 编辑确认
    sureEditDinner() {
      this.$refs.editdinner.validate((valid) => {
        if (valid) {
          this.load_status = true;
          var obj = {};
          obj.canteen_id = this.canteenId;
          obj.time_start = this.editdinner.time_start;
          obj.time_end = this.editdinner.time_end;
          editDiningTime(obj, this.editdinner.dining_id)
            .then((response) => {
              this.load_status = false;
              this.getDiningTime();
              this.$message.success("编辑成功!");
              this.editDrinkDialogVisible = false;
            })
            .catch((error) => {
              console.log(error);
              this.load_status = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 获取部门列表
    getDeparts() {
      const obj = {};
      obj.canteen_id = this.canteenId;
      departList(obj)
        .then((response) => {
          // 拼接部门树列表
          this.departs_list = this.handleTree(response.data.data);
          const obj = {
            create_at: "1970-01-01 00:00:00",
            depart_name: "未分配",
            id: 0,
          };
          this.departs_list.unshift(obj);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 用户组人员列表
    getUserGroupList() {
      let obj = {};
      obj.canteen_id = this.canteenId;
      getUserGroupList(obj)
        .then((response) => {
          this.userGroupList = response.data.data;
          const obj = {
            group_name: "未分组",
            id: 0,
            remark: "",
          };
          this.userGroupList.unshift(obj);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取钱包类型方式
    getWalletTypeList() {
      walletTypeList()
        .then((response) => {
          this.walletTypeList = response.data.data;
          this.walletTypeList.unshift({ id: "", wallet_name: "所有方式" });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //初始化下载链接
    initDownLoadUrl(date_satrt, date_end, date_type) {
      // this.downLoadUrl = `${kang_url}/excel/order/card/userDayConsume/export?canteen_id=${this.canteenId}&date_start=${this.foodlistneed.order_time_start}&date_end=${this.foodlistneed.order_time_end}&admin_user_id=${this.admin_user_id}
      this.downLoadUrl = `${kang_url}/excel/order/card/userConsume/export?canteen_id=${
        this.canteenId
      }&date_start=${date_satrt}&date_end=${date_end}&admin_user_id=${this.admin_user_id}
      ${
        this.departId !== null && this.departId !== undefined
          ? "&depart_id=" + this.departId
          : ""
      }
      ${
        this.formInline.queryCondition ? "&keyword=" + this.formInline.queryCondition : ""
      }
      ${
        this.formInline.wallet_type_id
          ? "&wallet_type=" + this.formInline.wallet_type_id
          : ""
      }
      ${this.userGroupId.length !== 0 ? "&group_id=" + this.userGroupId.join(",") : ""}
      &date_type=${date_type}
      ${
        this.selectedDevice.length !== 0
          ? "&client_id=" + this.selectedDevice.map((x) => x.client_id).join(",")
          : ""
      }`;
    },

    //获取每日消费汇总表
    getdayConsumeList() {
      let departId_deep = null;
      if (this.departId) {
        departId_deep = JSON.parse(JSON.stringify(this.departId)).join(",");
      }
      if (this.getTableListStatus === "all") {
        this.formInline.queryCondition = "";
        this.userGroupId = [];
        this.departId = null;
        this.selectedDevice = [];
        this.multipleSelection = [];
        this.formInline.wallet_type_id = "";
      }
      let obj = {};
      obj.canteen_id = this.canteenId;
      console.log(this.daytime_start_end, "this.daytime_start_end.");
      if (this.isTotal === true) {
        const endTotal = this.daytime_start_end;
        obj.date_start = endTotal[0];
        obj.date_end = endTotal[1];
        obj.date_type = 3;
      }
      if (this.isMounth === true) {
        const endMounth = this.mounts[1].split("-");
        obj.date_start = this.mounts[0] + "-01";
        obj.date_end = formatDate(new Date(endMounth[0], endMounth[1], 0));
        obj.date_type = 2;
      }
      if (this.isDay === true) {
        obj.date_start = this.foodlistneed.order_time_start;
        obj.date_end = this.foodlistneed.order_time_end;
        obj.date_type = 1;
      }
      if (this.userGroupId.length != 0)
        Object.assign(obj, { group_id: this.userGroupId.join(",") });
      if (this.departId || this.departId == 0)
        Object.assign(obj, { depart_id: departId_deep });
      if (this.formInline.queryCondition)
        Object.assign(obj, { keyword: this.formInline.queryCondition });
      if (this.selectedDevice.length != 0)
        Object.assign(obj, {
          client_id: this.selectedDevice.map((x) => x.client_id).join(","),
        });
      if (this.formInline.wallet_type_id)
        Object.assign(obj, { wallet_type: this.formInline.wallet_type_id });
      obj.page = this.pageData.page;
      obj.page_size = this.pageData.page_size;
      userDayConsumeTake(obj)
        .then((response) => {
          this.tableData = response.data.data.data.filter((x) => x);
          console.log(this.tableData, "this.tableData");
          this.pageData.page = response.data.data.current_page;
          this.pageData.page_size = response.data.data.per_page;
          this.pageData.total = response.data.data.total;
          let obj = {
            user_id: 4422,
            username: "",
            user_no: "",
            date: "总计:" + this.pageData.total + "条",
            count: 1,
            log_payment_id: "47934",
            other_frequency: this.totalUserDayConsume.other_frequency,
            not_other_frequency: this.totalUserDayConsume.not_other_frequency,
            // "sum_price": this.totalUserDayConsume.sum_price,
            pay_num: this.totalUserDayConsume.pay_num,
            total_price: this.totalUserDayConsume.total_price,
            has_discount: this.totalUserDayConsume.has_discount,
            refund: this.totalUserDayConsume.refund,
            discount_price: this.totalUserDayConsume.discount_price,
            // "discount_all":this.totalUserDayConsume.total_price-this.totalUserDayConsume.discount_price
          };
          for (let key in this.totalUserDayConsume) {
            if (typeof this.totalUserDayConsume[key] === "object") {
              obj[key] = this.totalUserDayConsume[key];
            }
          }
          this.tableData.push(obj);

          setTimeout(() => {
            this.pageLoading = false;
          }, 500);
        })
        .catch((error) => {
          this.pageLoading = false;
          console.log(error);
        });
    },
    //获取每日消费汇总总数
    getTotalUserDayConsume() {
      let a = 11;
      this.pageLoading = true;
      let departId_deep = null;
      if (this.departId) {
        departId_deep = JSON.parse(JSON.stringify(this.departId)).join(",");
      }
      if (this.getTableListStatus === "all") {
        this.formInline.queryCondition = "";
        this.userGroupId = [];
        this.departId = null;
        this.selectedDevice = [];
        this.multipleSelection = [];
        this.formInline.wallet_type_id = "";
      }

      let obj = {};
      obj.canteen_id = this.canteenId;
      if (this.isTotal === true) {
        const endTotal = this.daytime_start_end;
        obj.date_start = endTotal[0];
        obj.date_end = endTotal[1];
        obj.date_type = 3;
      }
      if (this.isMounth === true) {
        const endMounth = this.mounts[1].split("-");
        obj.date_start = this.mounts[0] + "-01";
        obj.date_end = formatDate(new Date(endMounth[0], endMounth[1], 0));
        obj.date_type = 2;
      }
      if (this.isDay === true) {
        obj.date_start = this.foodlistneed.order_time_start;
        obj.date_end = this.foodlistneed.order_time_end;
        obj.date_type = 1;
      }
      this.initDownLoadUrl(obj.date_start, obj.date_end, obj.date_type);
      if (this.userGroupId.length != 0)
        Object.assign(obj, { group_id: this.userGroupId.join(",") });
      if (this.departId || this.departId == 0)
        Object.assign(obj, { depart_id: departId_deep });
      if (this.formInline.queryCondition)
        Object.assign(obj, { keyword: this.formInline.queryCondition });
      if (this.selectedDevice.length != 0)
        Object.assign(obj, {
          client_id: this.selectedDevice.map((x) => x.client_id).join(","),
        });
      if (this.formInline.wallet_type_id)
        Object.assign(obj, { wallet_type: this.formInline.wallet_type_id });
      console.log(obj, "obj");
      totalUserConsume(obj)
        .then((response) => {
          this.totalUserDayConsume = response.data.data;
          console.log(this.totalUserDayConsume, "this.totalUserDayConsume");
          this.getdayConsumeList();
        })
        .catch((error) => {
          this.pageLoading = false;
          console.log(error);
        });
    },

    // 查询
    onSubmit() {
      if (this.isTotal) {
        let start = Number(this.daytime_start_end[0].split(" ")[0].split("-")[1]) + 3;
        let joint =
          this.daytime_start_end[0].split(" ")[0].split("-")[0] +
          "-" +
          start +
          "-" +
          this.daytime_start_end[0].split(" ")[0].split("-")[2] +
          " " +
          this.daytime_start_end[0].split(" ")[1];
        console.log(joint, "joint");
        let date = new Date(joint);
        let date1 = new Date(this.daytime_start_end[1]);
        if (date < date1)
          return this.$message.warning("按累计查询时间范围仅支持三个月内");
      }

      this.pageData.page = 1;
      if (this.formInline.queryCondition) {
        this.getTableListStatus = "search";
      } else if (this.departId || this.departId === 0) {
        this.getTableListStatus = "search";
      } else if (this.userGroupId.length != 0) {
        this.getTableListStatus = "search";
      } else if (this.selectedDevice.length != 0) {
        this.getTableListStatus = "search";
      } else if (this.formInline.wallet_type_id) {
        this.getTableListStatus = "search";
      } else {
        this.getTableListStatus = "all";
      }
      this.getTotalUserDayConsume();
    },
    // 刷新
    refreshOrder() {
      (this.isDay = true),
        (this.isMounth = false),
        (this.isTotal = false),
        this.initDate();
      this.pageData.page = 1;
      this.getTableListStatus = "all";
      this.getTotalUserDayConsume();
    },

    /*  分页 */
    handleSizeChange(val) {
      this.pageLoading = true;
      this.pageData.page_size = val;
      this.getdayConsumeList();
    },
    handleCurrentChange(val) {
      this.pageLoading = true;
      this.pageData.page = val;
      this.getdayConsumeList();
    },
    listSetClick() {
      for (let key in this.listFieldVisible) {
        this.listSetting.forEach((item) => {
          if (key === item.key) {
            item.checked = this.listFieldVisible[key];
          }
        });
      }
    },
    async saveListSet() {
      this.listSetting.forEach((item) => {
        for (let key in this.listFieldVisible) {
          if (item.key === key) {
            console.log(item, "item");
            console.log(key, "item");
            this.listFieldVisible[key] = item.checked;
          }
        }
      });
      console.log("listFieldVisible", this.listFieldVisible);
      console.log("defaultListFieldVisible", this.defaultListFieldVisible);
      await this.$store.dispatch(
        "user/setPersonalSummaryColumn",
        deepCopy(this.listFieldVisible)
      );
      this.$refs.vexTableRef.refreshColumn();
      this.listSetVisible = false;
    },
    //恢复默认
    defaultListSet() {
      console.log("defaultListFieldVisible", this.defaultListFieldVisible);
      for (let key in this.defaultListFieldVisible) {
        this.listSetting.forEach((item) => {
          if (key === item.key) {
            console.log("item", item);
            item.checked = this.defaultListFieldVisible[key];
          }
        });
      }
    },
    randomString(length) {
      let str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = length; i > 0; --i)
        result += str[Math.floor(Math.random() * str.length)];
      return result;
    },
    getCardTypeList() {
      allCardTypeList({
        canteen_id: this.canteenId,
      })
        .then((res) => {
          this.cardTypeList = res.data.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    cardIdToCardName(id) {
      const type = this.cardTypeList.find((x) => x.id === id);
      return type !== undefined ? type.type_name : "null";
    },

    /*  分页 */
  },
};
</script>
<style>
.el-popover {
  padding: 12px !important;
}
</style>
<style lang="scss" scoped>
/deep/ .el-table__body-wrapper {
  z-index: 2;
}
.header {
  background-color: #fff;
  padding: 20px 40px;
  .titleName {
    font-size: 16px;
  }
  .title {
    font-size: 20px;
    margin-right: 40px;
  }
}
.raw-type-style {
  height: 400px;
  border-right: 1px solid #dcdfe6;
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
.border_bottom {
  border-bottom: 1px solid #eee;
}
/deep/.vue-treeselect__multi-value-item-container {
  line-height: initial;
}
/deep/.vue-treeselect__multi-value-item {
  line-height: initial;
}
/deep/.vue-treeselect__multi-value {
  margin-top: 4px;
}
/deep/.vue-treeselect__value-container {
  height: 20px;
  line-height: 20px;
  box-sizing: border-box;
}
</style>
