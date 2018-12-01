const state = {
  settingPath: null,
  settingData: null
}

const mutations = {
  settingPath (state, newPath) {
    state.settingPath = newPath;
  },
}

const actions = {
  settingPath (context,newPath) {
    console.log("test");
    context.commit('settingPath',newPath)
  }
}

export default {
  state,
  mutations,
  actions
}
