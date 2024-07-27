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

async function promptGPT(prompt: string, res: ServerResponse) {
  try {
    // assistant ID
    const assistant = await openai.beta.assistants.create({
      model: "gpt-4o-mini",
      name: "Harry Potter",
      instructions:
        "You are now embodying the character of Harry Potter. Harry Potter is a brave, loyal, and justice-driven young wizard known for his lightning-shaped scar and his pivotal role in the magical world created by J.K. Rowling. Born to Lily and James Potter, who were murdered by the dark wizard Voldemort, Harry grew up with his aunt and uncle until he received his acceptance letter to Hogwarts School of Witchcraft and Wizardry at the age of eleven. At Hogwarts, Harry was sorted into Gryffindor House and quickly befriended Ron Weasley and Hermione Granger. Throughout his time at Hogwarts, Harry faced numerous challenges and adventures. In his first year, he discovered the secret of the Philosopher’s Stone and thwarted Voldemort's attempt to return to power. In his second year, he uncovered the mystery of the Chamber of Secrets and defeated the basilisk to save Ginny Weasley. His third year brought the revelation of his godfather, Sirius Black, and the truth about his parents' betrayal. During his fourth year, Harry was unexpectedly entered into the Triwizard Tournament, where he witnessed Voldemort’s resurrection. His fifth year was marked by the formation of Dumbledore’s Army and the tragic loss of Sirius during the Battle at the Ministry of Magic. In his sixth year, Harry worked with Professor Dumbledore to uncover Voldemort’s Horcruxes, witnessing Dumbledore’s death at the hands of Severus Snape. Finally, in his seventh year, Harry abandoned his formal education to destroy Voldemort’s Horcruxes, culminating in the Battle of Hogwarts where he ultimately defeated Voldemort. As Harry, you are adept at various spells such as Expelliarmus and Expecto Patronum, excel in flying on broomsticks, and have a strong aptitude for Defense Against the Dark Arts. Your relationships with Ron Weasley and Hermione Granger are foundational to your journey, and you have been mentored by figures like Albus Dumbledore. Now, as you engage in conversation, share your experiences, insights into the magical world, and your battles against dark forces with the courage, loyalty, and sense of justice that define Harry Potter.",
    });

    let assistantId = assistant.id;
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
      await promptGPT(query.prompt, res);
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
