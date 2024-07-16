<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue";
0;
import { ChatMessage, ChatSession } from "../../../typings";
import dayjs from "dayjs";
import MessageRow from "./components/MessageRow.vue";
import MessageInput from "./components/MessageInput.vue";
import PromptShop from "./components/PromptShop.vue";
import usePromptInfoStore from "@/stores/prompt"; //引入仓库
import { storeToRefs } from "pinia"; //引入pinia转换
const promptInfo = usePromptInfoStore();

const activeSession = ref({ messages: [] } as ChatSession);
// const promptShow = ref<Boolean>(false);
// const promptShow = ref(false);
const dialogInfo = reactive({
  isShow: false,
});

watch(
  () => dialogInfo.isShow,
  (val) => {
    console.log("父组件监听flag:", val);
  }
);
//  接收子组件传过来的事件
const changeVi = (val: any) => {
  console.log(val);
  dialogInfo.isShow = false;
};

const { promptListStore } = storeToRefs(promptInfo); // 响应式

const getPrompts = (promptList: any) => {
  console.log(promptList);
  promptListStore.value = promptList;
  console.log(promptListStore.value);
};

onMounted(() => {});
const responseMessage = ref({} as ChatMessage);

const handleConnect = (message: string) => {
  // const url = new URL("/chat", location.href);
  // 可配置
  const url = new URL("http://localhost:3000/chat", location.href);
  url.searchParams.set("prompt", message);
  const es = new EventSource(url);

  // 等待响应
  es.onmessage = (e) => {
    // 服务端响应过来的参数
    e.data;
    if (e.data === "[DONE]") {
      return es.close();
    }
    const data = JSON.parse(e.data);

    if (data.choices[0].delta.content) {
      const { content = "" } = data.choices[0].delta;
      responseMessage.value.content += content;
    }
  };
};

const handleSendMessage = (message: string) => {
  handleConnect(message);
  // 新建一个ChatGPT回复对象，不能重复使用同一个对象
  responseMessage.value = {
    role: "assistant",
    content: "",
    // 回复的消息没有标识符，所以统一将创建时间+index作为key
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  } as ChatMessage;

  // user消息
  const chatMessage = {
    session: Object.assign({}, activeSession.value),
    content: message,
    role: "user",
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  } as ChatMessage;

  // 防止循环依赖，会导致json序列化失败
  chatMessage.session.messages = [];

  // 一组问答同时显示在页面
  activeSession.value.messages.push(...[chatMessage, responseMessage.value]);
};

const handlePromptBtn = () => {
  console.log("btn click");
  dialogInfo.isShow = true;
};
</script>

<template>
  <div class="home-view">
    <div class="chat-panel">
      <div class="session-panel">
        <div class="title">Magic NPC</div>
        <div class="description">Build your character</div>
        <el-button class="prompt-btn" @click="handlePromptBtn"
          >Prompt Shop</el-button
        >
      </div>
      <div class="message-panel">
        <div class="message-list no-scrollbar">
          <MessageRow
            v-for="(message, index) in activeSession.messages"
            :key="message.createdAt + index"
            :message="message"
          ></MessageRow>
        </div>

        <!-- 监听发送事件 -->
        <message-input @send="handleSendMessage">消息输入框</message-input>
      </div>
    </div>
  </div>
  <PromptShop
    :dialogVisible="dialogInfo.isShow"
    @changeVi="changeVi"
    @submit="getPrompts"
  ></PromptShop>
</template>

<style lang="scss" scoped>
.home-view {
  width: 100vw;
  display: flex;
  justify-content: center;

  .chat-panel {
    display: flex;
    border-radius: 20px;
    background-color: #ddddf7;
    box-shadow: 0 0 20px 20px rgba(black, 0.05);
    margin-top: 70px;

    .session-panel {
      width: 300px;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      padding: 20px;
      position: relative;
      border-right: 1px solid rgba(black, 0.07);
      background-color: #5d5b8d;
      /* 标题 */
      .title {
        color: #ffffff;
        margin-top: 20px;
        font-size: 20px;
        font-weight: bold;
      }

      /* 描述*/
      .description {
        color: #ffffff;
        font-size: 14px;
        margin-top: 10px;
      }

      .prompt-btn {
        margin-top: 580px;
        width: 300px;
      }

      .session-list {
        .session {
          margin-top: 20px;
        }
      }

      .button-wrapper {
        position: absolute;
        bottom: 20px;
        left: 0;
        display: flex;
        justify-content: flex-end;
        width: 100%;

        /* 按钮于右侧边界留一些距离 */
        .new-session {
          margin-right: 20px;
        }
      }
    }

    /* 右侧消息记录面板*/
    .message-panel {
      width: 1000px;
      // height: 600px;
      padding: 20px;

      .header {
        padding: 20px 20px 0 20px;
        display: flex;
        /* 会话名称和编辑按钮在水平方向上分布左右两边 */
        justify-content: space-between;

        /* 前部的标题和消息条数 */
        .front {
          .title {
            color: rgba(black, 0.7);
            font-size: 20px;
          }

          .description {
            margin-top: 10px;
            color: rgba(black, 0.5);
          }
        }

        /* 尾部的编辑和取消编辑按钮 */
        .rear {
          display: flex;
          align-items: center;
        }
      }

      .message-list {
        height: 500px;
        padding: 15px;
        // 消息条数太多时，溢出部分滚动
        overflow-y: auto;
        // 当切换聊天会话时，消息记录也随之切换的过渡效果
        .list-enter-active,
        .list-leave-active {
          transition: all 0.5s ease;
        }

        .list-enter-from,
        .list-leave-to {
          opacity: 0;
          transform: translateX(30px);
        }
      }
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>
