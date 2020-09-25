import { createStore } from 'vuex';

export default createStore({
  state: {
    open: false
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
