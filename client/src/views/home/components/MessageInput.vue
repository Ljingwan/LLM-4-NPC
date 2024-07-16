<script lang="ts" setup>
import { handleError, ref } from "vue";
import { Position } from "@element-plus/icons-vue";
import usePromptInfoStore from "@/stores/prompt"; //引入仓库
import { storeToRefs } from "pinia"; //引入pinia转换
const promptInfo = usePromptInfoStore();
// 发送消息消息事件
const emit = defineEmits<{
  send: [message: string];
}>();
// 输入框内的消息
const message = ref("");
const sendMessage = () => {
  emit("send", message.value);
  // 发送完清除
  message.value = "";
};

const { promptListStore } = storeToRefs(promptInfo); // 响应式

const promptVal = ref("");
const optionsArr = promptListStore;

const handlePromptChanged = (prompt: string) => {
  message.value = prompt;
};
</script>
<template>
  <div class="message-input">
    <div class="input-wrapper">
      <el-input
        v-model="message"
        :autosize="false"
        :rows="3"
        class="input"
        resize="none"
        type="textarea"
        @keydown.enter="sendMessage"
      >
      </el-input>
      <div class="button-wrapper">
        <el-button class="send-btn" type="primary" @click="sendMessage">
          <el-icon class="el-icon--left">
            <Position />
          </el-icon>
          Send
        </el-button>
        <el-select
          class="prompt-select"
          v-model="promptVal"
          placeholder="Select Prompt"
          style="width: 200px"
          @change="handlePromptChanged(promptVal)"
        >
          <el-option
            v-for="item in optionsArr"
            :key="item.name"
            :label="item.name"
            :value="item.desc"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.message-input {
  padding: 20px;
  border: 1px solid rgba(black, 0.07);
  border-radius: 8px;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  .send-btn {
    background-color: #2f2d52;
    border: none;
    margin-right: 15px;
  }
  .prompt-select {
  }
}
</style>
