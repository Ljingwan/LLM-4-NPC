<script setup lang="ts"></script>

<template>
  <div class="index-view">
    <div class="header-wrapper">
      <div class="header">
        <div class="logo-wrapper">
          <img
            class="logo"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZD0iTTIyMy45NTUgMjEyLjAxMXM4LjA1NC00LjY3OSAxOS45ODUtNy4wMTFjMjEuMzE4LTQuMTY2IDM5LjQ3Mi01LjUgNDcuNDY2IDguNSA5Ljc3NyAxNy4xMjQgMTguNDAyIDUzLjQxNyAxNi40ODggODUuNS0xIDE2Ljc1LTQuNjIyIDIyLjEyNS00LjYyMiAyMi4xMjVzLTE1LjMzMyA5LjUyNS00Ny4zNDEgNi44NzVjLTM0LjcyNS0yLjg3NS0zOS45NzEtMTUuMDA0LTM5Ljk3MS0xNS4wMDRzNC40OTctMTEuMzA1IDcuOTk1LTQyLjQ5OWMzLjQ5Ny0zMS4xOTQgMC01OC40ODYgMC01OC40ODZ6IiBmaWxsPSIjZmZmZmZmIi8+PHBhdGggZD0iTTE4My45ODQgMjg1YzEyLjU0Ni0zLjMyMyAyMy4wMy03LjE4OSAyNy42NTktOC45ODUuNjkzLTQuNzA3IDEuMjgtOS43MTggMS42OTQtMTUuMDE1LjI3MS0zLjQ2MS40NjUtNi43NTQuNjAyLTkuODk2LTYuODU0LTIuMzMzLTEzLjUzNC00Ljg1MS0yOC43NjktMTAuMTA0LTM4LjY2LTEzLjMzMy01Ny4xNDYtMTctNTcuMTQ2LTE3czE0LjI0LTIuNSA0Mi4yMTkgM2MxOS45ODYgMy45MjkgMzQuMzkyIDkuNSA0My45NDcgMTQuMzMzLjc3MS0xNS45OTktMi40NzctMzIuNTgzLTIuNDc3LTMyLjU4M0MxODkuNzI5IDE2OC41IDExOS41MyAxMTIgODQuMzY4IDExMiA1Ny44ODggMTEyIDMyIDE4MC41IDMyIDI1NnMyMy4wMyAxNDQgNTEuNTEgMTQ0YzMzLjM1NiAwIDExNi40NjMtODAgMTE2LjQ2My04MHM1LjczOC0xMi41NzggOS44NzktMzMuNTcyYy0xOC43ODggNS4xOTgtNjMuODQgOC41NzItNjMuODQgOC41NzJzMjAuOTg0LTUuNSAzNy45NzItMTB6IiBmaWxsPSIjZmZmZmZmIi8+PHBhdGggZD0iTTQyNy42MzIgMTEyYy0zNi4zNyAwLTEwMi4zNjMgNTYuNS0xMjQuMzQ4IDk2Ljc1bC0uNzYxIDEuMzc1czEuMzg5IDIuNTI3IDEuODczIDMuMzc1YzMuNDI0IDUuOTk2IDYuNzA0IDE0LjM0OCA5LjQ0MiAyNC4wNDEgOC4xMTUtMi44MDUgMjMuNTk5LTguMTY0IDM3LjUyMy0xMy4wNDEgMTkuOTg1LTcgMzQuOTc1LTkuNSAzNC45NzUtOS41cy01Mi45ODIgMjMuNzQxLTY5LjYwNSAzNC4yNjRjMi4xNjkgMTAuMTU5IDMuNjkzIDIxLjE5OSA0LjIxOCAzMi4yNDIgNS40MjMgMi4yMTYgMTYuNTUxIDYuNDc1IDI5LjkxNCA5Ljk5NCAxOC45ODYgNSA0MC4zOTggMTEuNSA0MC4zOTggMTEuNXMtNTQuMjAyLTUuMjctNzAuMTE0LTEyLjUyMmExNTQuOTIgMTU0LjkyIDAgMCAxLS4yNjMgOC41MjJjLS45OTcgMTYuNzE5LTQuNjA4IDIyLjEwNC00LjYyMiAyMi4xMjQgNy42MjEgMTAuNTQzIDc1IDc4Ljg3NiAxMTIuMjI4IDc4Ljg3NiAyOC40OCAwIDUxLjUxLTY4LjUgNTEuNTEtMTQ0cy0yNS44ODgtMTQ0LTUyLjM2OC0xNDR6IiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+"
            alt="logo"
          />
          <div class="name">Magic NPC</div>
        </div>
        <div class="avatar-wrapper">
          <div class="nickname">{{ "Valerie" }}</div>
          <el-avatar
            src="https://eskipaper.com/images/harry-potter-6.jpg"
          ></el-avatar>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.header-wrapper {
  background-color: #2f2d52;
  color: #ffffff;
  font-weight: bold;
  font-size: 20px;
  border-radius: 12px 12px 0 0;
  .header {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    .logo-wrapper {
      display: flex;
      align-items: center;
      .logo {
        width: 34px;
        height: 34px;
        margin-right: 16px;
      }
    }
    .avatar-wrapper {
      display: flex;
      align-items: center;
      .nickname {
        margin-right: 16px;
      }
    }
  }
}
</style>
