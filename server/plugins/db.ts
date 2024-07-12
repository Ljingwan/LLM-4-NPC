module.exports = (app: any) => {
  const mongoose = require("mongoose");

  // 链接 MongoDB
  mongoose.connect("mongodb://127.0.0.1:27017/llm-4-npc", {
    useNewUrlParser: true,
  });
};
