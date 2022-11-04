export default {
  namespace: true,
  state: {
    count: 0
  },
  mutations: {
    increase(state) {
      state.count++
    },
    decrease(state) {
      state.count--
    }
  }
}
