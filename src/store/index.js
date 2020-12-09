import { createStore } from 'vuex';

export default createStore({
  state: {
    open: false,
    keepLiveRoute: []
  },
  mutations: {
    setOpen(state, val) {
      console.log(val)
      state.open = val
    },
  },
  actions: {
  },
  modules: {
  },
});
