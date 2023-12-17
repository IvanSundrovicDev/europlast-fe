import axios from '../axios'

const actions = {

    // ////////////////////////////////////////////
    // SIDEBAR & UI UX
    // ////////////////////////////////////////////

    updateSidebarWidth({ commit }, width) {
      commit('UPDATE_SIDEBAR_WIDTH', width);
    },
    toggleContentOverlay({ commit }) {
      commit('TOGGLE_CONTENT_OVERLAY');
    },
    updateTheme({ commit }, val) {
      commit('UPDATE_THEME', val);
    },
    getCooperants({ commit }) {
      axios({
          method: 'GET',
          url: '/api/kooperanti/index',
      }).then((res) => {
          this.kooperanti = res.data;
          commit('UPDATE_COOPERANTS', res.data)
      }).catch((err) => {
          this.responseErrors = err.response
      })
    },
    getPrices({ commit }) {
      axios({
          method: 'GET',
          url: '/api/cijene/index',
      }).then((res) => {
          this.prices = res.data;
          commit('UPDATE_PRICES', res.data)
      }).catch((err) => {
          this.responseErrors = err.response
      })
    },
    updateWindowWidth({ commit }, width) {
      commit('UPDATE_WINDOW_WIDTH', width);
    },


    // ////////////////////////////////////////////
    // COMPONENT
    // ////////////////////////////////////////////

    // VxAutoSuggest
    updateStarredPage({ commit }, payload) {
      commit('UPDATE_STARRED_PAGE', payload)
    },

    //  The Navbar
    arrangeStarredPagesLimited({ commit }, list) {
      commit('ARRANGE_STARRED_PAGES_LIMITED', list)
    },
    arrangeStarredPagesMore({ commit }, list) {
      commit('ARRANGE_STARRED_PAGES_MORE', list)
    },
}

export default actions
