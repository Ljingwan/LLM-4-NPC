<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue";
0;
import { ChatMessage, ChatSession } from "../../../typings";
import dayjs from "dayjs";
import MessageRow from "./components/MessageRow.vue";
import MessageInput from "./components/MessageInput.vue";
// import SessionItem from "./components/SessionItem.vue";
import PromptShop from "./components/PromptShop.vue";
import usePromptInfoStore from "@/stores/prompt"; //引入仓库
import { storeToRefs } from "pinia"; //引入pinia转换
const promptInfo = usePromptInfoStore();

const activeSessionH = ref({ messages: [] } as ChatSession);
const activeSessionD = ref({ messages: [] } as ChatSession);
const activeSessionV = ref({ messages: [] } as ChatSession);
let activeSession = ref({ messages: [] } as ChatSession);
// let sessionList = ref([] as ChatSession[]);

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

// 切换会话
// const handleSessionSwitch = (session: ChatSession) => {
//   activeSession.value = session;
// };

let npcName = ref("");
const handleChatChange = (name: string) => {
  npcName.value = name;
  activeSession.value.messages = [];
};

const handleConnect = (message: string, npcName: string) => {
  // const url = new URL("/chat", location.href);
  // 可配置
  const url = new URL("http://localhost:3000/chat", location.href);
  url.searchParams.set("prompt", message);
  url.searchParams.set("npc", npcName);
  const es = new EventSource(url);

  // 等待响应
  es.onmessage = (e) => {
    // 服务端响应过来的参数
    e.data;
    console.log(e.data);
    if (e.data === "[DONE]") {
      return es.close();
    }
    // const data = JSON.parse(e.data);

    // if (data.choices[0].delta.content) {
    // const { content = "" } = data.choices[0].delta;
    responseMessage.value.content += e.data;
    // }
  };
};

const handleSendMessage = (message: string) => {
  handleConnect(message, npcName.value);
  // 新建一个ChatGPT回复对象，不能重复使用同一个对象
  responseMessage.value = {
    role: "assistant",
    content: "",
    // 回复的消息没有标识符，所以统一将创建时间+index作为key
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  } as ChatMessage;

  // user消息
  const chatMessage = {
    session: Object.assign(
      {},
      npcName.value === "Harry Potter"
        ? activeSessionH.value
        : npcName.value === "Albus Dumbledore"
        ? activeSessionD.value
        : activeSessionV.value
    ),
    content: message,
    role: "user",
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  } as ChatMessage;

  // 防止循环依赖，会导致json序列化失败
  chatMessage.session.messages = [];

  // 一组问答同时显示在页面
  (npcName.value === "Harry Potter"
    ? activeSessionH.value
    : npcName.value === "Albus Dumbledore"
    ? activeSessionD.value
    : activeSessionV.value
  ).messages.push(...[chatMessage, responseMessage.value]);
  // activeSession.value.messages.push(...[chatMessage, responseMessage.value]);

  //
  activeSession.value =
    npcName.value === "Harry Potter"
      ? activeSessionH.value
      : npcName.value === "Albus Dumbledore"
      ? activeSessionD.value
      : activeSessionV.value;
};

// 人物prompt修改
const handleNpcEdit = (name: string) => {
  console.log('edit----------' + name);
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
        <div class="session-list">
          <div class="session-item" @click="handleChatChange('Harry Potter')">
            <div class="name">Harry Potter</div>
            <Edit class="edit" @click.stop="handleNpcEdit('Harry Potter')" />
            <div class="mask"></div>
          </div>
          <div
            class="session-item"
            @click="handleChatChange('Albus Dumbledore')"
          >
            <div class="name">Albus Dumbledore</div>
            <Edit
              class="edit"
              @click.stop="handleNpcEdit('Albus Dumbledore')"
            />
            <div class="mask"></div>
          </div>
          <div class="session-item" @click="handleChatChange('Lord Voldemort')">
            <div class="name">Lord Voldemort</div>
            <Edit class="edit" @click.stop="handleNpcEdit('Lord Voldemort')" />
            <div class="mask"></div>
          </div>
        </div>
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
        margin-top: 380px;
        width: 300px;
      }

      .session-list {
        .session {
          margin-top: 20px;
        }
        .session-item {
          display: flex;
          /* 加一下padding不要让会话内容靠边界太近 */
          padding: 18px;
          margin-top: 15px;
          background-color: white;
          /* 给边界一些圆角看起来圆润一些 */
          border-radius: 10px;
          /* 固定宽度 */
          width: 260px;
          /* 当鼠标放在会话上时改变鼠标的样式，暗示用户可以点击。目前还没做拖动的效果，以后会做。 */
          cursor: pointer;
          /* 父相子绝，父元素是相对布局的情况下，子元素的绝对布局是相当于父元素绝对布局。 */
          position: relative;
          /* 子元素的遮罩一开始会在外面，让溢出的遮罩不显示 */
          overflow: hidden;

          .name {
            /* 会话名称字体要大一些 */
            font-size: 14px;
            /* 凸显名称，加粗 */
            font-weight: 700;
            width: 200px;
            /* 加粗后颜色淡一些 */
            color: rgba(black, 0.8);
          }

          .edit {
            width: 1.2em;
            height: 1.2em;
            justify-content: space-between;
          }

          .count-time {
            /* 增加一些距离 */
            margin-top: 10px;
            /* 让字体小一些不能比会话名称要大（14px） */
            font-size: 10px;
            color: rgba(black, 0.5);
            /* 让消息数量和最近更新时间显示水平显示 */
            display: flex;
            /* 让消息数量和最近更新时间分布在水平方向的两端 */
            justify-content: space-between;
          }

          /* 当处于激活状态时增加蓝色描边 */
          &.active {
            /* 增加一些过渡 */
            transition: all 0.12s linear;
            border: 2px solid #1d93ab;
          }

          /* 当鼠标放在会话上时触发下面的css样式*/
          &:hover {
            /* 遮罩入场，从最左侧滑进去，渐渐变得不透明 */
            .mask {
              opacity: 1;
              left: 0;
            }

            .btn-wrapper {
              /* 暗示用户这个按钮可以点击 */
              &:hover {
                cursor: pointer;
              }

              /* 按钮入场，从最右侧滑进去，渐渐变得不透明 */
              opacity: 1;
              right: 20px;
            }
          }

          .mask {
            /* 渐变样式 */
            transition: all 0.2s ease-out;
            /* 相当于父亲绝对布局 */
            position: absolute;
            background-color: rgba(black, 0.05);
            /* 和父亲元素一样宽盖住父元素 */
            width: 100%;
            /* 和父亲元素一样高 */
            height: 100%;
            /*位置移到父元素的最上面 */
            top: 0;
            /* 向父元素的最左侧再增加一个父亲元素当前宽度的距离 */
            left: -100%;
            /* 透明度为0 */
            opacity: 0;
          }
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
