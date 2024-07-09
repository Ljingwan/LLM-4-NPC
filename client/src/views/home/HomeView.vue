<script setup lang="ts"></script>

<template>
  <div class="home-view">
    <div class="chat-panel">
      <div class="session-panel">
        <div class="title">Magic NPC</div>
        <div class="description">Build your character</div>
      </div>
      <div class="message-panel"></div>
    </div>
  </div>
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

      .session-list {
        .session {
          /* 每个会话之间留一些间距 */
          margin-top: 20px;
        }
      }

      .button-wrapper {
        /* session-panel是相对布局，这边的button-wrapper是相对它绝对布局 */
        position: absolute;
        bottom: 20px;
        left: 0;
        display: flex;
        /* 让内部的按钮显示在右侧 */
        justify-content: flex-end;
        /* 宽度和session-panel一样宽*/
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
      height: 600px;

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
        height: 700px;
        padding: 15px;
        // 消息条数太多时，溢出部分滚动
        overflow-y: scroll;
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
    }
  }
}
</style>
