// const express = require("express");

// const app = express();

// // 执行函数，传参 app
// require("./routes/chat")(app);

// app.listen(3000, () => {
//   console.log("http://localhost:3000");
// });

import { createServer, ServerResponse } from "http";
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

// openAi Api 上传文件
async function uploadFile(filePath: string) {
  const fs = require("fs");
  const fileStream = fs.createReadStream(filePath);

  const response = await openai.files.create({
    file: fileStream,
    // Specify 'assistants' to use this file for an AI assistant
    purpose: "assistants",
  });

  console.log("Uploaded file ID:", response.id);
  return response.id;
}

const fileIds = uploadFile("./assets/Harry potter.txt");

// 管理文件
async function listFiles() {
  const response = await openai.files.list();
  console.log(response.data);
}

listFiles();

// 向量化存储
async function createVectorStore() {
  const response = await openai.beta.vectorStores.create({
    name: "My Knowledge Base",
    //description: "A store of documents for the assistant to use.",
  });

  console.log("Vector Store ID:", response.id);
  return response.id;
}

// 将文件添加到矢量存储
async function addFilesToVectorStore(vectorStoreId: string, fileIds: any) {
  await openai.beta.vectorStores.fileBatches.createAndPoll(vectorStoreId, {
    file_ids: fileIds,
  });

  console.log("Files added to Vector Store:", vectorStoreId);
}

async function addFile() {
  const fileIds = await uploadFile("./assets/Harry potter.txt");
  const vectorStoreId = await createVectorStore();
  addFilesToVectorStore(vectorStoreId, [fileIds]);
}
addFile();

// 通过assistant使用文件
async function promptGPT(
  prompt: string,
  npc: string,
  desc: string,
  res: ServerResponse,
  vectorStoreId: string
) {
  const ASSISTANT_NAME = "test npc";
  //const ASSISTANT_NAME = npc;
  // let assistant = null;
  // let assistants = await openai.beta.assistants.list();
  // console.log(assistants)
  // let assistant = assistants.data.find(
  //   (assistant) => assistant.name == ASSISTANT_NAME
  // );
  try {
    // assistant ID
    const assistant = await openai.beta.assistants.create({
      model: "gpt-4o-mini",
      name: npc,
      // name: ASSISTANT_NAME,
      instructions: desc,
      tools: [{ type: "file_search" }],
      tool_resources: {
        file_search: {
          // Attach vector store containing the files
          vector_store_ids: [vectorStoreId],
        },
      },
    });
    let assistantId = assistant.id;

    console.log("Created Assistant with Id: " + assistantId + npc + prompt);

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
      assistant_id: assistant.id,
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
      const vectorStoreId = await createVectorStore();
      await promptGPT(query.prompt, query.npc, query.desc, res, vectorStoreId);
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
