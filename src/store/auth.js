// store/index.js
import axios from "axios"; // Axios import 추가
// Axios 요청 인터셉터 설정

const state = {
  accessToken: localStorage.getItem("accessToken") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  member: localStorage.getItem("member") || "",
  isAuthenticated: false,
};
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
  },
  setRefreshToken(state, refreshToken) {
    state.refreshToken = refreshToken;
  },
  setMember(state, member) {
    state.member = member;
  },
  setAuthenticated(state, status) {
    state.isAuthenticated = status;
  },
  clearAuthToken(state) {
    state.accessToken = "";
    state.refreshToken = "";
    state.member = "";
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("member");
  },
};

const actions = {
  login({ commit }, { email, password }) {
    return axios
      .post(
        `${process.env.VUE_APP_BACKEND_ORIGIN}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.accessToken) {
          console.log("setAccessToken");
          commit("setAccessToken", response.data.accessToken);
          commit("setRefreshToken", response.data.refreshToken);
          commit("setAuthenticated", true);
          // localStorage.setItem("member", JSON.stringify(response.data));
        }
        return response.data;
      });
  },
  logout({ commit }) {
    commit("setMember", "");
    commit("setAccessToken", "");
    commit("setRefreshToken", "");
  },
  fetchMember({ commit, state }) {
    if (state.accessToken) {
      return axios
        .get(`${process.env.VUE_APP_BACKEND_ORIGIN}/api/member`, {
          withCredentials: true,
        })
        .then((response) => {
          commit("setMember", response.data);
          console.log("setMember suuccess");
        })
        .catch((error) => {
          console.error("Failed to fetch member", error);
        });
    }
  },
  async refreshToken({ commit, state }) {
    try {
      const response = await axios.post(
        `${process.env.VUE_APP_BACKEND_ORIGIN}/api/auth/refresh`,
        {
          refreshToken: state.refreshToken,
        },
        {
          // config 설정
          _retry: true,
        }
      );
      commit("setAccessToken", response.data.accessToken);
      commit("setRefreshToken", response.data.refreshToken);
      return response;
    } catch (error) {
      commit("clearAuthToken");
      throw error;
    }
  },
  checkAuth({ commit }) {
    console.log("test checkauth");
    try {
      commit("setAuthenticated", true);
      return axios.get(`${process.env.VUE_APP_BACKEND_ORIGIN}/api/auth`);
    } catch (error) {
      commit("clearAuthToken");
      commit("setAuthenticated", false);
      throw error;
    }
  },
};
const getters = {
  getAccessToken(state) {
    return state.accessToken;
  },
  getMember(state) {
    return state.member;
  },
  getRefreshToken(state) {
    return state.refreshToken;
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};