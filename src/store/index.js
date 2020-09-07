import { createStore } from 'vuex'

export default createStore({
  state: {
    open: false
  },
  mutations: {
    changOpne(state, value) {
      console.log("commit")
      state.open = value
    }
  },
  actions: {
  },
  modules: {
  }
})
