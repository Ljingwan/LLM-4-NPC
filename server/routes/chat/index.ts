module.exports = (app: any) => {
  const express = require("express");

  // express 的子路由
  const router = express.Router();

  router.post("chatgpt", async (req: any, res: any) => {
    res.end("OK");
  });

  // 挂载子路由
  app.use("/chat/api", router);
};
