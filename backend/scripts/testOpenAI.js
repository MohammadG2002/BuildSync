import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

async function run() {
  try {
    const client = new OpenAI({ apiKey: process.env.AI_API_KEY });
    const model = process.env.AI_MODEL || "gpt-3.5-turbo";

    console.log("Using model:", model);

    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are BuildSync assistant." },
        { role: "user", content: "Say hello in one sentence." },
      ],
      max_tokens: 60,
    });

    console.log("Response:", JSON.stringify(resp, null, 2));
    const text =
      resp?.choices?.[0]?.message?.content ?? resp?.choices?.[0]?.text ?? "";
    console.log("Assistant reply:", text);
  } catch (err) {
    console.error("OpenAI test error:");
    console.error(err);
    if (err.response) {
      try {
        console.error(
          "Response body:",
          JSON.stringify(err.response.data || err.response, null, 2)
        );
      } catch (e) {
        console.error(err.response);
      }
    }
    process.exit(1);
  }
}

run();
