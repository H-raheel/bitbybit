// import { Mistral } from '@mistralai/mistralai';
import { NextResponse } from "next/server";
import OpenAI from "openai";
const token = process.env.NEXT_MODEL_API;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

const getOpenAIClient = () => {
  if (!token) throw new Error("Mistral API token not found");
  return new OpenAI({
    apiKey: token,
    baseURL: endpoint,
  });
};

export async function GET() {
  try {
    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: "system",
          content:
            "List 20 development/Engineering/Computer Science related topics and sub topics within the main areas as well.Only Return the result of topics. Format the results of the topic in an array in the following way: [topic1,topic2,topic3.....]. Return ONLY an array of topics. No sentences. No greetings.",
        },
      ],
      temperature: 1.0,

      top_p: 1.0,
    });

    return NextResponse.json({
      content:
        response?.choices?.[0]?.message?.content || "No response generated",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

