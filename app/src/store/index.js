import { createStore } from "vuex";

const initialState = {
  user: {
    name: null,
    email: null,
    token: null,
    role: null,
    permissions: null,
  },
};

export default createStore({
  state: { ...initialState },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user.name = userData.name;
      state.user.email = userData.email;
      state.user.token = userData.token;
      state.user.role = userData.role;
      state.user.permissions = userData.permissions;
    },
    RESET_USER_DATA(state) {
      state.user.name = null;
      state.user.email = null;
      state.user.token = null;
      state.user.role = null;
      state.user.permissions = null;
    },
  },
  actions: {
    login({ commit }, userData) {
      commit("SET_USER_DATA", userData);
    },
    logout({ commit }) {
      commit("RESET_USER_DATA");
    },
  },
  getters: {
    getUserData: (state) => state.user,
  },
});
