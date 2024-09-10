<script setup lang="ts">
import { onMounted, PropType, ref } from "vue";
import { ChatMessage } from "../../../../typings";

// message：接受消息对象，展示消息内容和头像，并且根据角色调整消息位置
// avatar：用户头像，如果角色是 Assistant则使用 logo
const props = defineProps({
  message: { type: Object as PropType<ChatMessage>, required: true },
  // avatar: { type: String, default: "https://www.jarcheng.top/images/logo.jpg" },
});
const rateVal = ref(0);

onMounted(() => {
  console.log(props.message);
});
</script>
<template>
  <div :class="['message-row', message.role === 'user' ? 'right' : 'left']">
    <!-- 消息展示，分为上下，上面是头像，下面是消息 -->
    <div class="row">
      <!-- 头像， -->
      <div class="avatar-wrapper">
        <el-avatar
          v-if="message.role === 'user'"
          src="https://th.bing.com/th/id/OIP.-pbIoHlv0ZMIh7itHGh3XgHaHa?w=1000&h=1000&rs=1&pid=ImgDetMain"
          class="avatar"
          shape="square"
        />
        <el-avatar
          v-else
          src="https://eskipaper.com/images/harry-potter-6.jpg"
          class="avatar"
          shape="square"
        />
      </div>
      <!-- 发送的消息或者回复的消息 -->
      <div
        :class="[
          'message',
          message.role === 'user' ? 'user-message' : 'chat-message',
        ]"
      >
        <div v-if="message.content">
          {{ message.content }}
        </div>
        <!-- 消息的内容空显示加载动画 -->
        <!-- <TextLoading v-else></TextLoading> -->
      </div>
      <div v-if="message.role !== 'user'" class="demo-rate-block">
        <el-rate v-model="rateVal" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-row {
  display: flex;

  &.right {
    // 消息显示在右侧
    justify-content: flex-end;

    .row {
      .avatar-wrapper {
        display: flex;
        justify-content: flex-end;
      }

      .user-message {
        background-color: #bdbce6;
        color: #646381;
      }
    }
  }

  // 默认靠左边显示
  .row {
    .avatar-wrapper {
      .avatar {
        box-shadow: 20px 20px 20px 3px rgba(0, 0, 0, 0.03);
        margin-bottom: 20px;
      }
    }

    .message {
      font-size: 15px;
      padding: 10px;
      max-width: 500px;
      border-radius: 7px;
      box-shadow: 20px 20px 20px 1px rgba(0, 0, 0, 0.01);
      background-color: #5d5b8d;
      color: #ffffff;
    }
  }
}
</style>
