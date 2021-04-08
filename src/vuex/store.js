import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
  curMenuData: [], //左侧菜单数据
  activeIndex: '0:0', //左侧菜单高亮索引
}

// 定义所需的 mutations
const mutations = {
  UPDATE_MENU(state, d){
  	state.curMenuData = d;
  },
  UPDATE_MENU_INDEX(state, d){
  	state.activeIndex = d;
  }
}

// 创建 store 实例
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations
})
