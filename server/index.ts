// const express = require("express");

// const app = express();

// // 执行函数，传参 app
// require("./routes/chat")(app);

// app.listen(3000, () => {
//   console.log("http://localhost:3000");
// });

import { createServer, IncomingMessage, ServerResponse } from "http";
import axios from "axios";
import "dotenv/config";
import { createReadStream } from "fs";
import OpenAI from "openai";
const openai = new OpenAI();

const gptApi = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
});

async function promptGPT(prompt: string, npc: string, res: ServerResponse) {
  try {
    // assistant ID
    // const assistant = await openai.beta.assistants.create({
    //   model: "gpt-4o-mini",
    //   name: "Harry Potter",
    //   instructions:
    //     "You are now embodying the character of Harry Potter.",
    // });
    let assistantId = "";
    if (npc === "Harry Potter") {
      assistantId = "asst_QL1dV69L7D8ASrFo4BuZ7ra2";
    } else if (npc === "Albus Dumbledore") {
      assistantId = "asst_vjzVM1kH6qZYgBZu5neq5EL4";
    } else if (npc === "Lord Voldemort") {
      assistantId = "asst_f6Kx8xHe5EY4CGfV97zIUwef";
    }
    console.log("Created Assistant with Id: " + assistantId);

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    let threadId = thread.id;
    console.log("Created thread with Id: " + threadId);

    const run = openai.beta.threads.runs.createAndStream(threadId, {
      assistant_id: assistantId,
      stream: true,
    });

    run.on("textDelta", (textDelta: any) => {
      console.log("Received chunk:", textDelta.value);
      res.write(`data: ${textDelta.value}\n\n`);
    });

    run.on("end", () => {
      console.log("Stream ended.");
      res.write("data: [DONE]\n\n");
      res.end();
    });

    run.on("error", (err: any) => {
      console.error("Stream error:", err);
      res.statusCode = 500;
      res.end(JSON.stringify({ message: "Internal Server Error" }));
    });

    const result = await run.finalRun();
    console.log("Run Result" + result);
  } catch (error: any) {
    console.error(
      "API call error:",
      error.response ? error.response.data : error.message
    );
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
}

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
      await promptGPT(query.prompt, query.npc, res);
      break;
    default:
      res.end("");
    //   const { data } = await gptApi.post<Stream>(
    //     "/chat/completions",
    //     {
    //       model: "gpt-4o-mini",
    //       messages: [{ role: "user", content: query.prompt }],
    //       temperature: 0.7,
    //       max_tokens: 30,
    //       stream: true,
    //     },

    //     // 流式响应
    //     {
    //       responseType: "stream",
    //     }
    //   );
    //   data.pipe(res);
    //   break;
    // default:
    //   res.end("");
  }
}).listen(3000);
console.log("http://localhost:3000");
