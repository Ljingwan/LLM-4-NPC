import { defineStore } from "pinia";

const usePromptInfoStore = defineStore("promptInfo", {
  // defineStore('promptInfo',{})  promptInfo: 仓库名称name
  state: () => ({
    promptListStore: [{ name: "", desc: "" }],
  }),
  //   getters: {},
  //   action: {},
  persist: true,
});

export default usePromptInfoStore;
