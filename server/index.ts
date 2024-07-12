// const express = require("express");

// const app = express();

// // 执行函数，传参 app
// require("./routes/chat")(app);

// app.listen(3000, () => {
//   console.log("http://localhost:3000");
// });

import { createServer } from "http";
import axios from "axios";
import "dotenv/config";
import { Stream } from "stream";
import { createReadStream } from "fs";

const gptApi = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
});

createServer(async (req, res) => {
  const url = new URL(req.url!, "file:///");
  const query = Object.fromEntries(url.searchParams.entries());

  switch (url.pathname) {
    case "/":
      createReadStream("../client/index.html").pipe(res);
      break;
    case "/chat":
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "authorization, Content-Type"
      );
      res.setHeader("Access-Control-Allow-Methods", "*");
      if (!query.prompt) {
        res.statusCode = 400;
        return res.end(
          JSON.stringify({
            message: "no prompt",
          })
        );
      }
      const { data } = await gptApi.post<Stream>(
        "/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: query.prompt }],
          // messages: [{ role: "user", content: "who are you?" }],
          temperature: 0.7,
          max_tokens: 30,
          stream: true,
        },

        // 流式响应
        {
          responseType: "stream",
        }
      );
      data.pipe(res);
      break;
    default:
      res.end("");
  }
}).listen(3000);
console.log("http://localhost:3000");
