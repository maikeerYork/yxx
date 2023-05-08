import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    // 定义一个userName属性，供全局使用
    userName: 'admin',
    // 定义一个userAge属性，供全局使用
    userAge: '24',
    list: [],
    canteen_info: [],
    company_info: [],
    mix_info: [],
    canteen_check: [],
    newCanteen_check: [],
    newClient_id: [],
    chimee: [],
    personalSummaryColumn: null,
    canteen_id: '',
    canteen_name: '',
  },
  getters: {
    company_info: state => state.company_info,
    canteen_check: state => state.canteen_check,
    mix_info: state => state.mix_info,
    canteen_info: state => state.canteen_info,
    newCanteen_check: state => state.newCanteen_check,
    newClient_id: state => state.newClient_id,
    personalSummaryColumn: state => state.personalSummaryColumn,
    canteen_name: state => state.canteen_name,
    canteen_id: state => state.canteen_id,
  },
  mutations: {
    operationChimee(state, chiee) {
      // 变更状态
      state.chimee.push(chiee)
    }
  },
  actions: {
    operationChimee({ commit }, { chiee }) {
      commit('operationChimee', chiee)
    },
  },
  modules: {},
})
export default store